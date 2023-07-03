import { SQLUniqueError } from "@/error/uniqueError";
import Owner from "@/models/owner";
import { protectedProcedure, publicProcedure } from "@/server/trpc";
import { findOneOwnerRecord, registerOwner } from "@/services/owner";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import z from "zod";
const ownerProcedures = {
  registerOwner: publicProcedure
    .input(
      z.object({
        id_user: z.string(),
        name: z.string(),
        birth_date: z.string(),
        email: z.string(),
        username: z.string(),
        password: z.string().min(8, "Password minimum 8 characters"),
        nik: z.string().min(13, "Masukan NIK valid!"),
        number: z.string().min(12, "Masukan nomor yang valid!"),
      })
    )
    .output(z.object({ id: z.string(), name: z.string() }))
    .query(async ({ input }) => {
      const result = await registerOwner({
        ...input,
      }).catch(errorHandler);
      if (result instanceof Owner) return { id: result.id, name: result.name };
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: result });
    }),
  getOwner: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const owner = await findOneOwnerRecord(input.id).catch(errorHandler);
      return owner;
    }),
};

const errorHandler = (err: Error) => {
  if (err instanceof ForeignKeyConstraintError)
    throw new TRPCError({
      message: "Id user tidak terdaftar",
      code: "BAD_REQUEST",
      cause: err,
    });
  if (err instanceof UniqueConstraintError)
    throw new TRPCError({
      code: "BAD_REQUEST",
      cause: new SQLUniqueError("Duplicate Entries", {
        cause: { ...err.fields },
      }),
    });
};

export default ownerProcedures;
