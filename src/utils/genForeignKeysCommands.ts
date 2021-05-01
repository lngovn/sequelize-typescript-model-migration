import { parseObject } from './parse';
import {
  loadAddForeignKeysTemplate,
  loadRemoveForeignKeysTemplate,
} from './loadTemplates';

export const genAddForeignKeyCommand = (tableName: string, key: any) => {
  return loadAddForeignKeysTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{options}', `${parseObject(key)}`);
};

export const genAddForeignKeysCommands = (tableName: string, keys: any) => {
  const commands = [];
  for (const key of Object.values(keys)) {
    commands.push(genAddForeignKeyCommand(tableName, key));
  }
  return commands;
};

export const genRemoveForeignKeyCommand = (tableName: string, key: string) =>
  loadRemoveForeignKeysTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{foreignKey}', `'${key}'`);

export const genRemoveForeignKeysCommands = (tableName: string, keys: any) => {
  const commands = [];
  for (const key of Object.keys(keys)) {
    commands.push(genRemoveForeignKeyCommand(tableName, key));
  }
  return commands;
};
