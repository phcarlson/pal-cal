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
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    lastName: {
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
      type: DataTypes.STRING,
      allowNull: true
    },
    major: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
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
