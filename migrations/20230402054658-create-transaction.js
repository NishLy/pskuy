"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_user: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
      id_rental: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Rentals",
          key: "id",
        },
      },
      id_payment: {
        type: Sequelize.UUID,
        references: {
          model: "Payments",
          key: "id",
        },
      },
      id_room: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Rooms",
          key: "id",
        },
      },
      time_checkIn: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      time_checkOut: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      rent_time: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      total_prices: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      comment: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.FLOAT(2),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["proccess", "finished", "ongoing", "completed", "cancel"],
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
    await queryInterface.dropTable("Transactions");
  },
};
