import { Sequelize } from 'sequelize-typescript';
import SequelizeMeta from '../models/SequelizeMeta';
import { Op } from 'sequelize';
import { getCurrentPrefix, parseCurrentVersionFromMeta } from './fileHelper';
import { IMigrationOptions } from '../types';

export const getSequelizeMeta = async (
  sequelize: Sequelize,
  filename: string = 'noname.js',
) => {
  sequelize.addModels([SequelizeMeta]);
  return SequelizeMeta.findAll({
    limit: 1,
    where: { name: { [Op.iLike]: `%${filename}%` } },
    order: [['name', 'DESC']],
  }).then((items: SequelizeMeta[]) => items?.[0]?.get()?.name);
};

export const getLatestSnapshot = async (
  meta: string,
  options: IMigrationOptions,
) => {
  const prefix = getCurrentPrefix(parseCurrentVersionFromMeta(meta));
  const subfix = options.migrationName ? options.migrationName : 'noname.json';
  const filename = `${prefix}${
    subfix.includes('json') ? subfix : `${subfix}.json`
  }`;
  const snapshotDir = options.outDir || './snapshots';
  const snapshot = await import(
    `${process.cwd()}/${snapshotDir}/${filename}`
  ).catch((e) => ({}));
  return snapshot?.default;
};
