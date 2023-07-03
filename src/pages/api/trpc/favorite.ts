import { SQLUniqueError } from "@/error/uniqueError";
import Favorite from "@/models/favorite";
import { protectedProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import z from "zod";

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

const favoriteRouter = router({
  toogle: protectedProcedure
    .input(
      z.object({
        id: z.optional(z.number()),
        fav: z.optional(z.boolean()),
        id_room: z.number(),
        id_user: z.string(),
      })
    )
    .query(async ({ input }) => {
      const query = {
        id_room: input.id_room,
        id_user: input.id_user,
        id: input.id,
      };
      if (!input.id) delete query.id;
      const [favorite] = await Favorite.findOrCreate({
        where: query,
        defaults: {
          id_room: input.id_room,
          id_user: input.id_user,
          favorite: true,
        },
      });
      if (!favorite) return { favorite };
      if (typeof input.fav !== "undefined")
        await favorite.set({ favorite: input.fav }).save().catch(errorHandler);
      return favorite;
    }),
});
export default favoriteRouter;
