/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { faker } = require("@faker-js/faker");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { QueryTypes } = require("sequelize");

function hashString(str) {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(str, 10)
      .then((hashed) => resolve(hashed))
      .catch((err) => reject(err));
  });
}

// eslint-disable-next-line no-undef
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = new Sequelize("pskuiy_db_development", "nishly", "7882", {
      host: "localhost",
      dialect: "mariadb",
    });

    const results = await sequelize.query("SELECT id FROM `users`", {
      type: QueryTypes.SELECT,
    });

    const createRandomOwner = async () => {
      return {
        id: uuid.v4(),
        id_user: faker.helpers.arrayElement(results.map((data) => data.id)),
        username: faker.internet.userName(),
        nik: faker.string.numeric({ length: 16 }),
        number: faker.phone.number(),
        email: faker.internet.email(),
        birth_date: faker.date.birthdate(),
        password: await hashString("12345678"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    };

    const fakeData = faker.helpers.multiple(createRandomOwner, {
      count: 10,
    });

    const fakes = await Promise.all(fakeData);
    console.log(fakes, "user");
    return queryInterface.bulkInsert("owners", fakes);
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
