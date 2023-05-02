import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class userBusyEvents extends Model {
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
    busyEventId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'busyEvents',
        key: 'busyEventId'
      }
    }
  }, {
    sequelize,
    tableName: 'userBusyEvents',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "userBusyEvents_pk",
        unique: true,
        fields: [
          { name: "username" },
          { name: "busyEventId" },
        ]
      },
    ]
  });
  }
}
