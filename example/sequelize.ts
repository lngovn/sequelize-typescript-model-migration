import { Sequelize } from 'sequelize-typescript';
import rootConfig from './config/config.json';
import path from 'path';

const config = rootConfig['development'];

export const createSequelizeConnection = (models?: string[]) => {
  return new Sequelize(
    config.database || '',
    config.username || '',
    config.password || '',
    {
      dialect: 'postgres',
      port: 5432,
      database: config.database,
      host: config.host || '',
      pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: true,
      models: [path.join(__dirname, '/models')]
    },
  );
};

export default createSequelizeConnection();
