import { Sequelize } from "sequelize";
import Rental from "./rental";
import Room from "./room";
import sequelizeConnection from "./connection";
import Console from "./console";

Rental.hasMany(Room, {
  foreignKey: "id_rental",
});
Room.hasOne(Rental, {
  foreignKey: "id",
  sourceKey: "id_rental",
});
Console.hasMany(Room, { foreignKey: "id_console" });
Room.hasOne(Console, { foreignKey: "id", sourceKey: "id_console" });

export { Rental, Room, Console };
