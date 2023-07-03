"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Rentals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      rental_logo: {
        unique: true,
        type: Sequelize.DataTypes.STRING,
      },
      rental_images: {
        type: Sequelize.TEXT,
      },
      address: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      id_owner: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "Owners", // 'Actors' would also work
          key: "id",
        },
      },
      total_rating: {
        defaultValue: 0,
        type: Sequelize.DataTypes.FLOAT(2),
      },
      total_transaction: {
        defaultValue: 0,
        type: Sequelize.DataTypes.INTEGER,
      },
      latitude: {
        type: Sequelize.DataTypes.FLOAT,
      },
      longitude: {
        type: Sequelize.DataTypes.FLOAT,
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
  down: (queryInterface) => {
    return queryInterface.dropTable("Rentals");
  },
};
