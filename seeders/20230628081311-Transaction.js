/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { faker } = require("@faker-js/faker");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { QueryTypes } = require("sequelize");

// eslint-disable-next-line no-undef
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = new Sequelize("pskuiy_db_development", "nishly", "7882", {
      host: "localhost",
      dialect: "mariadb",
    });
    const rooms = await sequelize.query(
      "SELECT id, price_per_hour FROM `rooms`",
      {
        type: QueryTypes.SELECT,
      }
    );

    const users = await sequelize.query("SELECT id FROM `users`", {
      type: QueryTypes.SELECT,
    });

    const rentals = await sequelize.query("SELECT id FROM `rentals`", {
      type: QueryTypes.SELECT,
    });

    const createRandomOwner = async () => {
      const time_checkIn = faker.date.anytime();
      const rent_time = faker.number.int({ min: 1, max: 24 });
      const time_checkOut = new Date(
        time_checkIn.getTime() + rent_time * 60 * 100
      );
      const room = faker.helpers.arrayElement(rooms);
      const total_prices = room.price_per_hour * rent_time;
      return {
        id_room: room.id,
        id_user: faker.helpers.arrayElement(users.map((data) => data.id)),
        id_rental: faker.helpers.arrayElement(rentals.map((data) => data.id)),
        id_payment: null,
        time_checkIn,
        time_checkOut,
        rent_time,
        total_prices,
        rating: faker.number.float({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement([
          "proccess",
          "finished",
          "ongoing",
          "completed",
          "cancel",
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    };

    const fakeData = faker.helpers.multiple(createRandomOwner, {
      count: 5000,
    });

    const fakes = await Promise.all(fakeData);
    return queryInterface.bulkInsert("transactions", fakes);
  },

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
