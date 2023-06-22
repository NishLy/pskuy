import { ROOM_DATA } from "@/interfaces/room";
import { Console, Rental } from "@/models/associations";
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

type associatedType = { id: number; id_owner: string };
interface AssociatedRental extends Rental {
  Rooms: Room[];
}
export const showAssociatedRoomRecord = (
  input: associatedType
): Promise<AssociatedRental | null> => {
  return new Promise((resolve, reject) => {
    Rental.findOne({
      where: { id: input.id, id_owner: input.id_owner },
      include: [
        {
          model: Room,
          include: [{ model: Console }],
        },
      ],
    })
      .then((res) => {
        resolve(res as AssociatedRental);
      })
      .catch((err) => reject(err));
  });
};

export const findAllRoomWithRental = (
  input: Partial<ROOM_DATA> & { console_name?: string }
): Promise<Room[]> => {
  return new Promise((resolve, reject) => {
    if (input.console_name) {
      const console_name = input.console_name;
      delete input.console_name;
      Room.findAll({
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
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    } else
      Room.findAll({
        where: input,
        include: [
          {
            model: Rental,
          },
          {
            model: Console,
          },
        ],
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
  });
};

export const findAllRoom = (
  input: Partial<ROOM_DATA>,
  include_console = false
): Promise<Room[]> => {
  return new Promise((resolve, reject) => {
    if (include_console)
      Room.findAll({
        where: { ...input },
        include: Console,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    else
      Room.findAll({
        where: { ...input },
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
  });
};

export const findOneRoom = (
  input: Partial<ROOM_DATA>,
  include_console = false
): Promise<Room | null> => {
  return new Promise((resolve, reject) => {
    if (include_console)
      Room.findOne({
        where: input,
        include: Console,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    else
      Room.findOne({
        where: { ...input },
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
