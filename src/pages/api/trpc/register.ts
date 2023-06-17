import { SQLUniqueError } from "@/error/uniqueError";
import { publicProcedure } from "@/server/trpc";
import registerUser from "@/services/user";
import { TRPCError } from "@trpc/server";
import { UniqueConstraintError } from "sequelize";
import z from "zod";

const registerProcedures = {
  registerAccount: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string().min(8).max(255),
        number: z.string().min(11).max(14),
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      await registerUser(input).catch(errorHandler);
      return { message: "success" };
    }),
};

const errorHandler = (err: Error) => {
  if (err instanceof UniqueConstraintError)
    throw new TRPCError({
      code: "BAD_REQUEST",
      cause: new SQLUniqueError("Duplicate Entries", {
        cause: { ...err.fields },
      }),
    });

  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
};

export default registerProcedures;
