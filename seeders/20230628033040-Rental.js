/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { faker } = require("@faker-js/faker");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");
const { QueryTypes } = require("sequelize");

// eslint-disable-next-line no-undef
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = new Sequelize("pskuiy_db_development", "nishly", "7882", {
      host: "localhost",
      dialect: "mariadb",
    });

    const results = await sequelize.query("SELECT id FROM `owners`", {
      type: QueryTypes.SELECT,
    });

    const createRandomOwner = async () => {
      return {
        id_owner: faker.helpers.arrayElement(results.map((data) => data.id)),
        rental_logo: faker.image.urlLoremFlickr({ category: "logo" }),
        rental_images: faker.image.urlLoremFlickr({ category: "console" }),
        address: faker.location.streetAddress({ useFullAddress: true }),
        description: faker.commerce.productDescription(),
        total_rating: faker.number.int({ min: 1, max: 5 }),
        total_transaction: faker.number.int(),
        name: faker.commerce.productName(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    };

    const fakeData = faker.helpers.multiple(createRandomOwner, {
      count: 100,
    });

    const fakes = await Promise.all(fakeData);
    return queryInterface.bulkInsert("rentals", fakes);
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
