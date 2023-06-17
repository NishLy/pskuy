import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "./connection";

export default class Offer extends Model {
  declare id: number;
  declare caption: string;
  declare thumbnail_image: string;
  declare link_to_page: string;
  declare expires_date: string;
  static associate() {
    // define association here
  }
}
Offer.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    caption: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    thumbnail_image: {
      type: DataTypes.STRING,
    },
    link_to_page: {
      type: DataTypes.STRING,
    },
    expires_date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Offer",
    tableName: "Offers",
  }
);
