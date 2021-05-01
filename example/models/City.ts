import { Table, Column, Model, PrimaryKey, Index } from 'sequelize-typescript';

@Table({
  tableName: 'city',
  underscored: true,
})
class City extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id!: number;

  @Column
  @Index('city_name_unique_key')
  cityName!: string;

  @Column
  countryName!: string;
}

export default City;
