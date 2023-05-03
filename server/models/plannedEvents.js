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
      allowNull: true
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startMinute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endDay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endMinute: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      allowNull: true,
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
