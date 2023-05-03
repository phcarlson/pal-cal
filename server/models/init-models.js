import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _busyEvents from  "./busyEvents.js";
import _friendRequests from  "./friendRequests.js";
import _groupMembers from  "./groupMembers.js";
import _groups from  "./groups.js";
import _plannedEvents from  "./plannedEvents.js";
import _rsvpResponses from  "./rsvpResponses.js";
import _rsvps from  "./rsvps.js";
import _userFriends from  "./userFriends.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  const busyEvents = _busyEvents.init(sequelize, DataTypes);
  const friendRequests = _friendRequests.init(sequelize, DataTypes);
  const groupMembers = _groupMembers.init(sequelize, DataTypes);
  const groups = _groups.init(sequelize, DataTypes);
  const plannedEvents = _plannedEvents.init(sequelize, DataTypes);
  const rsvpResponses = _rsvpResponses.init(sequelize, DataTypes);
  const rsvps = _rsvps.init(sequelize, DataTypes);
  const userFriends = _userFriends.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  groups.belongsToMany(users, { as: 'username_users', through: groupMembers, foreignKey: "groupId", otherKey: "username" });
  users.belongsToMany(groups, { as: 'groupId_groups', through: groupMembers, foreignKey: "username", otherKey: "groupId" });
  users.belongsToMany(users, { as: 'username2_users', through: userFriends, foreignKey: "username1", otherKey: "username2" });
  users.belongsToMany(users, { as: 'username1_users', through: userFriends, foreignKey: "username2", otherKey: "username1" });
  groupMembers.belongsTo(groups, { foreignKey: "groupId"});
  groups.hasMany(groupMembers, { foreignKey: "groupId"});
  plannedEvents.belongsTo(groups, { foreignKey: "groupId"});
  groups.hasMany(plannedEvents, { foreignKey: "groupId"});
  busyEvents.belongsTo(users, { foreignKey: "creatorUsername"});
  users.hasMany(busyEvents, { foreignKey: "creatorUsername"});
  friendRequests.belongsTo(users, { foreignKey: "fromUsername"});
  users.hasMany(friendRequests, { foreignKey: "fromUsername"});
  friendRequests.belongsTo(users, { foreignKey: "toUsername"});
  users.hasMany(friendRequests, { foreignKey: "toUsername"});
  groupMembers.belongsTo(users, { foreignKey: "username"});
  users.hasMany(groupMembers, { foreignKey: "username"});
  plannedEvents.belongsTo(users, { foreignKey: "creatorUsername"});
  users.hasMany(plannedEvents, { foreignKey: "creatorUsername"});
  userFriends.belongsTo(users, { foreignKey: "username1"});
  users.hasMany(userFriends, { foreignKey: "username1"});
  userFriends.belongsTo(users, { foreignKey: "username2"});
  users.hasMany(userFriends, { foreignKey: "username2"});

  return {
    busyEvents,
    friendRequests,
    groupMembers,
    groups,
    plannedEvents,
    rsvpResponses,
    rsvps,
    userFriends,
    users,
  };
}
