import sequelize from './sequelize';
import { generateMigration } from '../index';

generateMigration(sequelize, { migrationName: 'my-migration' });
