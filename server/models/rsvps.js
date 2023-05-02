import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class rsvps extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    plannedEventId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'plannedEvents',
        key: 'plannedEventId'
      }
    },
    response: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'rsvpResponses',
        key: 'value'
      }
    }
  }, {
    sequelize,
    tableName: 'rsvps',
    schema: 'public',
    timestamps: false
  });
  }
}
