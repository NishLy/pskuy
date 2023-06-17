"use strict";
import { Model, DataTypes, ModelStatic } from "sequelize";
import sequelizeConnection from "./connection";
import { TypeFunctionalityStatus } from "../interfaces/status";
import Rental from "./rental";
import Console from "./console";
import Joystick from "./joystick";
export default class Room extends Model {
  declare id: number;
  declare id_rental: number;
  declare id_console: string;
  declare id_joystick_first_person: string;
  declare id_joystick_second_person: string;
  declare console_production_year: number;
  declare status: TypeFunctionalityStatus;
  declare information: string;
  declare price_per_hour: number;
  declare rating: number;
  declare active: boolean;
  declare is_rented: boolean;
  declare time_end_current_rent: string | null;
  declare times_viewed: number;
  declare times_booked: number;
  declare images_directory?: string;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  // static associate(models: { Rental: ModelStatic<Model<any, any>> }) {
  //   // define association here
  //   this.belongsTo(models.Rental, { as: "Rental" });
  // }
}
Room.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    id_rental: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Rental,
        key: "id",
      },
    },
    id_console: {
      type: DataTypes.STRING(8),
      allowNull: false,
      references: {
        model: Console,
        key: "id",
      },
    },
    id_joystick_first_person: {
      type: DataTypes.STRING(8),
      references: {
        model: Joystick,
        key: "id",
      },
    },
    id_joystick_second_person: {
      type: DataTypes.STRING(8),
      references: {
        model: Joystick,
        key: "id",
      },
    },
    console_production_year: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    images_directory: {
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["unuseable", "useable", "good"],
    },
    price_per_hour: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    rating: {
      defaultValue: 0.0,
      type: DataTypes.FLOAT(2),
    },
    active: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
    is_rented: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    time_end_current_rent: {
      type: DataTypes.DATE,
    },
    times_viewed: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    times_booked: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    information: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Room",
    tableName: "Rooms",
  }
);
