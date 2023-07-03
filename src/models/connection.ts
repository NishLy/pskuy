"use strict";

import { Sequelize } from "sequelize";
import process from "process";
import config from "../../config/config.json";
import dotenv from "dotenv";

dotenv.config();
const env = process.env.NODE_ENV || "development";

const sequelizeConnection = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  {
    ...config[env],
    dialect: "mariadb",
    // logging: false,
  }
);

export default sequelizeConnection;
