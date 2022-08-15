/*
 * Created by Justice on Tue Jan 26 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import ApiRequest from './../manager';

import { Constants } from './../manager/constant';

/**
 * Load list of all chat rooms
 */
export async function loadChatRooms() {
    return await ApiRequest(Constants.CHAT_GET_ROOMS, 'GET');
}

/**
 * Load list of chat messages of a chat room 
 * @param {Number} roomId 
 */
export async function loadChatMessages(roomId, offset = 0, limit = 25) {
    const path = `${Constants.CHAT_GET_MESSAGES}/${roomId}`;
    const params = `?offset=${offset}&limit=${limit}`;
    return await ApiRequest(path + params, 'GET');
}

/**
 * Send a message to a chat room
 * @param {Number} roomId 
 * @param {String} message 
 */
export async function sendChatMessage(roomId, message) {
    const path = `${Constants.CHAT_SEND_MESSAGE}/${roomId}`
    const payload = { message };
    return await ApiRequest(path, 'POST', payload);
}

/**
 * Load a chat room info
 * @param {Number} roomId 
 */
 export async function loadChatRoomInfo(roomId) {
    const path = `${Constants.CHAT_INFO_ROOM}/${roomId}`
    return await ApiRequest(path, 'GET');
}

/**
 * Join a chat room
 * @param {Number} roomId 
 */
 export async function joinChatRoom(roomId) {
    const path = `${Constants.CHAT_JOIN_ROOM}/${roomId}`
    return await ApiRequest(path, 'POST', {});
}

/**
 * Leave a chat room
 * @param {Number} roomId 
 */
export async function leaveChatRoom(roomId) {
    const path = `${Constants.CHAT_LEAVE_ROOM}/${roomId}`
    return await ApiRequest(path, 'POST', {});
}