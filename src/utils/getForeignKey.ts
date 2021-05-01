import { Model, ModelCtor } from 'sequelize/types';
import { extractColumns } from './parseDataType';

export const getForeignKeys = (model: ModelCtor<Model>) => {
  const keys: any = {};
  for (const attr of Object.values(model.rawAttributes)) {
    if (attr.references) {
      const extractedKey: any = {
        ...extractColumns(['references', 'onDelete', 'onUpdate'], attr),
        fields: [attr.field],
        type: 'foreign key',
      };
      extractedKey.references.table = extractedKey.references.model;
      extractedKey.references.field = extractedKey.references.key;
      extractedKey.name = `fk_${model.tableName}_${attr.field}_${extractedKey.references.table}`;
      delete extractedKey.references.model;
      delete extractedKey.references.key;
      keys[extractedKey.name] = extractedKey;
    }
  }
  return keys;
};
