/*
 * Created by Justice on Wed Feb 20 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import ApiRequest from './../manager';

import { Constants } from './../manager/constant';

/**
 * Load list of all message threads
 */
export async function loadMessageThreads() {
    return await ApiRequest(Constants.DM_GET_THREADS, 'GET');
}

/**
 * Load list of messages of a thread
 * @param {Number} threadId 
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function loadThreadMessages(threadId, offset = 0, limit = 25) {
    let params = `?offset=${offset}&limit=${limit}&tid=${threadId}`;
    return await ApiRequest(Constants.DM_GET_MESSAGES + params, 'GET');
}

/**
 * Send a message to a thread
 * @param {Number} threadId 
 * @param {String} message 
 */
export async function sendThreadMessage(threadId, message) {
    const path = `${Constants.DM_SEND_MESSAGE}`
    const payload = { tid: threadId, message };
    return await ApiRequest(path, 'POST', payload);
}

/**
 * Delete a message thread
 * @param {Number} threadId 
 */
export async function deleteMessageThread(threadId) {
    const path = `${Constants.DM_DELETE_THREAD}`
    const payload = { tid: threadId };
    return await ApiRequest(path, 'POST', payload);
}

/**
 * Mark a message as read
 * @param {Number} threadId 
 */
export async function markThreadAsRead(threadId) {
    const path = `${Constants.DM_READ_MESSAGES}`
    const payload = { tid: threadId };
    return await ApiRequest(path, 'POST', payload);
}