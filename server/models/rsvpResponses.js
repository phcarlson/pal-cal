import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class rsvpResponses extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'rsvpResponses',
    schema: 'public',
    timestamps: false
  });
  }
}
