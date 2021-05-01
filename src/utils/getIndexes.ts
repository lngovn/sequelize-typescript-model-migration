import { IndexesOptions } from 'sequelize/types';

export const getIndexes = (indexes: readonly IndexesOptions[] = []) => {
  const keys: any = {};
  for (const index of indexes) {
    keys[index.name!] = index;
  }
  return keys;
};
