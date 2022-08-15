/*
 * Created by Justice on Fri Jan 8 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import ApiRequest from './../manager';

import { Constants } from './../manager/constant';

/**
 * Load a list of notifications
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function loadNotifications(offset = 0, limit = 25) {
    const params = `?offset=${offset}&limit=${limit}`;
    return await ApiRequest(Constants.NOTIFICATION_GET_ITEMS + params, 'GET');
}

/**
 * Mark a notification as read
 * @param {String} notificationId
 */
export async function readNotification(notificationId) {
    const payload = { nid: notificationId };
    return await ApiRequest(Constants.NOTIFICATION_READ_ITEM, 'POST', payload);
}

/**
 * Mark all notifications as read
 */
 export async function readAllNotifications() {
    const payload = {};
    return await ApiRequest(Constants.NOTIFICATION_READ_ITEM, 'POST', payload);
}

/**
 * Delete a notification 
 * @param {String} notificationId
 */
export async function deleteNotification(notificationId) {
    const payload = { nid: notificationId };
    return await ApiRequest(Constants.NOTIFICATION_DELETE_ITEM, 'POST', payload);
}