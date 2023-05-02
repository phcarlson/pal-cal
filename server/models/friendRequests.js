import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class friendRequests extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    fromUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    toUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    }
  }, {
    sequelize,
    tableName: 'friendRequests',
    schema: 'public',
    timestamps: false
  });
  }
}
