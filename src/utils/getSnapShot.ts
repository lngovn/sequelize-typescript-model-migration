import { Sequelize } from "sequelize-typescript";
import SequelizeMeta from "../models/SequelizeMeta";
import { Op } from "sequelize";
import { getCurrentPrefix, parseCurrentVersionFromMeta } from "./fileHelper";
import { IMigrationOptions } from "../types";

export const getSequelizeMeta = async (
  sequelize: Sequelize,
  filename: string = "noname.js"
) => {
  const dialect = sequelize.getDialect()
  const like = dialect === 'postgres' ? Op.iLike : Op.like;
  sequelize.addModels([SequelizeMeta]);
  return SequelizeMeta.findAll({
    limit: 1,
    where: { name: { [like]: `%${filename}%` } },
    order: [["name", "DESC"]],
  }).then((items: SequelizeMeta[]) => items?.[0]?.get()?.name);
};

export const getLatestSnapshot = async (
  meta: string,
  options: IMigrationOptions
) => {
  const prefix = getCurrentPrefix(parseCurrentVersionFromMeta(meta));
  const subfix = options.migrationName ? options.migrationName : "noname.json";
  const filename = `${prefix}${
    subfix.includes("json") ? subfix : `${subfix}.json`
  }`;
  const snapshotDir = options.snapshotDir || "./snapshots";
  const snapshot = await import(
    `${snapshotDir}/${filename}`
  ).catch((e) => ({}));
  return snapshot?.default;
};
