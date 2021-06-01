import { Table, Column, Model, PrimaryKey, Index } from 'sequelize-typescript';

@Table({
  tableName: 'city',
  underscored: true,
})
class City extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id!: number;

  @Column({ unique: 'city_city_name_country_name_unique' })
  cityName!: string;

  @Column({ unique: 'city_city_name_country_name_unique' })
  countryName!: string;

  @Column({ unique: true })
  code!: string;
}

export default City;
