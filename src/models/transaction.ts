"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";
import { TypeTransactionsStatus } from "../interfaces/status";
import Room from "./room";
import Rental from "./rental";
import User from "./user";
import Payment from "./payment";
export default class Transaction extends Model {
  declare id: number;
  declare id_user: string;
  declare id_rental: number;
  declare id_payment: string | null;
  declare id_room: number;
  declare time_checkIn: Date;
  declare time_checkOut: Date;
  declare rent_time: number;
  declare status: TypeTransactionsStatus;
  declare total_prices: number;
  declare comment: string;
  declare rating: number;
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    // define association here
  }
}

Transaction.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_user: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    id_rental: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Rental,
        key: "id",
      },
    },
    id_payment: {
      type: DataTypes.UUID,
      references: {
        model: Payment,
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
    time_checkIn: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    time_checkOut: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    rent_time: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    total_prices: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    rating: {
      type: DataTypes.FLOAT(2),
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["finished", "ongoing", "complaint", "cancel"],
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Transaction",
    tableName: "Transactions",
  }
);

Transaction.create({});
