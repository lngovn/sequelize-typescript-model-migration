import { Model } from "sequelize-typescript";
import { IndexesOptions, InitOptions } from "sequelize/types";

export interface IMigrationOptions {
  /**
   * directory to store migration files. default value is `migrations` folder under root dir.
   */
  outDir?: string;
  /**
   * directory to store snapshot files. default value is `snapshots` folder under root dir.
   */
  snapshotDir?: string;
  /**
   * migration file name, default is "noname"
   */
  migrationName?: string;
  /**
   * Prettier options to format the migration file.
   */
  prettierOptions?: {};
}

export interface IUniqueConstraints {
  fields: string[];
  name: string;
}

export interface IExtractedModel {
  name: string;
  options?: InitOptions<Model<any, any>>;
  columns: {};
  foreignKeys: IForeignKeys;
  indexes: { [idx: string]: IndexesOptions };
  uniqueConstraints: IUniqueConstraints;
}

export interface IExtractedModels {
  [idx: string]: IExtractedModel;
}

export interface IForeignKeys {
  references?: {
    table?: string;
    field?: string;
  };
  onDelete?: string;
  onUpdate?: string;
  fields?: Array<string | { name: string }> | { [idx: string]: {} };
  type?: string;
  name: string;
}
