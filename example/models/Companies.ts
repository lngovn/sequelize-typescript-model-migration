import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  DataType,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { Op } from 'sequelize';

@Table({
  tableName: 'companies',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['name', 'is_deleted'],
      where: {
        name: { [Op.in]: ['name1', 'name2'] },
        is_deleted: { [Op.eq]: true },
      },
    },
  ],
})
class Companies extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id!: number;

  @IsUUID(4)
  @Unique(true)
  @Column({ defaultValue: DataType.UUIDV4 })
  uuid!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @Column({ defaultValue: false })
  isDeleted!: boolean;
}

export default Companies;
