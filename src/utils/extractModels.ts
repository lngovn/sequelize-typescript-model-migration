import { Model, ModelCtor } from 'sequelize/types';
import { IExtractedModels } from '../types';
import { getColumnsAttribute } from './getColumnsAttribute';
import { getForeignKeys } from './getForeignKey';
import { getIndexes } from './getIndexes';
import { getUniqueConstraints } from './getUniqueConstraints';

export const sanitizeModels = (models: IExtractedModels) => {
  const copieds: IExtractedModels = {};
  for (const model of Object.values(models)) {
    const copied = { ...model };
    delete (copied.options as any)?.sequelize;
    delete (copied.options as any)?.indexes;
    copieds[model.name] = copied;
  }
  return copieds;
};

export const extractModels = (models: { [key: string]: ModelCtor<Model> }) => {
  const extractedModels: any = {};

  for (const model of Object.values(models)) {
    if (model.tableName === 'SequelizeMeta') {
      continue;
    }
    let extractedModel = {
      name: model.tableName,
      options: model.options,
      columns: {},
      foreignKeys: getForeignKeys(model),
      indexes: getIndexes(model.options?.indexes),
      uniqueConstraints: getUniqueConstraints(model)
    };
    for (const attr of Object.values(model.rawAttributes)) {
      // Skip virtual type
      if (attr.type.constructor.name === 'VIRTUAL') {
        continue;
      }
      const extractedColumns = getColumnsAttribute(attr);
      extractedModel.columns = {
        ...extractedModel.columns,
        ...extractedColumns,
      };
    }
    extractedModels[model.tableName] = extractedModel;
  }
  return sanitizeModels(extractedModels);
};
