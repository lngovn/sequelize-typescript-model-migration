import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  DataType,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import Companies from './Companies';

@Table({
  tableName: 'users',
  underscored: true,
})
class Users extends Model {
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

  @AllowNull(false)
  @Column
  lastName!: string;

  @Column({
    type: DataType.ENUM('MALE', 'FEMALE', 'UNDISCLOSED'),
  })
  @Index({ name: 'gender_idx_key' })
  gender!: string;

  @Column({ type: DataType.CITEXT })
  description!: string;

  @Column({ type: DataType.TEXT({ length: 'tiny' }) })
  biography!: string;

  @Column({
    type: DataType.INTEGER({ unsigned: true, zerofill: true }),
  })
  age!: number;

  @Column({
    type: DataType.BIGINT({ length: 2000, unsigned: true, zerofill: true }),
  })
  ageInDays!: number;

  @Column({ type: DataType.FLOAT(5, 5) })
  height!: number;

  @Column({ type: DataType.REAL(5, 5) })
  pointInReal!: number;

  @Column({ type: DataType.DOUBLE({ decimals: 11 }) })
  pointInDouble!: number;

  @Column({ type: DataType.DECIMAL(5, 5) })
  pointInDecimal!: number;

  @Column({ type: DataType.DATE(6) })
  birthday!: Date;

  @Column({ type: DataType.ARRAY(DataType.RANGE(DataType.DATE)) })
  texts!: string[];

  @Column({ type: DataType.RANGE(DataType.DATE) })
  range!: string[];

  @Column({ type: DataType.GEOMETRY })
  geometry!: string;

  @Column({ type: DataType.GEOGRAPHY })
  geography!: string;

  @ForeignKey(() => Companies)
  @Column
  companyId!: number;

  @BelongsTo(() => Companies)
  company!: Companies;

  @Column({ type: DataType.VIRTUAL })
  virtualValue!: string;
}

export default Users;
