import { IndexesOptions } from 'sequelize/types';
import { camelToSnakeCase, parseKeyValue } from './parse';
import {
  loadAddIndexTemplate,
  loadAddUniqueConstraints,
  loadRemoveIndexTemplate,
  loadRemoveUniqueConstraints,
} from './loadTemplates';
import { IUniqueConstraints } from '../types';

export const genAddUniqueConstraintCommand = (
  tableName: string,
  uniqueConstraint: {},
) => {
  let str = '';
  for (const [k, v] of Object.entries(uniqueConstraint)) {
    if (!v) {
      continue;
    }
    if (Array.isArray(v)) {
      str = `${str}${k}:[${v
        .map((vv) => (typeof vv === 'string' ? `'${vv}'` : vv))
        .join(',')}],`;
      continue;
    }
    str = `${str}${parseKeyValue(k, v)},`;
  }
  return loadAddUniqueConstraints()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{options}', `{${str}}`);
};

export const genAddUniqueContraintsCommands = (
  tableName: string,
  constraints: IUniqueConstraints,
) => {
  const cmds: string[] = [];
  for (const constraint of Object.values(constraints)) {
    cmds.push(genAddUniqueConstraintCommand(tableName, constraint));
  }
  return cmds;
};

export const genRemoveUniqueConstraintsCommand = (
  tableName: string,
  constraintName: string,
) => {
  return loadRemoveUniqueConstraints()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{contraints}', `'${constraintName}'`);
};

export const genRemoveUniqueConstraintsCommands = (
  tableName: string,
  keys: any,
) => {
  const commands = [];
  for (const key of Object.keys(keys)) {
    commands.push(genRemoveUniqueConstraintsCommand(tableName, key));
  }
  return commands;
};
