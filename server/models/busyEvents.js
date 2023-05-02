import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class busyEvents extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    busyEventId: {
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
    startDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    startMinute: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    endDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    endMinute: {
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
          { name: "busyEventId" },
        ]
      },
    ]
  });
  }
}
