import { SQLUniqueError } from "@/error/uniqueError";
import { protectedProcedure } from "@/server/trpc";
import { findAllOfferRecords } from "@/services/offer";
import { TRPCError } from "@trpc/server";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import { z } from "zod";

const offerProcedures = {
  showAllOffers: protectedProcedure.query(async () => {
    const offers = await findAllOfferRecords({}).catch(errorHandler);
    return { offers };
  }),
};

export default offerProcedures;

const errorHandler = (err: Error) => {
  console.log(err, "err dsadsadsafsafsafsafasfor");
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
