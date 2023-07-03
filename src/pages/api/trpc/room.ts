/* eslint no-console: "error" */
import { SQLUniqueError } from "@/error/uniqueError";
import Console from "@/models/console";
import Rental from "@/models/rental";
import Room from "@/models/room";
import View from "@/models/view";
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
      const result = await findAllRoom(input, {
        includes: [{ model: Console }],
      }).catch(errorHandler);

      return { rooms: result };
    }),

  findAllRoomAssoc: publicProcedure
    .input(
      z.object({
        parameters: z.object({
          id: z.optional(z.number()),
          id_rental: z.optional(z.number()),
          console_name: z.optional(z.string()),
          active: z.optional(z.boolean()),
        }),
        offset: z.optional(z.number()),
      })
    )
    .query(async ({ input }) => {
      const result = await findAllRoomWithRental(
        input.parameters,
        input.offset
      ).catch(errorHandler);
      return { rooms: result.rows, count: result.count };
    }),

  findOneRoom: publicProcedure
    .input(
      z.object({
        id: z.optional(z.number()),
        id_user: z.optional(z.string()),
        id_rental: z.optional(z.number()),
        type: z.optional(z.union([z.literal("user"), z.literal("owner")])),
      })
    )
    .query(async ({ input }) => {
      const query = { id: input.id, id_rental: input.id_rental };
      if (!input.id_rental) delete query.id_rental;
      const result = await findOneRoom(query, {
        includes: [{ model: Console }, { model: Rental }],
      }).catch(errorHandler);

      if ((input.id_user, input.type === "user"))
        View.findOrCreate({
          where: { id_room: input.id, id_user: input.id_user },
          defaults: {
            id_room: input.id,
            id_user: input.id_user,
          },
        })
          .then((res) => {
            if (!res[1]) return;
            Room.findOne({ where: { id: input.id } })
              .then((room) => {
                if (room)
                  room
                    .set("times_viewed", room.times_viewed + 1)
                    .save()
                    .catch(errorHandler);
              })
              .catch(errorHandler);
          })

          .catch(errorHandler);

      return { room: result };
    }),

  showRoomAssociated: protectedProcedure
    .input(
      z.object({
        parameters: z.object({ id_rental: z.number(), id_owner: z.string() }),
        offset: z.optional(z.number()),
      })
    )
    .query(async ({ input }) => {
      const rooms = await showAssociatedRoomRecord(
        input.parameters,
        input.offset
      ).catch(errorHandler);
      return { rooms };
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
        room_images: z.optional(z.string()),
        price_per_hour: z.number(),
        information: z.string(),
      })
    )
    .query(async ({ input }) => {
      const room = await editRoomRecord(input).catch(errorHandler);
      if (room[0] === 0)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error Fail Update",
        });
      return { id: input.id };
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
  editRoomPublicStatus: protectedProcedure
    .input(z.object({ id_room: z.number(), active: z.boolean() }))
    .query(async ({ input }) => {
      const result = await Room.update(
        { active: input.active },
        { where: { id: input.id_room } }
      ).catch(errorHandler);
      return { result };
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
