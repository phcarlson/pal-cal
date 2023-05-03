import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class friendRequests extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    fromUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    toUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'username'
      }
    }
  }, {
    sequelize,
    tableName: 'friendRequests',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "friendRequests_pk",
        unique: true,
        fields: [
          { name: "fromUsername" },
          { name: "toUsername" },
        ]
      },
    ]
  });
  }
}
