/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import UnauthorizedError from "@/error/unauthorized";
import { SQLUniqueError } from "@/error/uniqueError";
// import isAuthenticated from "@/middlewares/auth";
import createContext from "@/pages/api/trpc/__context";
import { verifyJWT } from "@/utils/jwt";
import verifyToken from "@/utils/verifyToken";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { UniqueConstraintError } from "sequelize";
import { ZodError } from "zod";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create({
    errorFormatter(opts) {
      const { shape, error } = opts;
      return {
        ...shape,
        data: {
          ...shape.data,
          internalErrors: error.code === "INTERNAL_SERVER_ERROR" || error.cause,
          zodErrors:
            error.code === "BAD_REQUEST" && error.cause instanceof ZodError
              ? error.cause.flatten()
              : undefined,
          SQLErrors: {
            uniqueError:
              error.code === "BAD_REQUEST" &&
              error.cause instanceof SQLUniqueError
                ? error.cause.flatten()
                : undefined,
          },
          unauthorized: error.code === "UNAUTHORIZED" ? error.cause : undefined,
          notFound: error.code === "NOT_FOUND" ? error.cause : undefined,
        },
      };
    },
  });

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const { ctx } = opts;
  console.log(await verifyToken(ctx.token), ctx);
  if (!ctx)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
      cause: new UnauthorizedError("Invalid Token"),
    });

  if (!(await verifyToken(ctx.token)))
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Token does not match or expired",
      cause: new UnauthorizedError("Invalid Token"),
    });

  return opts.next();
});
export const protectedProcedure = publicProcedure.use(isAuthenticated);
