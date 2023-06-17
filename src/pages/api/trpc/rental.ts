import { SQLUniqueError } from "@/error/uniqueError";
import Rental from "@/models/rental";
import { protectedProcedure } from "@/server/trpc";
import {
  createRental,
  editRental,
  findOneRentalRecord,
  showAllRental,
} from "@/services/rental";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import z from "zod";

const rentalProcedures = {
  showAllRental: protectedProcedure
    .input(
      z.object({
        uuid: z.string().min(36, "ID tidak valid!"),
      })
    )
    .query(async ({ input }) => {
      const rentals = await showAllRental(input.uuid).catch(errorHandler);
      if (!(rentals instanceof Array)) return { rentals: [] };
      return { rentals };
    }),
  registeRental: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        longitude: z.number(),
        latitude: z.number(),
        id_owner: z.string(),
        description: z.string(),
      })
    )
    .output(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rental = await createRental(input).catch(errorHandler);
      if (rental instanceof Rental) return { id: rental.id };
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: rental });
    }),

  findOneRental: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        id_owner: z.string(),
      })
    )
    .query(async ({ input }) => {
      const rental = await findOneRentalRecord(input).catch(errorHandler);
      return { rental };
    }),

  editRental: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        address: z.string(),
        longitude: z.number(),
        latitude: z.number(),
        id_owner: z.string(),
        description: z.string(),
        rental_logo: z.optional(z.string()),
        rental_images: z.optional(z.string()),
      })
    )
    .output(z.object({ affected: z.number() }))
    .query(async ({ input }) => {
      const rental = await editRental(input).catch(errorHandler);
      if (typeof rental === "number") return { affected: rental };
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: rental });
    }),
};

export default rentalProcedures;

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
