import NotFoundError from "@/error/notFound";
import UnauthorizedError from "@/error/unauthorized";
import Owner from "@/models/owner";
import User from "@/models/user";
import { publicProcedure } from "@/server/trpc";
import loginUser, { loginOwner } from "@/services/login";
import { signJWT } from "@/utils/jwt";
import { TRPCError } from "@trpc/server";
import z from "zod";

const loginProcedures = {
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        remember: z.boolean(),
        owner: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      let user: Owner | User | undefined;

      if (input.owner)
        user = await loginOwner(input.username, input.password).catch(
          errorHandler
        );
      else
        user = await loginUser(input.username, input.password).catch(
          errorHandler
        );
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const expiresIn = input.remember ? 2592000000 : 7200000;

      return {
        username: user.username,
        email: user.email,
        user_type: user instanceof Owner ? "owner" : "user",
        profile_photo: "",
        remember: input.remember,
        token:
          "Bearer " +
          (await signJWT(
            {
              uuid: user.id.toString(),
              username: user.username,
            },
            Date.now() + expiresIn
          )),
        uuid: user.id.toString(),
        expiresIn,
      };
    }),
};

export default loginProcedures;

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
