"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
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
      id_console: {
        type: Sequelize.STRING(8),
        allowNull: false,
        references: {
          model: "Consoles",
          key: "id",
        },
      },
      id_joystick_first_person: {
        type: Sequelize.STRING(8),
        references: {
          model: "Joysticks",
          key: "id",
        },
      },
      id_joystick_second_person: {
        type: Sequelize.STRING(8),
        references: {
          model: "Joysticks",
          key: "id",
        },
      },
      room_images: {
        type: Sequelize.TEXT,
      },
      console_production_year: {
        allowNull: false,
        type: Sequelize.INTEGER(4),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["unuseable", "useable", "good"],
      },
      price_per_hour: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      rating: {
        type: Sequelize.FLOAT(2),
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_rented: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      time_end_current_rent: {
        type: Sequelize.DATE,
      },
      times_viewed: {
        type: Sequelize.INTEGER,
      },
      times_booked: {
        type: Sequelize.INTEGER,
      },
      information: {
        type: Sequelize.DataTypes.TEXT,
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
    await queryInterface.dropTable("Rooms");
  },
};
