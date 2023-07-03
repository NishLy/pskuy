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
import transactionProcedures, { TransactionRouter } from "./transactions";
import userProcedures from "./user";
import offerProcedures from "./offer";
import accountProcedures from "./account";
import commentProcedures from "./comment";
import favoriteRouter from "./favorite";

/* This code is creating a `router` instance using the `router` function from the `trpc` package. The
`router` instance is being created with multiple procedure objects spread using the spread operator
(`...`). These procedure objects contain the logic for handling various API endpoints. The resulting
`appRouter` object is then exported for use in the `createNextApiHandler` function. */
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
  ...offerProcedures,
  ...accountProcedures,
  ...commentProcedures,
  transactions: TransactionRouter,
  favorite: favoriteRouter,
});

export type AppRouter = typeof appRouter;

/* This code exports a default function that creates a Next.js API route handler using the
`trpcNext.createNextApiHandler` function from the `@trpc/server/adapters/next` package. The function
takes an object with three properties: `router`, `createContext`, and `onError`. */
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
