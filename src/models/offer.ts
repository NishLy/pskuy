import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "./connection";

export default class Offer extends Model {
  declare id: number;
  declare caption: string;
  declare redirect_url: string;
  declare offer_image: string;
  declare expires_date: Date;
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
    offer_image: {
      type: DataTypes.STRING,
    },
    redirect_url: {
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
