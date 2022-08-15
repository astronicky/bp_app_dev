/*
 * Created by Justice on Sun Feb 21 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    loadMessageThreads, loadThreadMessages, sendThreadMessage, 
    markThreadAsRead, deleteMessageThread 
} from 'app/api/index';

import { actLoadUserMessages } from 'app/features/auth/root/actions/index';

/**
 * Action to load message threads
 * @param {Number} offset 
 */
export function actLoadMessageThreads(offset = 0) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingMessageThreads(true));

        if (offset == 0) {
            dispatch(actResetMessageThreads());

            // restore user token
            const token = await AsyncStorage.getItem('userToken');
            dispatch(actSetUserToken(token));
        }

        // call the actual endpoint
        const response = await loadMessageThreads();

        // hide loading indicator
        dispatch(actIsLoadingMessageThreads(false));

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // act on the response
        if (response && response.threads != undefined) {
            dispatch(actSuccessMessageThreads(response.threads, response.total, response.unread, _userId));
        } else {
            dispatch(actIsFailedMessageThreads('Failed loading list of message threads'));
        }
    }
}

function actIsLoadingMessageThreads(isLoading) {
    return { type: 'DM_THREADS_IS_LOADING', payload: { isLoading } };
}

function actSetUserToken(token) {
    return { type: 'MESSAGING_SET_TOKEN', payload: { token } };
}

function actSuccessMessageThreads(threads, total, unread, userId) {
    return { type: 'DM_THREADS_SET_DATA', payload: { threads, total, unread, userId } };
}

function actResetMessageThreads() {
    return { type: 'DM_THREADS_RESET_DATA', payload: { } };
}

function actIsFailedMessageThreads(error) {
    return { type: 'DM_THREADS_FAILED', payload: { error } };
}

/**
 * Action to mark messages in a thread as read
 * @param {Number} threadId 
 */
export function actMarkMessageThreadAsRead(threadId) {

    return async (dispatch) => {

        // call the actual endpoint
        const response = await markThreadAsRead(threadId);

        // decrement the unread count
        if (response.message == true) {
            dispatch(actLoadMessageThreads(0))
        }
    }
}

/**
 * Action to load thread messages
 * @param {Number} threadId 
 * @param {Number} offset 
 * @param {Number} limit 
 */
export function actLoadThreadMessages(threadId, offset = 0, limit = 25) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingThreadMessages(true));

        if (offset == 0) {
            dispatch(actResetThreadMessages(threadId));
        }

        // call the actual endpoint
        const response = await loadThreadMessages(threadId, offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingThreadMessages(false));

        // act on the response
        if (response.messages) {
            dispatch(actSuccessThreadMessages(threadId, response.messages, offset, response.total ?? 0));
        } else {
            dispatch(actIsFailedThreadMessages('Failed loading list of thread messages'));
        }

        // reload messages to update badge
        dispatch(actLoadUserMessages());
    }
}

function actIsLoadingThreadMessages(isLoading) {
    return { type: 'DM_MESSAGES_IS_LOADING', payload: { isLoading } };
}

function actSuccessThreadMessages(threadId, messages, offset, total) {
    return { type: 'DM_MESSAGES_SET_DATA', payload: { threadId, messages, offset, total } };
}

function actResetThreadMessages(threadId) {
    return { type: 'DM_MESSAGES_RESET_DATA', payload: { threadId } };
}

function actIsFailedThreadMessages(error) {
    return { type: 'DM_MESSAGES_FAILED', payload: { error } };
}

/**
 * Action to send message into a thread
 * @param {String} threadId
 * @param {[String]} recipientIds - ids of the recipients in the selected thread
 * @param {String} message 
 * @param {String} pageLocation - page location
 */
export function actSendThreadMessage(threadId, recipientIds, message, pageLocation) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingSendMessage(true));

        // call the actual endpoint
        const response = await sendThreadMessage(threadId, message);

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
        const recipeientId = threadId.split('-')[0] ?? ''

        // call analytics event
        if (response.message != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.DM_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    thread_id: threadId,
                    // Can't send in native array object
                    recipients: "[" + recipientIds.join(", ") + "]"
                }
            )
        }
    }
}

export function actSuccessSendMessage(threadId, message) {
    return { type: 'DM_SENDMSG_SET_DATA', payload: { threadId, msg: message } };
}

function actIsLoadingSendMessage(isLoading) {
    return { type: 'DM_SENDMSG_IS_LOADING', payload: { isLoading } };
}

function actIsFailedSendMessage(error) {
    return { type: 'DM_SENDMSG_FAILED', payload: { error } };
}

/**
 * Action to delete a message thread
 * @param {Number} threadId 
 */
export function actDeleteMessageThread(threadId) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingDeleteThread(true));

        // call the actual endpoint
        const response = await deleteMessageThread(threadId);

        // hide loading indicator
        dispatch(actIsLoadingSendMessage(false));

        // decrement the unread count
        if (response.message == true) {
            dispatch(actSuccessDeleteThread())
            setTimeout(() => {
                dispatch(actFailedDeleteThread())
                dispatch(actDeleteThreadCancel())
            }, 500)
            dispatch(actLoadMessageThreads(0))
        } 
    }
}

function actIsLoadingDeleteThread(isLoading) {
    return { type: 'DM_THREADS_DELETE_IS_LOADING', payload: { isLoading } };
}

function actSuccessDeleteThread() {
    return { type: 'DM_THREADS_DELETE_SUCCESS', payload: { } };
}

function actFailedDeleteThread(error) {
    return { type: 'DM_THREADS_DELETE_FAILED', payload: { error } };
}

export function actDeleteThreadCancel() {
    return { type: 'DM_THREADS_DELETE_CANCEL', payload: { } };
}