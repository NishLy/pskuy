import RENTAL_DATA from "@/interfaces/rental";
import Rental from "@/models/rental";
import { Op, WhereOptions } from "sequelize";

export const findOneRentalRecord = (
  input: Partial<RENTAL_DATA>
): Promise<Rental | null> => {
  return new Promise((resolve, reject) => {
    console.log(input, "sadadasda");
    Rental.findOne({ where: input })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

type RENTAL_OPTS = {
  offset: number;
};

export const findAllRentalRecord = (
  input: Partial<Rental>,
  offset = 0,
  limit = true
): Promise<{ rows: Rental[]; count: number }> => {
  let inputName: WhereOptions<RENTAL_DATA> | undefined;
  if (input.name)
    inputName = { ...input, name: { [Op.like]: "%" + input.name + "%" } };
  return new Promise((resolve, reject) => {
    Rental.findAndCountAll({
      where: inputName ? inputName : input,
      offset,
      limit: limit ? 20 : undefined,
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const createRental = (input: RENTAL_DATA): Promise<Rental> => {
  return new Promise((resolve, reject) => {
    Rental.create({ ...input })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const updateRentalRecord = (
  input: RENTAL_DATA
): Promise<number | undefined> => {
  return new Promise((resolve, reject) => {
    Rental.update(input, { where: { id: input.id, id_owner: input.id_owner } })
      .then((result) => resolve(result[0]))
      .catch((err) => reject(err));
  });
};

export const deleteOneRentalRecord = (input: {
  id: number;
  id_owner: string;
}): Promise<number | undefined> => {
  return new Promise((resolve, reject) => {
    Rental.destroy({ where: { id: input.id, id_owner: input.id_owner } })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
