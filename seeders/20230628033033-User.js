/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { faker } = require("@faker-js/faker");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");
const uuid = require("uuid");

function hashString(str) {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(str, 10)
      .then((hashed) => resolve(hashed))
      .catch((err) => reject(err));
  });
}

const createRandomUser = async () => {
  return {
    id: uuid.v4(),
    username: faker.internet.userName(),
    profile_image: faker.image.urlLoremFlickr({ category: "person" }),
    number: faker.phone.number(),
    email: faker.internet.email(),
    password: await hashString("12345678"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const fakeData = faker.helpers.multiple(createRandomUser, {
  count: 1000,
});

// eslint-disable-next-line no-undef
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakes = await Promise.all(fakeData);
    console.log(fakes);
    return queryInterface.bulkInsert("users", fakes);
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
