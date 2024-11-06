import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

export const UserTableName = 'user';

@Table({
  tableName: UserTableName
})
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  password: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  username: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW
  })
  updatedAt?: Date;
}
