import { SQLUniqueError } from "@/error/uniqueError";
import { TypeTransactionsStatus } from "@/interfaces/status";
import { protectedProcedure, router } from "@/server/trpc";
import { findOneRoom } from "@/services/room";
import corn from "cron";
import {
  createTransactionRecord,
  editFeedbackTransactionRecord,
  editStatusTransactionRecord,
  findAllOwnerTransactionRecord,
  findAllTransactionRecordAssoc,
  findOneTranscationRecord,
} from "@/services/transaction";
import { TRPCError } from "@trpc/server";
import {
  ForeignKeyConstraintError,
  Op,
  UniqueConstraintError,
} from "sequelize";
import z from "zod";
import Transaction from "@/models/transaction";
import User from "@/models/user";

const proccessMap = new Map<number, corn.CronJob>();
const ongoingMap = new Map<number, corn.CronJob>();

const transactionProcedures = {
  createTransaction: protectedProcedure
    .input(
      z.object({
        id_user: z.string(),
        id_rental: z.number(),
        id_room: z.number(),
        rent_time: z.number(),
        time_checkIn: z.string(),
        time_checkOut: z.string(),
      })
    )
    .query(async ({ input }) => {
      const room = await findOneRoom({ id: input.id_room }).catch(errorHandler);

      if (!room)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: room,
        });

      const data = {
        ...input,
        status: TypeTransactionsStatus.proccess,
        time_checkIn: new Date(input.time_checkIn),
        time_checkOut: new Date(input.time_checkOut),
        total_prices: room?.price_per_hour * input.rent_time,
      };

      const transaction = await createTransactionRecord(data).catch(
        errorHandler
      );
      console.log(transaction);
      if (transaction) {
        proccessMap.set(
          transaction.id,
          new corn.CronJob(data.time_checkIn, () => {
            transaction.set("status", TypeTransactionsStatus.cancel);
            transaction.save().catch(errorHandler);
            console.log("executed", Date.now());
            proccessMap.delete(transaction.id);
          })
        );
      }
      proccessMap.get(transaction.id)?.start();

      return { transaction };
    }),

  findOneTransaction: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        id_user: z.string(),
        id_rental: z.number(),
        id_room: z.number(),
      })
    )
    .query(async ({ input }) => {
      const transaction = await findOneTranscationRecord(input).catch(
        errorHandler
      );
      return { transaction };
    }),

  findAllTransaction: protectedProcedure
    .input(
      z.object({
        parameters: z.object({ id_user: z.string() }),
        offset: z.optional(z.number()),
      })
    )
    .query(async ({ input }) => {
      const transactions = await findAllTransactionRecordAssoc(
        input.parameters,
        input.offset
      ).catch(errorHandler);
      return { transactions };
    }),

  findAllOwnerTransaction: protectedProcedure
    .input(
      z.object({
        parameters: z.object({ id_owner: z.string() }),
        offset: z.optional(z.number()),
      })
    )
    .query(async ({ input }) => {
      const transactions = await findAllOwnerTransactionRecord(
        input.parameters,
        input.offset
      ).catch(errorHandler);
      return { transactions };
    }),
  editUserTransaction: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.union([z.literal("finished"), z.literal("cancel")]),
      })
    )
    .query(async ({ input }) => {
      const result = await editStatusTransactionRecord(input).catch(
        errorHandler
      );
      return { result };
    }),
  editOwnerTransaction: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.union([
          z.literal("finished"),
          z.literal("ongoing"),
          z.literal("cancel"),
        ]),
      })
    )
    .query(async ({ input }) => {
      const result = await editStatusTransactionRecord(input).catch(
        errorHandler
      );

      if (input.status === "ongoing" && result[0] !== 0) {
        proccessMap.get(input.id)?.stop();
        proccessMap.delete(input.id);
        const transaction = await findOneTranscationRecord({
          id: input.id,
        }).catch(errorHandler);

        ongoingMap.set(
          input.id,
          new corn.CronJob(
            new Date(transaction?.time_checkOut ?? Date.now()),
            () => {
              transaction?.set("status", TypeTransactionsStatus.completed);
              transaction?.save().catch(errorHandler);
              ongoingMap.delete(input.id);
            }
          )
        );
        ongoingMap.get(input.id)?.start();
      }
      return { result };
    }),
  editFeedbackTransaction: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        id_user: z.string(),
        id_rental: z.number(),
        id_room: z.number(),
        comment: z.string(),
        rating: z.number().min(1).max(5),
      })
    )
    .query(async ({ input }) => {
      const result = await editFeedbackTransactionRecord(input).catch(
        errorHandler
      );
      return { result };
    }),
};

export default transactionProcedures;

const errorHandler = (err: Error) => {
  console.log(err, "fasfa");
  if (err instanceof ForeignKeyConstraintError)
    throw new TRPCError({
      message: "Id Transaksi tidak terdaftar",
      code: "BAD_REQUEST",
      cause: err,
    });

  if (err instanceof UniqueConstraintError)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Transaksi telah ada",
      cause: new SQLUniqueError("Duplicate Entries", {
        cause: { ...err.fields },
      }),
    });

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    cause: err,
  });
};

const findAllTransactions = router({
  ByIdRoom: protectedProcedure
    .input(
      z.object({
        where: z.object({ id_room: z.number() }),
        offset: z.optional(z.number()),
      })
    )
    .query(async ({ input }) => {
      const results = await Transaction.findAndCountAll({
        where: {
          id_room: input.where.id_room,
          comment: {
            [Op.not]: null,
          },
          rating: {
            [Op.not]: null,
          },
        },
        order: [["updatedAt", "DESC"]],
        limit: 10,
        include: [{ model: User, attributes: ["username", "profile_image"] }],
        offset: input.offset,
      }).catch(errorHandler);
      return results;
    }),
});

export const TransactionRouter = router({
  findAll: findAllTransactions,
});
