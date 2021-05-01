import prettier from 'prettier';
import { IMigrationOptions } from '../types';
import { makeFilename, writePromise } from './fileHelper';

export const createMigrationFile = async (
  commands: string,
  meta: string,
  options: IMigrationOptions,
) => {
  const filename = makeFilename(options, meta);
  const migrationDir = options.outDir || './migrations';

  return writePromise(
    `${migrationDir}/${filename}`,
    prettier.format(commands, options.prettierOptions),
  );
};
