import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class rsvps extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    plannedEventId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'plannedEvents',
        key: 'plannedEventId'
      }
    },
    response: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'rsvpResponses',
        key: 'value'
      }
    }
  }, {
    sequelize,
    tableName: 'rsvps',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "rsvps_pk",
        unique: true,
        fields: [
          { name: "username" },
          { name: "plannedEventId" },
        ]
      },
    ]
  });
  }
}
