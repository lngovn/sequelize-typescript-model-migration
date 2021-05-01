import { DataType, Sequelize } from 'sequelize-typescript';

export const createMetaTable = (sequelize: Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();
  return queryInterface.createTable('SequelizeMeta', {
    name: DataType.STRING,
  });
};
