import optsQuery from "@/interfaces/query";
import { ROOM_DATA } from "@/interfaces/room";
import { Console, Rental, Room as RoomAssoc } from "@/models/associations";
import sequelizeConnection from "@/models/connection";
// import Rental from "@/models/rental";
import Room from "@/models/room";
import { Op } from "sequelize";

export const createRoomRecord = (input: ROOM_DATA): Promise<Room> => {
  return new Promise((resolve, reject) => {
    Room.create({ ...input })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const editRoomRecord = (input: ROOM_DATA): Promise<[number]> => {
  return new Promise((resolve, reject) => {
    Room.update({ ...input }, { where: { id: input.id } })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

type associatedType = { id_rental: number; id_owner: string };
export const showAssociatedRoomRecord = (
  input: associatedType,
  offset = 0
): Promise<{
  rows: RoomAssoc[];
  count: number;
}> => {
  return new Promise((resolve, reject) => {
    Room.findAndCountAll({
      include: [
        {
          model: Rental,
          attributes: [],
          where: { id: input.id_rental, id_owner: input.id_owner },
        },
        {
          model: Console,
        },
      ],
      limit: 10,
      offset,
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const findAllRoomWithRental = (
  input: Partial<ROOM_DATA> & { console_name?: string; offset?: number },
  offset = 0
): Promise<{ rows: Room[]; count: number }> => {
  console.log(input);
  if (!input.id_rental) delete input.id_rental;
  return new Promise((resolve, reject) => {
    delete input.offset;
    if (input.console_name) {
      const console_name = input.console_name;
      delete input.console_name;
      Room.findAndCountAll({
        order: [sequelizeConnection.random()],
        where: input,
        include: [
          {
            model: Rental,
          },
          {
            model: Console,
            where: {
              name: {
                [Op.like]: console_name + "%",
              },
            },
          },
        ],
        limit: 10,
        offset,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    } else
      Room.findAndCountAll({
        where: input,
        order: sequelizeConnection.random(),
        include: [
          {
            model: Rental,
          },
          {
            model: Console,
          },
        ],
        limit: 10,
        offset: offset,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
  });
};

export const findAllRoom = (
  input: Partial<ROOM_DATA>,
  opts?: optsQuery
): Promise<Room[]> => {
  return new Promise((resolve, reject) => {
    Room.findAll({
      where: { ...input },
      include: opts?.includes,
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const findOneRoom = (
  input: Partial<ROOM_DATA>,
  opts?: optsQuery
): Promise<Room | null> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new Promise((resolve, reject) => {
    Room.findOne({
      where: input,
      include: opts?.includes,
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const deleteRoomOneRecord = (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    Room.destroy({ where: { id } })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const deleteRoomRecord = (
  input: Partial<ROOM_DATA>
): Promise<number> => {
  return new Promise((resolve, reject) => {
    Room.destroy({ where: input })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
