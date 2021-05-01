import {
  loadAddColumnTemplate,
  loadRemoveColumnTemplate,
} from './loadTemplates';
import { parseObject } from './parse';

export const genAddColumnCommand = (
  tableName: string,
  columnName: string,
  attribute: any,
) => {
  return loadAddColumnTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{column}', `'${columnName}'`)
    .replace('{attribute}', parseObject(attribute));
};

export const genRemoveColumnCommand = (
  tableName: string,
  columnName: string,
) => {
  return loadRemoveColumnTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{column}', `'${columnName}'`);
};
