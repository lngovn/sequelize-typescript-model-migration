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

  const dropTableCommands: string[] = [];
  const removeIndexesCommands: string[] = [];
  const removeForeignKeyCommands: string[] = [];

  for (const model of Object.values(models)) {
    const [
      createTableCmd,
      addForeignKeyCmds,
      createIndexesCmds,
    ] = genUpCommands(model);
    createTableCommands.push(...createTableCmd);
    createIndexesCommands.push(...createIndexesCmds);
    addForeignKeyCmdsCommands.push(...addForeignKeyCmds);

    const [
      removeForeignKeyCmds,
      removeIndexesCmd,
      dropTableCmds,
    ] = genDownCommands(model);
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
    ],
    [
      ...removeForeignKeyCommands,
      ...removeIndexesCommands,
      ...dropTableCommands,
    ],
  );
};
