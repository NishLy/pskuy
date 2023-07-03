"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Facilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_rental: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Rentals",
          key: "id",
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["kantin", "toilet", "wifi"],
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Facilities");
  },
};
