/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import * as trpcNext from "@trpc/server/adapters/next";
import { router } from "../../../server/trpc";
import loginProcedures from "./signin";
import registerProcedures from "./register";
import ownerProcedures from "./owner";
import createContext from "./__context";
import rentalProcedures from "./rental";
import roomProcedures from "./room";
import joystickProcedures from "./joystick";
import consoleProcedures from "./console";
import transactionProcedures from "./transactions";
import userProcedures from "./user";

export const appRouter = router({
  ...loginProcedures,
  ...registerProcedures,
  ...ownerProcedures,
  ...rentalProcedures,
  ...roomProcedures,
  ...joystickProcedures,
  ...consoleProcedures,
  ...transactionProcedures,
  ...userProcedures,
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  onError(opts) {
    const { error } = opts;
    console.error("Error:", error, opts.error.cause);
  },
});
