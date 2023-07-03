import Owner from "@/models/owner";
import User from "@/models/user";
import { protectedProcedure } from "@/server/trpc";
import { z } from "zod";

const userProcedures = {
  validateUserTypeById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.union([z.literal("user"), z.literal("owner")]),
      })
    )
    .query(async ({ input }) => {
      let result;
      if (input.type === "owner") {
        result = await Owner.findOne({ where: { id: input.id } });
      } else result = await User.findOne({ where: { id: input.id } });
      return result ? true : false;
    }),
};

export default userProcedures;
