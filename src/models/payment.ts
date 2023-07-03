"use strict";
import { Model, DataTypes, DateDataType } from "sequelize";
import sequelizeConnection from "./connection";
import { TypePayment } from "../interfaces/payment";
export default class Payment extends Model {
  declare id: string;
  declare nominal: number;
  declare method: TypePayment;
  declare date: DateDataType;
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    // define association here
  }
}
Payment.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nominal: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    method: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["cash", "cashless"],
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Payment",
    tableName: "Payments",
  }
);
