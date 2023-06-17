// import UnauthorizedError from "@/error/unauthorized";
// import { middleware } from "@/server/trpc";
// import { verifyJWT } from "@/utils/jwt";
// import { TRPCError } from "@trpc/server";

// const isAuthenticated = middleware(async (opts) => {
//   const { ctx } = opts;
//   if (!ctx.token)
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "User not authenticated",
//       cause: new UnauthorizedError("Invalid Token"),
//     });

//   if (await verifyJWT(ctx.token?.split(" ")[1]))
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Token does not match or expired",
//       cause: new UnauthorizedError("Invalid Token"),
//     });

//   return opts.next();
// });

// export default isAuthenticated;
