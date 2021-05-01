import { Sequelize } from 'sequelize-typescript';
import { IMigrationOptions } from '../types';
import { extractModels } from './extractModels';
import { generateBrandnewCommands } from './generateBrandnewCommands';
import { loadAllTemplates } from './loadTemplates';
import { createMetaTable } from './createMetaTables';
import { createSnapshot } from './createSnapshot';
import { createMigrationFile } from './createMigrationFile';
import { generateChangesCommands } from './generateChangesCommands';
import { getLatestSnapshot, getSequelizeMeta } from './getSnapShot';

export const generateMigration = async (
  sequelize: Sequelize,
  options: IMigrationOptions = { prettierOptions: {} },
) => {
  await createMetaTable(sequelize);

  const meta = await getSequelizeMeta(sequelize, options.migrationName);

  const snapshot = await getLatestSnapshot(meta, options);

  const templates = loadAllTemplates();

  const extractedModels = extractModels(sequelize.models);

  const commands = snapshot
    ? generateChangesCommands(snapshot, extractedModels)
    : generateBrandnewCommands(extractedModels, templates);

  await createSnapshot(extractedModels, meta, options);

  await createMigrationFile(commands, meta, options);
};
