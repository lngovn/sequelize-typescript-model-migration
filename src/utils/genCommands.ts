import { IExtractedModel } from '../types';
import {
  genAddForeignKeysCommands,
  genRemoveForeignKeysCommands,
} from './genForeignKeysCommands';
import {
  genAddIndexesCommands,
  genRemoveIndexesCommands,
} from './genIndexesCommands';
import { genCreateTableCommand, genDropTableCommand } from './genTableCommands';
import {
  genAddUniqueContraintsCommands,
  genRemoveUniqueConstraintsCommands,
} from './genUniqueConstraintsCommands';

export const generateMigrationCommands = (
  template: string,
  upCommands: string[],
  downCommands: string[],
) => {
  return template
    .replace(`{upCommands}`, `${upCommands.join(' ')}`)
    .replace(`{downCommands}`, `${downCommands.join(' ')}`);
};

export const genUpCommands = (model: IExtractedModel) => {
  return [
    [genCreateTableCommand(model.name, model.columns)],
    genAddForeignKeysCommands(model.name, model.foreignKeys),
    genAddIndexesCommands(
      model.name,
      model.options?.underscored,
      model.indexes,
    ),
    genAddUniqueContraintsCommands(model.name, model.uniqueConstraints),
  ];
};

export const genDownCommands = (model: IExtractedModel) => {
  return [
    genRemoveUniqueConstraintsCommands(model.name, model.uniqueConstraints),
    genRemoveForeignKeysCommands(model.name, model.foreignKeys),
    genRemoveIndexesCommands(model.name, model.indexes),
    [genDropTableCommand(model.name)],
  ];
};
