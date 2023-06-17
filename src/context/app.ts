import createContext from "@/pages/api/trpc/__context";
import { inferAsyncReturnType } from "@trpc/server";
import React from "react";

const AppContext = React.createContext<
  [
    inferAsyncReturnType<typeof createContext> | undefined,
    (
      | React.Dispatch<
          React.SetStateAction<
            inferAsyncReturnType<typeof createContext> | undefined
          >
        >
      | undefined
    )
  ]
>([undefined, undefined]);

export default AppContext;
