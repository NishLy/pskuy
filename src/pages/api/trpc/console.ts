import { publicProcedure } from "@/server/trpc";
import {
  CONSOLE_QUERY,
  findAllConsoleRecordAssoc,
  showAllConsole,
} from "@/services/console";
import { TRPCError } from "@trpc/server";
import z from "zod";

const consoleProcedures = {
  showAllConsole: publicProcedure
    .input(
      z.object({
        manufactur: z.optional(
          z.union([
            z.literal("sony"),
            z.literal("microsoft"),
            z.literal("nitendo"),
          ])
        ),
        type: z.optional(
          z.union([
            z.literal("playstation"),
            z.literal("xbox"),
            z.literal("switch"),
          ])
        ),
        type_storage: z.optional(
          z.union([z.literal("hdd"), z.literal("dvd"), z.literal("ssd")])
        ),
      })
    )

    .query(async ({ input }) => {
      const query = { ...input } as CONSOLE_QUERY;
      const consoles = await showAllConsole(query).catch(errorHandler);
      if (!(consoles instanceof Array)) return { consoles: [] };
      return { consoles };
    }),

  showAllConsoleAssoc: publicProcedure
    .input(
      z.object({
        id: z.optional(z.string()),
        name: z.optional(z.string()),
      })
    )
    .query(async ({ input }) => {
      const consoles = await findAllConsoleRecordAssoc(input).catch(
        errorHandler
      );
      return { consoles };
    }),
};

const errorHandler = (err: Error) => {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
  //   if (err instanceof ForeignKeyConstraintError)
  //     throw new TRPCError({
  //       message: "Id user tidak terdaftar",
  //       code: "BAD_REQUEST",
  //       cause: err,
  //     });
  //   if (err instanceof UniqueConstraintError)
  //     throw new TRPCError({
  //       code: "BAD_REQUEST",
  //       cause: new SQLUniqueError("Duplicate Entries", {
  //         cause: { ...err.fields },
  //       }),
  //     });
};

export default consoleProcedures;
