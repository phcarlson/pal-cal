import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class users extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    college: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: "\\x"
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "username",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
  }
}
