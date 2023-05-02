import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class plannedEvents extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    plannedeventid: {
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
      allowNull: true
    },
    starthour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startminute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endday: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endhour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endminute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creatorusername: {
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
          { name: "plannedeventid" },
        ]
      },
    ]
  });
  }
}
