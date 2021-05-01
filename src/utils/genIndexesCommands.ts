import { IndexesOptions } from 'sequelize/types';
import { camelToSnakeCase, parseKeyValue } from './parse';
import { loadAddIndexTemplate, loadRemoveIndexTemplate } from './loadTemplates';

export const genAddIndexCommand = (
  tableName: string,
  isUnderscore: boolean,
  option: IndexesOptions,
) => {
  let str = '';
  for (const [k, v] of Object.entries(option)) {
    if (!v) {
      continue;
    }
    if (Array.isArray(v)) {
      str = `${str}${k}:[${v
        .map((vv) =>
          vv.name
            ? `'${isUnderscore ? camelToSnakeCase(vv.name) : vv.name}'`
            : `'${isUnderscore ? camelToSnakeCase(vv) : vv}'`,
        )
        .join(',')}],`;
      continue;
    }
    str = `${str}${parseKeyValue(k, v)},`;
  }
  return loadAddIndexTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{options}', `{${str}}`);
};

export const genAddIndexesCommands = (
  tableName: string,
  isUnderscore: boolean = false,
  options: { [idx: string]: IndexesOptions },
) => {
  let addIndexes: string[] = [];
  for (const option of Object.values(options)) {
    addIndexes.push(genAddIndexCommand(tableName, isUnderscore, option));
  }

  return addIndexes;
};

export const genRemoveIndexCommand = (tableName: string, idxName: string) =>
  loadRemoveIndexTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{indexName}', `'${idxName}'`);

export const genRemoveIndexesCommands = (
  tableName: string,
  options: { [idx: string]: IndexesOptions },
) => {
  const commands: string[] = [];
  for (const option of Object.values(options)) {
    commands.push(genRemoveIndexCommand(tableName, option.name!));
  }

  return commands;
};
