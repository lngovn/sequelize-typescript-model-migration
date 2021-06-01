import { IExtractedModels } from '../types';
import {
  genDownCommands,
  generateMigrationCommands,
  genUpCommands,
} from './genCommands';

export const generateBrandnewCommands = (
  models: IExtractedModels,
  [migrationTpl]: string[],
) => {
  const createTableCommands: string[] = [];
  const createIndexesCommands: string[] = [];
  const addForeignKeyCmdsCommands: string[] = [];
  const addUniqueConstraintsCommands: string[] = [];

  const dropTableCommands: string[] = [];
  const removeIndexesCommands: string[] = [];
  const removeForeignKeyCommands: string[] = [];
  const removeUniqueConstraintsCommands: string[] = [];

  for (const model of Object.values(models)) {
    const [
      createTableCmd,
      addForeignKeyCmds,
      createIndexesCmds,
      uniqueConstraintsCmds,
    ] = genUpCommands(model);
    createTableCommands.push(...createTableCmd);
    createIndexesCommands.push(...createIndexesCmds);
    addForeignKeyCmdsCommands.push(...addForeignKeyCmds);
    addUniqueConstraintsCommands.push(...uniqueConstraintsCmds);

    const [
      removeUniqueConstraintsCmds,
      removeForeignKeyCmds,
      removeIndexesCmd,
      dropTableCmds,
    ] = genDownCommands(model);
    removeUniqueConstraintsCommands.push(...removeUniqueConstraintsCmds);
    dropTableCommands.push(...dropTableCmds);
    removeIndexesCommands.push(...removeIndexesCmd);
    removeForeignKeyCommands.push(...removeForeignKeyCmds);
  }

  return generateMigrationCommands(
    migrationTpl,
    [
      ...createTableCommands,
      ...addForeignKeyCmdsCommands,
      ...createIndexesCommands,
      ...addUniqueConstraintsCommands,
    ],
    [
      ...removeUniqueConstraintsCommands,
      ...removeForeignKeyCommands,
      ...removeIndexesCommands,
      ...dropTableCommands,
    ],
  );
};
