import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class userFriends extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    username1: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    username2: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'userFriends',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "userfriends_pk",
        unique: true,
        fields: [
          { name: "username1" },
          { name: "username2" },
        ]
      },
    ]
  });
  }
}
