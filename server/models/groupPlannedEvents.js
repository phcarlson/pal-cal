import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class groupPlannedEvents extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    groupid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'groupId'
      }
    },
    plannedEventId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'plannedEvents',
        key: 'plannedEventId'
      }
    }
  }, {
    sequelize,
    tableName: 'groupPlannedEvents',
    schema: 'public',
    timestamps: false
  });
  }
}
