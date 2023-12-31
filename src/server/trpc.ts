import UnauthorizedError from "@/error/unauthorized";
import { SQLUniqueError } from "@/error/uniqueError";
import createContext from "@/pages/api/trpc/__context";
import verifyToken from "@/utils/verifyToken";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
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
          internalErrors:
            error.code === "INTERNAL_SERVER_ERROR" ? error.cause : undefined,
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

export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;

export const protectedProcedure = publicProcedure.use(
  middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
        cause: new UnauthorizedError("Invalid Token"),
      });

    if (!ctx.uuid && !ctx.token) return opts.next();

    if (!(await verifyToken(ctx.token)))
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token does not match or expired",
        cause: new UnauthorizedError("Invalid Token"),
      });

    return opts.next();
  })
);
