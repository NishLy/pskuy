import NotFoundError from "@/error/notFound";
import UnauthorizedError from "@/error/unauthorized";
import sequelizeConnection from "@/models/connection";
import Owner from "@/models/owner";
import Transaction from "@/models/transaction";
import User from "@/models/user";
import { protectedProcedure, publicProcedure } from "@/server/trpc";
import loginUser, { loginOwner } from "@/services/login";
import { findOneOwnerRecord } from "@/services/owner";
import { findOneUserRecord } from "@/services/user";
import { TRPCError } from "@trpc/server";
import { Sequelize } from "sequelize";
import { z } from "zod";

const errorHandler = (err: UnauthorizedError | NotFoundError) => {
  if (err instanceof UnauthorizedError)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: err.message,
      cause: { password: err.message },
    });
  if (err instanceof NotFoundError)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "USER NOT FOUND",
      cause: { username: err.message },
    });
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    cause: err,
  });
};

const accountProcedures = {
  getAccountDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isUser: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      let user: Owner | User | null;

      if (input.isUser)
        user = await findOneUserRecord({ id: input.id }).catch(errorHandler);
      else user = await findOneOwnerRecord(input.id).catch(errorHandler);
      //   if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const transactions = await Transaction.findAll({
        attributes: [
          [
            sequelizeConnection.fn("COUNT", sequelizeConnection.col("id")),
            "total",
          ],
        ],
        where: { id_user: input.id },
      });

      return { user, transactions: transactions[0] };
    }),
};

export default accountProcedures;
