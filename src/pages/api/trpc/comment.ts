import { SQLUniqueError } from "@/error/uniqueError";
import Transaction from "@/models/transaction";
import { protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import {
  ForeignKeyConstraintError,
  Op,
  UniqueConstraintError,
} from "sequelize";
import z from "zod";

const commentProcedures = {
  /* The code `getAllRoomComments` is defining a procedure called `getAllRoomComments` that is protected,
meaning it requires authentication to access. */
  getAllRoomComments: protectedProcedure
    .input(z.object({ id_room: z.number(), offset: z.number() }))
    .query(async ({ input }) => {
      const results = await Transaction.findAndCountAll({
        where: {
          id_room: input.id_room,
          comment: {
            [Op.not]: null,
          },
        },
        attributes: ["comment", "updatedAt"],
        limit: 10,
        offset: input.offset,
      }).catch(errorHandler);
      return results;
    }),
};

const errorHandler = (err: Error) => {
  if (err instanceof ForeignKeyConstraintError)
    throw new TRPCError({
      message: err.message,
      code: "BAD_REQUEST",
      cause: err,
    });
  else if (err instanceof UniqueConstraintError)
    throw new TRPCError({
      message: err.message,
      code: "BAD_REQUEST",
      cause: new SQLUniqueError("Duplicate Entries", {
        cause: { ...err.fields },
      }),
    });
  throw new TRPCError({
    message: "Internal Error",
    code: "BAD_REQUEST",
    cause: err,
  });
};

export default commentProcedures;
