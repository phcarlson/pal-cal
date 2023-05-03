import 'dotenv/config';
import { Sequelize, Op } from 'sequelize';
import initModels from './models/init-models.js';

const sequelize = new Sequelize(process.env.DATABASE_URL);
await sequelize.authenticate();
const models = initModels(sequelize);

// USER
/**
 * Creates a user with the given properties
 * @param {Object} user MUST have a field called username.
 * Can have zero or more of these fields: firstName, lastName, college, bio, image
 * Missing fields will be given sane default values
 */
export async function createUser(user) {
    await models.users.create(user);
}

/**
 * Update a user
 * @param {string} username The unique username of the user to update
 * @param {Object} userPatch An object containing the values to change
 * Has one or more of these fields: username, firstName, lastName, college, bio, image
 * Missing fields will be unchanged
 */
export async function updateUser(username, userPatch) {
    await models.users.update(userPatch, {where: {username: username}});
}

/**
 * Get info about a user
 * @param {string} username The unique username of the user to get
 * @returns A User object
 */
export async function getUser(username) {
    const user = await models.users.findByPk(username);
    return user.dataValues;
}

/**
 * Batch retrieve info about multiple users
 * @param {Array[string]} usernames A list of usernames
 * @returns A list of User objects
 */
export async function getUsers(usernames) {
    const users = await models.users.findAll({where: {username: {[Op.in]: usernames}}});
    return users.map(user => user.dataValues);
}

/**
 * Get the IDs of all groups the user is in
 * @param {string} username 
 * @returns An array of string group IDs
 */
export async function getGroupIdsOfUser(username) {
    const groups = await models.groups.findAll({
        include: [{ model: models.users, as: "username_users", where: { username: username } }],
        attributes: ['groupId']
    });
    return groups.map(group => group.groupId);
}

/**
 * Check if the given user exists in the database
 * @param {string} username 
 * @returns true or false
 */
export async function userExists(username) {
    const user = await models.users.findByPk(username);
    return user !== null;
}

/**
 * Get the usernames of every user in the system
 * @returns An array of String usernames
 */
export async function getAllUsernames() {
    const users = await models.users.findAll({attributes: ["username"]});
    return users.map(user => user.username);
}

/**
 * Get the IDs all busy events on a user's calendar
 * @param {string} username 
 * @returns An array of String event IDs
 */
export async function getUserBusyEventIds(username) {
    const busyEvents = await models.busyEvents.findAll({
        attributes: ["busyEventId"],
        where: {creatorUsername: username}
    });
    return busyEvents.map(event => event.busyEventId);
}

/**
 * Delete a user from the database
 * @param {string} username 
 */
export async function deleteUser(username) {
    const user = await models.users.findByPk(username);
    await user.destroy();
}

// GROUP
/**
 * Create a group with the given properties
 * @param {Object} group Can have zero or more of these fields: name, image.
 * Missing fields will be given sane default values
 * @returns A unique string ID for the new group
 */
export async function createGroup(group) {
    const newGroup = await models.groups.create(group);
    return newGroup.groupId;
}

/**
 * Update a group
 * @param {string} groupId 
 * @param {Object} groupPatch An object containing the values to change
 * Has one or more of these fields: name, image
 * Missing fields will be unchanged
 */
export async function updateGroup(groupId, groupPatch) {
    const group = await models.groups.findByPk(groupId);
    await group.update(groupPatch);
}

/**
 * Get info about a group
 * @param {string} groupId 
 * @returns a Group object
 */
export async function getGroup(groupId) {
    const group = await models.groups.findByPk(groupId);
    return group.dataValues;
}

/**
 * Batch retrieve info about multiple groups
 * @param {Array[string]} groupIds A list of string group IDs
 * @returns an array of Group objects
 */
export async function getGroups(groupIds) {
    const groups = await models.groups.findAll({ where: { groupId: { [Op.in]: groupIds } } });
    return groups.map(group => group.dataValues);
}

/**
 * Get the username of every member of this group
 * @param {string} groupId 
 * @returns an array of usernames
 */
export async function getGroupMemberUsernames(groupId) {
    const users = await models.users.findAll({
        include: [{model: models.groups, as: "groupId_groups", where: {groupId: groupId}}]
    });
    return users.map(user => user.username);
}

/**
 * Get all events planned by this group
 * @param {string} groupId 
 * @returns an array of planned event IDs
 */
export async function getGroupPlannedEventIds(groupId) {
    const plannedEvents = await models.plannedEvents.findAll({
        where: {groupId: groupId}
    });
    return plannedEvents.map(event => event.plannedEventId);
}

/**
 * Delete a group
 * @param {string} groupId 
 */
export async function deleteGroup(groupId) {
    const group = await models.groups.findByPk(groupId);
    await group.destroy();
}

// BUSY EVENTS
/**
 * Create a new busy event with the given properties
 * @param {Object} busyEvent MUST have a creatorUsername field
 * May have zero or more of these fields: title, startDay, startHour,
 * startMinute, endDay, endHour, endMinute
 * Missing fields will be given sane default values
 * @returns A unique string ID for the new event
 */
export async function createBusyEvent(busyEvent) {
    await models.busyEvents.create(busyEvent);
}

/**
 * Update a busy event
 * @param {string} busyEventId 
 * @param {Object} busyEventPatch An object containing the values to change
 * Has one or more of these fields: title, startDay, startHour, startMinute,
 * endDay, endHour, endMinute
 * Missing fields will be unchanged
 */
export async function updateBusyEvent(busyEventId, busyEventPatch) {
    const busyEvent = await models.busyEvents.findByPk(busyEventId);
    await busyEvent.update(busyEventPatch);
}

/**
 * Get info about a busy event
 * @param {string} busyEventId
 * @returns a busyEvent object
 */
export async function getBusyEvent(busyEventId) {
    const busyEvent = await models.busyEvents.findByPk(busyEventId);
    return busyEvent.dataValues;
}

/**
 * Batch retrieve info about multiple busy events
 * @param {Array[string]} busyEventIds A list of busy event IDs
 * @returns a list of busyEvent objects
 */
export async function getBusyEvents(busyEventIds) {
    const busyEvents = await models.busyEvents.findAll({
        where: {busyEventId: {[Op.in]: busyEventIds}}
    });
    return busyEvents.map(busyEvent => busyEvent.dataValues);
}

/**
 * Delete a busy event
 * @param {string} busyEventId 
 */
export async function deleteBusyEvent(busyEventId) {}

// PLANNED EVENTS
/**
 * Create a new planned event
 * @param {Object} plannedEvent MUST have a field called creatorUsername
 * Can have zero or more of these fields: title, startDay, startHour, startMinute,
 * endDay, endHour, endMinute, location, description
 * Missing fields will be given sane default values
 * @returns A unique string ID for the new event
 */
export async function createPlannedEvent(plannedEvent) {}

/**
 * Update a planned event
 * @param {string} plannedEventId 
 * @param {Object} plannedEventPatch An object containing the values to change
 * Has one or more of these fields: title, startDay, startHour, startMinute,
 * endDay, endHour, endMinute, location, description
 * Missing fields will be unchanged
 */
export async function updatePlannedEvent(plannedEventId, plannedEventPatch) {}

/**
 * Get info about a planned event
 * @param {string} plannedEventId 
 * @returns a plannedEvent object
 */
export async function getPlannedEvent(plannedEventId) {}

/**
 * Batch retrieve info about multiple planned events
 * @param {Array[string]} plannedEventIds 
 * @returns a list of plannedEvent objects
 */
export async function getPlannedEvents(plannedEventIds) {}

/**
 * Delete a planned event
 * @param {string} plannedEventId 
 */
export async function deletePlannedEvent(plannedEventId) {}

// PLANNED EVENT RSVPS
/**
 * Record a user RSVPing to a planned event
 * @param {string} plannedEventId 
 * @param {string} username 
 * @param {string} response one of "YES", "NO", "MAYBE"
 */
export async function addRsvp(plannedEventId, username, response) {}

/**
 * Remove a user's RSVP to a planned event
 * @param {string} plannedEventId 
 * @param {string} username 
 */
export async function deleteRsvp(plannedEventId, username) {}

/**
 * Get the username of everyone who RSVPed 'yes' to this event
 * @param {string} plannedEventId 
 */
export async function getYesRsvpsTo(plannedEventId) {}

/**
 * Get the username of everyone who RSVPed 'no' to this event
 * @param {string} plannedEventId 
 */
export async function getNoRsvpsTo(plannedEventId) {}

/**
 * Get the username of everyone who RSVPed 'maybe' to this event
 * @param {string} plannedEventId 
 */
export async function getMaybeRsvpsTo(plannedEventId) {}

// FRIENDS
/**
 * Make these two users friends
 * @param {string} username1 
 * @param {string} username2 
 */
export async function addFriend(username1, username2) {}

/**
 * Check if these users are friends
 * @param {string} username1 
 * @param {string} username2 
 * @returns boolean true or false
 */
export async function areFriends(username1, username2) {}

/**
 * Make these two users no longer friends
 * @param {string} username1 
 * @param {string} username2 
 */
export async function deleteFriend(username1, username2) {}

/**
 * Get the all friends of this user
 * @param {string} username 
 * @returns an array of string usernames
 */
export async function getFriendsOf(username) {}

// FRIEND REQUESTS
/**
 * Add a friend request from one user to another
 * @param {string} fromUsername 
 * @param {string} toUsername 
 */
export async function addFriendRequest(fromUsername, toUsername) {}

/**
 * Delete a friend request from one user to another
 * @param {string} fromUsername 
 * @param {string} toUsername 
 */
export async function deleteFriendRequest(fromUsername, toUsername) {}

/**
 * Get everyone who's sent a friend request to this user
 * @param {string} username 
 * @returns an array of string usernames
 */
export async function getRequestsTo(username) {}

/**
 * Get everyone to whom this user has sent a friend request
 * @param {string} username 
 * @returns an array of string usernames
 */
export async function getRequestsFrom(username) {}