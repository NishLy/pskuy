import RENTAL_DATA from "@/interfaces/rental";
import Rental from "@/models/rental";

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

export const showAllRental = (uuid?: string): Promise<Rental[]> => {
  return new Promise((resolve, reject) => {
    const where = uuid ? { id_owner: uuid } : undefined;
    Rental.findAll({ where })
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

export const editRental = (input: RENTAL_DATA): Promise<number | undefined> => {
  return new Promise((resolve, reject) => {
    Rental.update(input, { where: { id: input.id, id_owner: input.id_owner } })
      .then((result) => resolve(result[0]))
      .catch((err) => reject(err));
  });
};

export const deleteRental = (id: string): Promise<number | undefined> => {
  return new Promise((resolve, reject) => {
    Rental.destroy({ where: { id } })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
