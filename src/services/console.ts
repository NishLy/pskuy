import {
  CONSOLE_DATA,
  CONSOLE_TYPE,
  MANUFACTUR,
  STORAGE_TYPE,
} from "@/interfaces/console";
import Console from "@/models/console";
import Rental from "@/models/rental";
import Room from "@/models/room";
import { Op } from "sequelize";

export type CONSOLE_QUERY = {
  type?: CONSOLE_TYPE;
  manufactur?: MANUFACTUR;
  type_storage?: STORAGE_TYPE;
};
export const showAllConsole = (input: CONSOLE_QUERY): Promise<Console[]> => {
  const query: CONSOLE_QUERY = {};
  if (input.manufactur) query.manufactur;
  if (input.type) query.type;
  if (input.type_storage) query.type_storage;
  return new Promise((resolve, reject) => {
    Console.findAll({ where: query })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const findAllConsoleRecordAssoc = (
  input: Partial<CONSOLE_DATA>
): Promise<Console[]> => {
  return new Promise((resolve, reject) => {
    if (input.name)
      Console.findAll({
        where: {
          ...input,
          name: {
            [Op.like]: input.name,
          },
        },
        include: [{ model: Room, include: [{ model: Rental }] }],
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    else
      Console.findAll({
        where: {
          ...input,
        },
        include: [{ model: Room, include: [{ model: Rental }] }],
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
  });
};
