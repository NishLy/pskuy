import Rental from "./rental";
import Room from "./room";
import Console from "./console";
import Transaction from "./transaction";
import Owner from "./owner";
import User from "./user";

Rental.hasMany(Room, {
  foreignKey: "id_rental",
});
Room.hasOne(Rental, {
  foreignKey: "id",
  sourceKey: "id_rental",
});
Console.hasMany(Room, { foreignKey: "id_console" });
Room.hasOne(Console, { foreignKey: "id", sourceKey: "id_console" });

/* These lines of code are defining the associations between the `Rental`, `Room`, and `Transaction`
models. */
Rental.hasMany(Transaction, { foreignKey: "id_rental" });
Room.hasMany(Transaction, { foreignKey: "id_room" });

User.hasMany(Transaction, { foreignKey: "id_user" });

Transaction.hasOne(Room, { foreignKey: "id", sourceKey: "id_room" });
Transaction.hasOne(Rental, { foreignKey: "id", sourceKey: "id_rental" });
Transaction.hasOne(User, { foreignKey: "id", sourceKey: "id_user" });

Owner.hasMany(Rental, { foreignKey: "id_owner" });
Rental.hasOne(Owner, { foreignKey: "id", sourceKey: "id_owner" });

export { Rental, Room, Console, Transaction, Owner };
