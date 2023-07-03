import Rental from "@/models/rental";
import Room from "@/models/room";
import { Console, Transaction } from "@/models/associations";
import optsQuery from "@/interfaces/query";
import User from "@/models/user";

export const createTransactionRecord = (
  input: Partial<Transaction>
): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    Transaction.create(input)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const findOneTranscationRecord = (
  input: Partial<Transaction>
): Promise<Transaction | null> => {
  return new Promise((resolve, reject) => {
    Transaction.findOne({
      where: input,
      include: [{ model: Rental, attributes: ["name"] }],
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const findAllTransactionRecordAssoc = (
  input: Partial<Transaction>,
  offset = 0
): Promise<{
  rows: Transaction[];
  count: number;
}> => {
  return new Promise((resolve, reject) => {
    Transaction.findAndCountAll({
      where: input,
      include: [
        { model: Rental, attributes: ["name"] },
        {
          model: Room,
          attributes: ["room_images", "id"],
          include: [{ model: Console, attributes: ["name"] }],
        },
      ],
      offset,
      limit: 10,
      order: [["updatedAt", "DESC"]],
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const findAllOwnerTransactionRecord = (
  input: {
    id_owner: string;
  },
  offset = 0
): Promise<{
  rows: Transaction[];
  count: number;
}> => {
  return new Promise((resolve, reject) => {
    Transaction.findAndCountAll({
      limit: 20,
      offset,
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Rental,
          where: { id_owner: input.id_owner },
          attributes: ["name"],
        },
        {
          model: Room,
          attributes: ["room_images", "id"],
          include: [{ model: Console, attributes: ["name"] }],
        },
      ],
      order: [["updatedAt", "DESC"]],
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const editStatusTransactionRecord = (input: {
  id: number;
  status: "finished" | "proccess" | "ongoing" | "completed" | "cancel";
}): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    Transaction.update({ status: input.status }, { where: { id: input.id } })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const editFeedbackTransactionRecord = (
  input: Partial<{
    id: number;
    id_user: string;
    id_rental: number;
    id_room: number;
    comment: string;
    rating: number;
  }>
): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const feedBack = { comment: input.comment, rating: input.rating };

    delete input.comment;
    delete input.rating;

    Transaction.update(
      { comment: feedBack.comment, rating: feedBack.rating },
      { where: input }
    )
      .catch((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
