/*
 * Created by Justice on Mon Feb 01 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    loadChatRooms, loadChatMessages, sendChatMessage, 
    joinChatRoom, leaveChatRoom, loadChatRoomInfo
} from 'app/api/index';

/**
 * Action to load chat rooms
 * @param {Number} offset 
 */
export function actLoadChatRooms(offset = 0) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingChatRooms(true));

        if (offset == 0) {
            dispatch(actResetChatRooms());

            // restore user token
            const token = await AsyncStorage.getItem('userToken');
            dispatch(actSetUserToken(token));
        }

        // call the actual endpoint
        const response = await loadChatRooms();

        // hide loading indicator
        dispatch(actIsLoadingChatRooms(false));

        // act on the response
        if (response && response[0] != undefined) {
            dispatch(actSuccessChatRooms(response));
        } else {
            dispatch(actIsFailedChatRooms('Failed loading list of chat rooms'));
        }
    }
}

/**
 * Display an update to the room 
 * @param {String} roomId 
 */
export function actLoadRoomUpdate(roomId) {
    return async (dispatch) => {
        dispatch(actHasRoomUpdate(roomId, true));
        setTimeout(() => {
            dispatch(actHasRoomUpdate(roomId, false));
        }, 500)
    }
}

function actHasRoomUpdate(roomId, withChanges) {
    return { type: 'CHAT_ROOMS_HAS_UPDATES', payload: { roomId, withChanges } };
}

function actIsLoadingChatRooms(isLoading) {
    return { type: 'CHAT_ROOMS_IS_LOADING', payload: { isLoading } };
}

function actSetUserToken(token) {
    return { type: 'CHAT_ROOMS_SET_TOKEN', payload: { token } };
}

function actSuccessChatRooms(rooms) {
    return { type: 'CHAT_ROOMS_SET_DATA', payload: { rooms } };
}

function actResetChatRooms() {
    return { type: 'CHAT_ROOMS_RESET_DATA', payload: { } };
}

function actIsFailedChatRooms(error) {
    return { type: 'CHAT_ROOMS_FAILED', payload: { error } };
}

/**
 * Action to load chat messages
 * @param {Number} roomId 
 * @param {Number} offset 
 * @param {Number} limit 
 */
export function actLoadChatMessages(roomId, offset = 0, limit = 25) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingChatMessages(true));

        if (offset == 0) {
            dispatch(actResetChatMessages(roomId));
        }

        // call the actual endpoint
        const response = await loadChatMessages(roomId, offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingChatMessages(false));

        // act on the response
        if (response.messages) {
            dispatch(actSuccessChatMessages(roomId, offset, response.messages, response.total ?? 0));
        } else {
            dispatch(actIsFailedChatMessages('Failed loading list of chat messages'));
        }
    }
}

function actIsLoadingChatMessages(isLoading) {
    return { type: 'CHAT_MESSAGES_IS_LOADING', payload: { isLoading } };
}

function actSuccessChatMessages(roomId, offset, messages, total) {
    return { type: 'CHAT_MESSAGES_SET_DATA', payload: { roomId, offset, messages, total } };
}

function actResetChatMessages(roomId) {
    return { type: 'CHAT_MESSAGES_RESET_DATA', payload: { roomId } };
}

function actIsFailedChatMessages(error) {
    return { type: 'CHAT_MESSAGES_FAILED', payload: { error } };
}

/**
 * Action to send chat message
 * @param {Number} roomId
 * @param {String} message 
 * @param {String} pageLocation - page location
 */
export function actSendChatMessage(roomId, message, pageLocation) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingSendMessage(true));

        // call the actual endpoint
        const response = await sendChatMessage(roomId, message);

        // hide loading indicator
        dispatch(actIsLoadingSendMessage(false));

        // act on the response
        if (response.message) {
           // dispatch(actSuccessSendMessage(roomId, response.message));
        } else {
            dispatch(actIsFailedSendMessage('Failed sending the message'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.CHAT_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    room_id: roomId
                }
            )
        }
    }
}

export function actSuccessSendMessage(roomId, message) {
    return { type: 'CHAT_SENDMSG_SET_DATA', payload: { roomId, msg: message } };
}

function actIsLoadingSendMessage(isLoading) {
    return { type: 'CHAT_SENDMSG_IS_LOADING', payload: { isLoading } };
}

function actIsFailedSendMessage(error) {
    return { type: 'CHAT_SENDMSG_FAILED', payload: { error } };
}

export function actMuteUserMessages(roomId, userId) {
    return { type: 'CHAT_MESSAGES_MUTE_USER', payload: { roomId, userId } };
}

export function actUnmuteUserMessages(roomId, userId) {
    return { type: 'CHAT_MESSAGES_UNMUTE_USER', payload: { roomId, userId } };
}

/**
 * Action to leave a chat room
 * @param {Number} roomId 
 */
export function actLeaveChatRoom(roomId) {

    return async (dispatch) => {

        // call the actual endpoint
        await leaveChatRoom(roomId);
    }
}

/**
 * Action to join a chat room
 * @param {Number} roomId 
 */
 export function actJoinChatRoom(roomId) {

    return async (dispatch) => {

        // call the actual endpoint
        await joinChatRoom(roomId);
    }
}

/**
 * Action to load a chat room info
 * @param {Number} roomId 
 */
 export function actLoadChatRoomInfo(roomId) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingChatRoomInfo(roomId, true));

        // call the actual endpoint
        const response = await loadChatRoomInfo(roomId);

        // hide loading indicator
        dispatch(actIsLoadingChatRoomInfo(roomId, false));

        // act on the response
        if (response.id && response.type == 'ama') {
            dispatch(actSuccessChatRoomInfo(roomId, response));
        } 
    }
}

function actSuccessChatRoomInfo(roomId, info) {
    return { type: 'CHAT_MESSAGES_SET_INFO', payload: { roomId, info } };
}

function actIsLoadingChatRoomInfo(roomId, isLoading) {
    return { type: 'CHAT_MESSAGES_IS_LOADING_INFO', payload: { roomId, isLoading } };
}