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
    plannedeventid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'plannedEvents',
        key: 'plannedeventid'
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
