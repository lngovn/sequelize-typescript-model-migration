import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'SequelizeMeta',
  timestamps: false,
})
class SequelizeMeta extends Model {
  @PrimaryKey
  @Column
  name!: string;
}

export default SequelizeMeta;
