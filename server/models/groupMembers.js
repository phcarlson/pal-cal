import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class groupMembers extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'groupMembers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "groupmembers_pk",
        unique: true,
        fields: [
          { name: "username" },
          { name: "groupId" },
        ]
      },
    ]
  });
  }
}
