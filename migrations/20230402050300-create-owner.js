"use strict";
/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Owners", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      id_user: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
      username: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nik: {
        unique: true,
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      birth_date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      number: {
        allowNull: false,
        type: Sequelize.STRING(13),
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
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
  down: (queryInterface) => {
    return queryInterface.dropTable("Owners");
  },
};
