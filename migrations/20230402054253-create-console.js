"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Consoles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(8),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      
      type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["playstation", "xbox", "nitendo"],
      },
      type_storage: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["ssd", "hdd", "dvd"],
      },
      manufactur: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["sony", "microsoft", "nitendo"],
      },
      manufactur_logo: {
        type: Sequelize.STRING,
      },
      console_image: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Consoles");
  },
};
