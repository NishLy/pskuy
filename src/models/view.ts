"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";

import User from "./user";
import Room from "./room";
export default class View extends Model {
  declare id_user: string;
  declare id_room: number;
}
View.init(
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
  },
  {
    sequelize: sequelizeConnection,
    modelName: "View",
    tableName: "Views",
  }
);
