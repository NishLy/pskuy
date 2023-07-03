"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";

export default class User extends Model {
  declare id: string;
  declare username: string;
  declare number: string;
  declare email: string;
  declare profile_image?: string;
  declare password: string;
  static associate() {
    // define association here
  }
}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING(13),
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    profile_image: {
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },

  {
    sequelize: sequelizeConnection,
    modelName: "User",
    tableName: "Users",
  }
);
