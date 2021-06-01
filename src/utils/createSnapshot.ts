import fs from 'fs';
import { makeFilename, writePromise } from './fileHelper';
import { IExtractedModel, IExtractedModels, IMigrationOptions } from '../types';
import clone from 'clone-deep';
import { IndexesOptions } from 'sequelize/types';
import { parseObject } from './parse';

export const convertArrayToObject = (arr: any) => {
  const target: { [idx: string]: {} } = {};
  for (const item of arr) {
    if (typeof item === 'string') {
      target[item] = item;
      continue;
    }

    target[item.name] = item;
  }
  return target;
};

export const convertObjectToArray = (target: { [idx: string]: any }) => {
  const result = [];
  for (const val of Object.values(target)) {
    result.push(val);
  }
  return result;
};

export const sanitizeFields = (targets: { [idx: string]: any }) => {
  for (const val of Object.values(targets)) {
    if (Array.isArray(val.fields) && val.fields.length > 0) {
      val.fields = convertArrayToObject(val.fields) as any;
    }
  }
};

export const revertSanitizeFields = (targets: { [idx: string]: any }) => {
  const copies = clone(targets);

  for (const val of Object.values(copies)) {
    val.fields = convertObjectToArray(val.fields) as any;
    val.where = targets[val.name].where;
  }

  return copies;
};

export const revertIndexesWhere = (
  indexes: { [idx: string]: IndexesOptions },
  originIndexes: { [idx: string]: IndexesOptions },
) => {
  for (const index of Object.values(indexes)) {
    if (index.where) {
      index.where = parseObject(originIndexes[index.name!].where) as any;
    }
  }
};

export const sanitizeModelsFields = (models: IExtractedModels) => {
  const copies = clone(models);
  for (const model of Object.values(copies)) {
    sanitizeFields(model.indexes);
    sanitizeFields(model.foreignKeys);
    sanitizeFields(model.uniqueConstraints);
    revertIndexesWhere(model.indexes, models[model.name!].indexes);
  }
  return copies;
};

export const createSnapshot = async (
  models: IExtractedModels,
  meta: string,
  options: IMigrationOptions,
) => {
  const snapshotName = makeFilename(options, meta, '.json');
  const snapshotDir = options.snapshotDir || './snapshots';

  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir);
  }

  return writePromise(
    `${snapshotDir}/${snapshotName}`,
    JSON.stringify(sanitizeModelsFields(models)),
  );
};
