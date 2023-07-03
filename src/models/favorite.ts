"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";

import User from "./user";
import Room from "./room";
export default class Favorite extends Model {
  declare id_user: string;
  declare id_room: number;
  declare favorite: boolean;
}
Favorite.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_user: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      references: {
        model: User,
        key: "id",
      },
    },
    id_room: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Room,
        key: "id",
      },
    },
    favorite: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Favorite",
    tableName: "Favorites",
  }
);
