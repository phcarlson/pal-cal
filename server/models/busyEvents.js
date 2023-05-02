import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class busyEvents extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    busyeventid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    startday: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    starthour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    startminute: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    endday: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    endhour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    endminute: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'busyEvents',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "busyEvents_pkey",
        unique: true,
        fields: [
          { name: "busyeventid" },
        ]
      },
    ]
  });
  }
}
