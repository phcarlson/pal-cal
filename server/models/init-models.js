import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _busyEvents from  "./busyEvents.js";
import _friendRequests from  "./friendRequests.js";
import _groupMembers from  "./groupMembers.js";
import _groupPlannedEvents from  "./groupPlannedEvents.js";
import _groups from  "./groups.js";
import _plannedEvents from  "./plannedEvents.js";
import _rsvpResponses from  "./rsvpResponses.js";
import _rsvps from  "./rsvps.js";
import _userBusyEvents from  "./userBusyEvents.js";
import _userFriends from  "./userFriends.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  const busyEvents = _busyEvents.init(sequelize, DataTypes);
  const friendRequests = _friendRequests.init(sequelize, DataTypes);
  const groupMembers = _groupMembers.init(sequelize, DataTypes);
  const groupPlannedEvents = _groupPlannedEvents.init(sequelize, DataTypes);
  const groups = _groups.init(sequelize, DataTypes);
  const plannedEvents = _plannedEvents.init(sequelize, DataTypes);
  const rsvpResponses = _rsvpResponses.init(sequelize, DataTypes);
  const rsvps = _rsvps.init(sequelize, DataTypes);
  const userBusyEvents = _userBusyEvents.init(sequelize, DataTypes);
  const userFriends = _userFriends.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  busyEvents.belongsToMany(users, { as: 'username_users_userBusyEvents', through: userBusyEvents, foreignKey: "busyEventId", otherKey: "username" });
  groups.belongsToMany(users, { as: 'username_users', through: groupMembers, foreignKey: "groupId", otherKey: "username" });
  users.belongsToMany(busyEvents, { as: 'busyEventId_busyEvents', through: userBusyEvents, foreignKey: "username", otherKey: "busyEventId" });
  users.belongsToMany(groups, { as: 'groupId_groups', through: groupMembers, foreignKey: "username", otherKey: "groupId" });
  users.belongsToMany(users, { as: 'username2_users', through: userFriends, foreignKey: "username1", otherKey: "username2" });
  users.belongsToMany(users, { as: 'username1_users', through: userFriends, foreignKey: "username2", otherKey: "username1" });
  userBusyEvents.belongsTo(busyEvents, { as: "busyEvent", foreignKey: "busyEventId"});
  busyEvents.hasMany(userBusyEvents, { as: "userBusyEvents", foreignKey: "busyEventId"});
  groupMembers.belongsTo(groups, { as: "group", foreignKey: "groupId"});
  groups.hasMany(groupMembers, { as: "groupMembers", foreignKey: "groupId"});
  groupPlannedEvents.belongsTo(groups, { as: "group", foreignKey: "groupid"});
  groups.hasMany(groupPlannedEvents, { as: "groupPlannedEvents", foreignKey: "groupid"});
  groupPlannedEvents.belongsTo(plannedEvents, { as: "plannedevent", foreignKey: "plannedeventid"});
  plannedEvents.hasMany(groupPlannedEvents, { as: "groupPlannedEvents", foreignKey: "plannedeventid"});
  rsvps.belongsTo(plannedEvents, { as: "plannedevent", foreignKey: "plannedeventid"});
  plannedEvents.hasMany(rsvps, { as: "rsvps", foreignKey: "plannedeventid"});
  rsvps.belongsTo(rsvpResponses, { as: "response_rsvpResponse", foreignKey: "response"});
  rsvpResponses.hasMany(rsvps, { as: "rsvps", foreignKey: "response"});
  friendRequests.belongsTo(users, { as: "fromusername_user", foreignKey: "fromusername"});
  users.hasMany(friendRequests, { as: "friendRequests", foreignKey: "fromusername"});
  friendRequests.belongsTo(users, { as: "tousername_user", foreignKey: "tousername"});
  users.hasMany(friendRequests, { as: "tousername_friendRequests", foreignKey: "tousername"});
  groupMembers.belongsTo(users, { as: "username_user", foreignKey: "username"});
  users.hasMany(groupMembers, { as: "groupMembers", foreignKey: "username"});
  plannedEvents.belongsTo(users, { as: "creatorusername_user", foreignKey: "creatorusername"});
  users.hasMany(plannedEvents, { as: "plannedEvents", foreignKey: "creatorusername"});
  rsvps.belongsTo(users, { as: "username_user", foreignKey: "username"});
  users.hasMany(rsvps, { as: "rsvps", foreignKey: "username"});
  userBusyEvents.belongsTo(users, { as: "username_user", foreignKey: "username"});
  users.hasMany(userBusyEvents, { as: "userBusyEvents", foreignKey: "username"});
  userFriends.belongsTo(users, { as: "username1_user", foreignKey: "username1"});
  users.hasMany(userFriends, { as: "userFriends", foreignKey: "username1"});
  userFriends.belongsTo(users, { as: "username2_user", foreignKey: "username2"});
  users.hasMany(userFriends, { as: "username2_userFriends", foreignKey: "username2"});

  return {
    busyEvents,
    friendRequests,
    groupMembers,
    groupPlannedEvents,
    groups,
    plannedEvents,
    rsvpResponses,
    rsvps,
    userBusyEvents,
    userFriends,
    users,
  };
}
