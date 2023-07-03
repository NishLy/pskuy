"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";
import { TypeFacility } from "../interfaces/facility";
import Rental from "./rental";

export default class Facility extends Model {
  declare id: number;
  declare id_rental: number;
  declare type: TypeFacility;
  declare quantity: number;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    // define association here
  }
}
Facility.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_rental: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Rental,
        key: "id",
      },
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["kantin", "toilet", "wifi"],
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Facility",
    tableName: "Facilities",
  }
);
