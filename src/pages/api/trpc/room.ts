import { SQLUniqueError } from "@/error/uniqueError";
import Room from "@/models/room";
import { protectedProcedure, publicProcedure } from "@/server/trpc";
import {
  createRoomRecord,
  deleteRoomRecord,
  editRoomRecord,
  showAssociatedRoomRecord,
  findOneRoom,
  findAllRoom,
  findAllRoomWithRental,
} from "@/services/room";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import z from "zod";

const roomProcedures = {
  showAllRoom: publicProcedure
    .input(
      z.object({
        id: z.optional(z.number()),
        id_rental: z.optional(z.number()),
        id_console: z.optional(z.string()),
        include_console: z.optional(z.boolean()),
        include_rental: z.optional(z.boolean()),
      })
    )
    .query(async ({ input }) => {
      const result = await findAllRoom(input, input.include_console).catch(
        errorHandler
      );

      console.log(result);
      return { rooms: result };
    }),

  findAllRoomAssoc: publicProcedure
    .input(
      z.object({
        id: z.optional(z.number()),
        console_name: z.optional(z.string()),
      })
    )
    .query(async ({ input }) => {
      const result = await findAllRoomWithRental(input).catch(errorHandler);
      return { rooms: result };
    }),

  findOneRoom: publicProcedure
    .input(
      z.object({
        id: z.optional(z.number()),
        id_rental: z.optional(z.number()),
      })
    )
    .query(async ({ input }) => {
      const result = await findOneRoom(input).catch(errorHandler);
      if (typeof result === "function") return { room: null };
      return { room: result };
    }),
  showRoomAssociated: protectedProcedure
    .input(z.object({ id_rental: z.number(), id_owner: z.string() }))
    .query(async ({ input }) => {
      console.log(input);
      const result = await showAssociatedRoomRecord({
        id: input.id_rental,
        id_owner: input.id_owner,
      }).catch(errorHandler);
      if (!result) return { Rooms: [] };
      return { Rooms: result.Rooms };
    }),
  createRoom: protectedProcedure
    .input(
      z.object({
        id_rental: z.number(),
        id_console: z.string(),
        id_joystick_first_person: z.string().nullable(),
        id_joystick_second_person: z.string().nullable(),
        console_production_year: z.number(),
        status: z.union([
          z.literal("unuseable"),
          z.literal("useable"),
          z.literal("good"),
        ]),
        information: z.string(),
        price_per_hour: z.number(),
      })
    )
    .query(async ({ input }) => {
      const room = await createRoomRecord(input).catch(errorHandler);
      if (room instanceof Room) return { room };
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: room });
    }),
  editRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        id_rental: z.number(),
        id_console: z.string(),
        id_joystick_first_person: z.string().nullable(),
        id_joystick_second_person: z.string().nullable(),
        console_production_year: z.number(),
        status: z.union([
          z.literal("unuseable"),
          z.literal("useable"),
          z.literal("good"),
        ]),
        price_per_hour: z.number(),
        information: z.string(),
      })
    )
    .query(async ({ input }) => {
      const room = await editRoomRecord(input).catch(errorHandler);
      console.log(room);
      return { room };
    }),
  deleteRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const room = await deleteRoomRecord({ id: input.id }).catch(errorHandler);
      if (typeof room === "number") return { affected: [room] };
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: room });
    }),
};

const errorHandler = (err: Error) => {
  if (err instanceof ForeignKeyConstraintError)
    throw new TRPCError({
      message: "Id rental tidak ditemukan",
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
  throw new TRPCError({
    message: "Internal Error",
    code: "BAD_REQUEST",
    cause: err,
  });
};

export default roomProcedures;
