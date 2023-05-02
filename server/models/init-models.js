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

  busyEvents.belongsToMany(users, { as: 'username_users', through: userBusyEvents, foreignKey: "busyEventId", otherKey: "username" });
  users.belongsToMany(busyEvents, { as: 'busyEventId_busyEvents', through: userBusyEvents, foreignKey: "username", otherKey: "busyEventId" });
  userBusyEvents.belongsTo(busyEvents, { as: "busyEvent", foreignKey: "busyEventId"});
  busyEvents.hasMany(userBusyEvents, { as: "userBusyEvents", foreignKey: "busyEventId"});
  groupPlannedEvents.belongsTo(groups, { as: "group", foreignKey: "groupid"});
  groups.hasMany(groupPlannedEvents, { as: "groupPlannedEvents", foreignKey: "groupid"});
  groupPlannedEvents.belongsTo(plannedEvents, { as: "plannedEvent", foreignKey: "plannedEventId"});
  plannedEvents.hasMany(groupPlannedEvents, { as: "groupPlannedEvents", foreignKey: "plannedEventId"});
  rsvps.belongsTo(plannedEvents, { as: "plannedEvent", foreignKey: "plannedEventId"});
  plannedEvents.hasMany(rsvps, { as: "rsvps", foreignKey: "plannedEventId"});
  rsvps.belongsTo(rsvpResponses, { as: "response_rsvpResponse", foreignKey: "response"});
  rsvpResponses.hasMany(rsvps, { as: "rsvps", foreignKey: "response"});
  friendRequests.belongsTo(users, { as: "fromUsername_user", foreignKey: "fromUsername"});
  users.hasMany(friendRequests, { as: "friendRequests", foreignKey: "fromUsername"});
  friendRequests.belongsTo(users, { as: "toUsername_user", foreignKey: "toUsername"});
  users.hasMany(friendRequests, { as: "toUsername_friendRequests", foreignKey: "toUsername"});
  plannedEvents.belongsTo(users, { as: "creatorUsername_user", foreignKey: "creatorUsername"});
  users.hasMany(plannedEvents, { as: "plannedEvents", foreignKey: "creatorUsername"});
  rsvps.belongsTo(users, { as: "username_user", foreignKey: "username"});
  users.hasMany(rsvps, { as: "rsvps", foreignKey: "username"});
  userBusyEvents.belongsTo(users, { as: "username_user", foreignKey: "username"});
  users.hasMany(userBusyEvents, { as: "userBusyEvents", foreignKey: "username"});

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
