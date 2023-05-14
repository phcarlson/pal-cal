import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class groups extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'groups',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "groups_pk",
        unique: true,
        fields: [
          { name: "groupId" },
        ]
      },
    ]
  });
  }
}
