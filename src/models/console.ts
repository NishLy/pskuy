"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";
import { MANUFACTUR, CONSOLE_TYPE, STORAGE_TYPE } from "../interfaces/console";

export default class Console extends Model {
  declare id: string;
  declare name: string;
  declare type: CONSOLE_TYPE;
  declare type_storage: STORAGE_TYPE;
  declare manufactur: MANUFACTUR;
  declare manufactur_logo: string;
  declare console_image: string;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    // define association here
  }
}
Console.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(8),
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    manufactur_logo: {
      type: DataTypes.STRING,
    },
    console_image: {
      type: DataTypes.STRING,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["playstation", "xbox", "nitendo"],
    },
    type_storage: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["ssd", "hdd", "dvd"],
    },
    manufactur: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["sony", "microsoft", "nitendo"],
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Console",
    tableName: "Consoles",
  }
);
