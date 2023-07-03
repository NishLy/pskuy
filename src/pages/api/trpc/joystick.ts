import { publicProcedure } from "@/server/trpc";
import { CONSOLE_QUERY } from "@/services/console";
import { showAllJoystick } from "@/services/joysticks";
import { TRPCError } from "@trpc/server";
import z from "zod";

const joystickProcedures = {
  showAllJoystick: publicProcedure
    .input(
      z.object({
        manufactur: z.optional(
          z.union([
            z.literal("sony"),
            z.literal("microsoft"),
            z.literal("nitendo"),
          ])
        ),
      })
    )

    .query(async ({ input }) => {
      const query = { ...input } as CONSOLE_QUERY;
      const joysticks = await showAllJoystick(query).catch(errorHandler);
      if (!(joysticks instanceof Array)) return { joysticks: [] };
      return { joysticks };
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

export default joystickProcedures;
