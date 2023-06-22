"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";
import Owner from "./owner";
export default class Rental extends Model {
  declare id: number;
  declare name: string;
  declare rental_logo?: string;
  declare rental_images?: string;
  declare description: string;
  declare address: string;
  declare id_owner: string;
  declare latitude: number;
  declare longitude: number;
  declare total_rating: number;
  declare total_transaction: number;
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static associate() {}
}
Rental.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    rental_logo: {
      unique: true,
      type: DataTypes.STRING,
    },
    rental_images: {
      type: DataTypes.TEXT,
    },
    address: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    id_owner: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: Owner, // 'Actors' would also work
        key: "id",
      },
    },
    total_rating: {
      defaultValue: 0,
      type: DataTypes.FLOAT(2),
    },
    total_transaction: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Rental",
    tableName: "Rentals",
  }
);
