import fs from 'fs';
import { IMigrationOptions } from '../types';

export const readPromise = (filename: string): Promise<string> =>
  new Promise((resolve, reject) =>
    fs.readFile(filename, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.toString());
    }),
  );

export const writePromise = (filename: string, data: string) =>
  new Promise((resolve, reject) =>
    fs.writeFile(filename, data, {}, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    }),
  );

export const parseCurrentVersionFromMeta = (meta: string = '00000000') => {
  return +meta.substring(0, 8);
};

export const getNextPrefix = (currentVersion: number) => {
  return `${(++currentVersion).toString().padStart(8, '0')}-`;
};

export const getCurrentPrefix = (currentVersion: number) => {
  return `${currentVersion.toString().padStart(8, '0')}-`;
};

export const createMigrationName = (meta: string, filename: string) => {
  const prefix = getNextPrefix(parseCurrentVersionFromMeta(meta));
  return `${prefix}${filename}`;
};

export const makeFilename = (
  options: IMigrationOptions,
  meta: string,
  ext: string = '.js',
) => {
  const filename = options.migrationName
    ? options.migrationName
    : `noname${ext}`;
  return `${getNextPrefix(parseCurrentVersionFromMeta(meta))}${
    filename?.includes(ext) ? filename : `${filename}${ext}`
  }`;
};
