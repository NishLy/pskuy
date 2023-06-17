"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Joysticks", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(8),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      manufactur: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["sony", "microsoft", "nitendo"],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Joysticks");
  },
};
