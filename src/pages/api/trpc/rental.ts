import { SQLUniqueError } from "@/error/uniqueError";
import Rental from "@/models/rental";
import { protectedProcedure, publicProcedure } from "@/server/trpc";
import { findOneOwnerRecord } from "@/services/owner";
import {
  createRental,
  updateRentalRecord,
  findOneRentalRecord,
  findAllRentalRecord,
  deleteOneRentalRecord,
} from "@/services/rental";
import { deleteRoomRecord } from "@/services/room";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import z from "zod";

const rentalProcedures = {
  /* Defining a TRPC procedure called `showAllRental` that is publicly accessible. It takes an optional
input parameter `name` which is a string. It then calls the `findAllRentalRecord` function with the
input parameter and catches any errors with the `errorHandler` function. Finally, it returns an
object with a `rentals` property containing the result of the `findAllRentalRecord` function. */
  showAllRental: protectedProcedure
    .input(
      z.object({
        parameters: z.object({ name: z.optional(z.string()) }),
        offset: z.optional(z.number()),
        limit: z.optional(z.boolean()),
      })
    )
    .query(async ({ input }) => {
      const rentals = await findAllRentalRecord(
        input.parameters,
        input.offset,
        input.limit
      ).catch(errorHandler);
      return { rentals };
    }),

  /* This code defines a TRPC procedure called `showAllRentalProtected` that is protected and requires
authentication to access. It takes an input parameter `uuid` which is a string representing the ID
of the owner. It then calls the `findAllRentalRecord` function with the input parameter and catches
any errors with the `errorHandler` function. Finally, it returns an object with a `rentals` property
containing the result of the `findAllRentalRecord` function. This procedure is used to retrieve all
rental records associated with a specific owner. */
  findAllOwnerRental: protectedProcedure
    .input(
      z.object({
        uuid: z.string().min(36, "ID tidak valid!"),
      })
    )
    .query(async ({ input }) => {
      const rentals = await findAllRentalRecord({ id_owner: input.uuid }).catch(
        errorHandler
      );

      return { rentals };
    }),
  /* This code defines a TRPC procedure called `registerRental` that is protected and requires
authentication to access. It takes an input parameter object with properties `name`, `address`,
`longitude`, `latitude`, `id_owner`, and `description`, all of which have specific data types
defined using the `zod` library. It also defines an output object with a single property `id` of
type `number`. */
  registerRental: protectedProcedure
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

  /* This code defines a TRPC procedure called `findOneRental` that is publicly accessible. It takes an
 input parameter object with a single property `id` of type `number`, defined using the `zod`
 library. It then calls the `findOneRentalRecord` function with the input parameter and catches any
 errors with the `errorHandler` function. Finally, it returns an object with a `rental` property
 containing the result of the `findOneRentalRecord` function. This procedure is used to retrieve a
 single rental record by its ID. */
  findOneRental: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const rental = await findOneRentalRecord(input).catch(errorHandler);
      return { rental };
    }),

  /* This code defines a TRPC procedure called `findOneRentalProtected` that is protected and requires
authentication to access. It takes an input parameter object with properties `id` and `id_owner`,
both of which have specific data types defined using the `zod` library. It then calls the
`findOneRentalRecord` function with the input parameter and catches any errors with the
`errorHandler` function. Finally, it returns an object with a `rental` property containing the
result of the `findOneRentalRecord` function. This procedure is used to retrieve a single rental
record associated with a specific owner. */

  findOneRentalProtected: protectedProcedure
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

  /* This code defines a TRPC procedure called `deleteOneRental` that is protected and requires
authentication to access. It takes an input parameter object with properties `id` and `id_owner`,
both of which have specific data types defined using the `zod` library. */
  deleteOneRental: protectedProcedure
    .input(z.object({ id: z.number(), id_owner: z.string() }))
    .query(async ({ input }) => {
      const findOwner = await findOneOwnerRecord(input.id_owner).catch(
        errorHandler
      );

      if (!findOwner)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "ID OWNER TIDAK TERDAFTAR",
        });

      await deleteRoomRecord({ id_rental: input.id }).catch(errorHandler);

      const result = await deleteOneRentalRecord(input).catch(errorHandler);
      return { result };
    }),

  /* This code defines a TRPC procedure called `editRental` that is protected and requires
 authentication to access. It takes an input parameter object with properties `id`, `name`,
 `address`, `longitude`, `latitude`, `id_owner`, `description`, `rental_logo`, and `rental_images`,
 all of which have specific data types defined using the `zod` library. It also defines an output
 object with a single property `affected` of type `number`. */
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
        rental_logo: z.string().nullish(),
        rental_images: z.optional(z.string()),
      })
    )
    .output(z.object({ affected: z.number() }))
    .query(async ({ input }) => {
      const rental = await updateRentalRecord(input).catch(errorHandler);
      if (typeof rental === "number") return { affected: rental };
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: rental });
    }),
};

export default rentalProcedures;
/**
 * The function handles errors related to foreign key and unique constraints in TypeScript and throws
 * custom TRPC errors with SQLUniqueError causes.
 * @param {Error} err - The parameter `err` is of type `Error`, which is the standard JavaScript error
 * object. It represents an error that occurred during the execution of the code.
 */

const errorHandler = (err: Error) => {
  console.log(err);
  if (err instanceof ForeignKeyConstraintError)
    throw new TRPCError({
      message: "Rental Tidak Terdaftr",
      code: "BAD_REQUEST",
      cause: new SQLUniqueError(err.message, { cause: err.fields }),
    });
  if (err instanceof UniqueConstraintError)
    throw new TRPCError({
      code: "BAD_REQUEST",
      cause: new SQLUniqueError("Duplicate Entries", {
        cause: { ...err.fields },
      }),
    });
};
