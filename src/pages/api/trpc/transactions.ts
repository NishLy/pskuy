import { SQLUniqueError } from "@/error/uniqueError";
import { TypeTransactionsStatus } from "@/interfaces/status";
import { protectedProcedure } from "@/server/trpc";
import { findOneRoom } from "@/services/room";
import createTransactionRecord, {
  findOneTranscationRecord,
} from "@/services/transaction";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import z from "zod";

const transactionProcedures = {
  createTransaction: protectedProcedure
    .input(
      z.object({
        id_user: z.string(),
        id_rental: z.number(),
        id_room: z.number(),
        rent_time: z.number(),
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
        status: TypeTransactionsStatus.ongoing,
        time_checkIn: new Date(),
        time_checkOut: new Date(),
        total_prices: room?.price_per_hour * input.rent_time,
      };

      const transaction = await createTransactionRecord(data).catch(
        errorHandler
      );
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
};

export default transactionProcedures;

const errorHandler = (err: Error) => {
  console.log(err);
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
