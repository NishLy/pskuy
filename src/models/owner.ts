"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";
import User from "./user";

export default class Owner extends Model {
  declare id: string;
  declare id_user: string;
  declare name: string;
  declare username: string;
  declare password: string;
  declare nik: string;
  declare birth_date: string;
  declare number: string;
  declare email: string;
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  // static associate(models) {
  //   // define association here
  // }
}
Owner.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    id_user: {
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    username: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    nik: {
      unique: true,
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    birth_date: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING(13),
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Owner",
    tableName: "Owners",
  }
);
