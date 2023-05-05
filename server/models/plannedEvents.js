import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class plannedEvents extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    plannedEventId: {
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
    },
    creatorUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'groupId'
      }
    }
  }, {
    sequelize,
    tableName: 'plannedEvents',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "plannedEvents_pkey",
        unique: true,
        fields: [
          { name: "plannedEventId" },
        ]
      },
    ]
  });
  }
}
