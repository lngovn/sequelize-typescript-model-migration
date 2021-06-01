import { Model, ModelCtor } from 'sequelize/types';

export const getUniqueConstraints = (model: ModelCtor<Model>) => {
  const constraints: any = {};
  for (const attr of Object.values(model.rawAttributes)) {
    if (typeof attr.unique === 'string') {
      constraints[attr.unique] = constraints[attr.unique] || {
        type: 'unique',
        name: attr.unique,
        fields: [],
      };
      constraints[attr.unique].fields.push(attr.field);
    }
  }
  return constraints;
};
