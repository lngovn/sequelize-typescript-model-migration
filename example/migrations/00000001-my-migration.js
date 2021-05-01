"use strict";
const { Op } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("city", {
      id: { autoIncrement: true, type: Sequelize.INTEGER, primaryKey: true },
      city_name: { type: Sequelize.STRING },
      country_name: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("companies", {
      id: { autoIncrement: true, type: Sequelize.INTEGER, primaryKey: true },
      uuid: { type: Sequelize.STRING, unique: true, validate: { isUUID: 4 } },
      name: { type: Sequelize.STRING, allowNull: false },
      is_deleted: { type: Sequelize.BOOLEAN },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("users", {
      id: { autoIncrement: true, type: Sequelize.INTEGER, primaryKey: true },
      uuid: { type: Sequelize.STRING, unique: true, validate: { isUUID: 4 } },
      name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      gender: { type: Sequelize.ENUM("MALE", "FEMALE", "UNDISCLOSED") },
      description: { type: Sequelize.CITEXT },
      biography: { type: Sequelize.TEXT("tiny") },
      age: { type: Sequelize.INTEGER.UNSIGNED.ZEROFILL },
      age_in_days: { type: Sequelize.BIGINT.UNSIGNED.ZEROFILL },
      height: { type: Sequelize.FLOAT },
      point_in_real: { type: Sequelize.REAL },
      point_in_double: { type: Sequelize.DOUBLE },
      point_in_decimal: { type: Sequelize.DECIMAL(5, 5) },
      birthday: { type: Sequelize.DATE(6) },
      texts: { type: Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) },
      range: { type: Sequelize.RANGE(Sequelize.DATE) },
      geometry: { type: Sequelize.GEOMETRY },
      geography: { type: Sequelize.GEOGRAPHY },
      company_id: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint("users", {
      references: { table: "companies", field: "id" },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
      fields: ["company_id"],
      type: "foreign key",
      name: "fk_users_company_id_companies",
    });
    await queryInterface.addIndex("city", {
      name: "city_name_unique_key",
      fields: ["city_name"],
    });
    await queryInterface.addIndex("companies", {
      unique: true,
      fields: ["name", "is_deleted"],
      where: {
        name: { [Op.in]: ["name1", "name2"] },
        is_deleted: { [Op.eq]: true },
      },
      name: "companies_name_is_deleted",
    });
    await queryInterface.addIndex("users", {
      name: "gender_idx_key",
      fields: ["gender"],
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "users",
      "fk_users_company_id_companies"
    );
    await queryInterface.removeIndex("city", "city_name_unique_key");
    await queryInterface.removeIndex("companies", "companies_name_is_deleted");
    await queryInterface.removeIndex("users", "gender_idx_key");
    await queryInterface.dropTable("city");
    await queryInterface.dropTable("companies");
    await queryInterface.dropTable("users");
  },
};
