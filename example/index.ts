import sequelize from "./sequelize";
import { generateMigration } from "../index";
import path from "path";

generateMigration(sequelize, {
  migrationName: "my-migration",
  outDir: path.join(__dirname, "./migrations"),
  snapshotDir: path.join(__dirname, "./snapshots"),
});
