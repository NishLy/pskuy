/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { faker } = require("@faker-js/faker");
const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = new Sequelize("pskuiy_db_development", "nishly", "7882", {
      host: "localhost",
      dialect: "mariadb",
    });

    const results = await sequelize.query("SELECT id FROM `rentals`", {
      type: QueryTypes.SELECT,
    });

    const consoles = await sequelize.query("SELECT id FROM `consoles`", {
      type: QueryTypes.SELECT,
    });

    const joysticks = await sequelize.query("SELECT id FROM `joysticks`", {
      type: QueryTypes.SELECT,
    });

    let index = 0;
    function createRandomRoom() {
      index + 1;
      return {
        id: index,
        id_rental: faker.helpers.arrayElement(results.map((data) => data.id)),
        id_console: faker.helpers.arrayElement(consoles.map((data) => data.id)),
        id_joystick_first_person: faker.helpers.arrayElement(
          joysticks.map((data) => data.id)
        ),
        id_joystick_second_person: faker.helpers.arrayElement(
          joysticks.map((data) => data.id)
        ),
        console_production_year: faker.number.int({ min: 2006, max: 2023 }),
        status: faker.helpers.arrayElement(["good", "useable", "unuseable"]),
        information: faker.commerce.productDescription(),
        price_per_hour: faker.commerce.price({ min: 2000, max: 20000 }),
        rating: faker.number.float({ min: 1, max: 5 }),
        active: faker.helpers.arrayElement(["active", "inactive"]),
        is_rented: faker.datatype.boolean(),
        time_end_current_rent: faker.date.soon({ days: 1 }),
        times_viewed: faker.number.int({ min: 0, max: 20000 }),
        times_booked: faker.number.int({ min: 0, max: 20000 }),
        room_images: faker.image.urlLoremFlickr({ category: "console" }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const fakeData = faker.helpers.multiple(createRandomRoom, {
      count: 2000,
    });
    const fakes = await Promise.all(fakeData);
    return queryInterface.bulkInsert("rooms", fakes);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
