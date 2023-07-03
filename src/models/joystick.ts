"use strict";
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "./connection";
import { MANUFACTUR } from "@/interfaces/console";
export default class Joystick extends Model {
  declare id: string;
  declare name: string;
  declare manufactur: MANUFACTUR;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    // define association here
  }
}
Joystick.init(
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
    manufactur: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ["sony", "microsoft", "nitendo"],
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Joystick",
    tableName: "Joysticks",
  }
);
