/*
 * Created by Justice on Fri Jan 8 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import { readNotification, deleteNotification, loadNotifications, readAllNotifications } from 'app/api/index';
import { actLoadUserNofications } from 'app/features/auth/root/actions/index';

/**
 * Action to load the user's notifications
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
export function actLoadNotifications(offset = 0, limit = 25) {

    return async (dispatch) => {

        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingNotificationList(true));
            // clear previous contents
            dispatch(actResetNotificationList());
        }

        // call the actual endpoint
        const response = await loadNotifications(offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingNotificationList(false));

        // act on the response
        if (response.notifications && response.total) {
            dispatch(actStoreNotificationList(response.notifications, response.total));
        } else {
            dispatch(actIsFailedNotificationList('Failed loading list of notifications'));
        }
    }
}

// Notifications List Reducers
function actIsLoadingNotificationList(isLoading) {
    return { type: 'NOTIFICATIONS_IS_LOADING', payload: { isLoading } };
}

function actResetNotificationList() {
    return { type: 'NOTIFICATIONS_RESET', payload: { } };
}

function actStoreNotificationList(notifications, total) {
    return { type: 'NOTIFICATIONS_SET_DATA', payload: { notifications, total } };
}

function actIsFailedNotificationList(error) {
    return { type: 'NOTIFICATIONS_FAILED', payload: { error } };
}

/**
 * Action to mark a notification as read
 * @param {Number} notifId 
 */
export function actReadNotification(notifId) {

    return async (dispatch) => {

        // call the actual endpoint
        const response = await readNotification(notifId);

        if (response.message == true) {
            dispatch(actUpdateNotificationStatus(notifId));
        }

        // reload notifications to update badge
        dispatch(actLoadUserNofications());
    }
}

/**
 * Action to mark all notifications as read
 */
 export function actReadAllNotifications() {

    return async (dispatch) => {

        console.log('mark notif');

        // call the actual endpoint
        await readAllNotifications();

        // reload notifications to update badge
        dispatch(actLoadUserNofications());

        // read all notifications
        dispatch(actUpdateReadAllNotifications());
    }
}

function actUpdateNotificationStatus(notifId) {
    return { type: 'NOTIFICATIONS_UPDATE_STATUS', payload: { notifId } };
}

function actUpdateReadAllNotifications() {
    return { type: 'NOTIFICATIONS_READ_ALL', payload: { } };
}

export function actShowNotificationMenu(notifId) {
    return { type: 'NOTIFICATIONS_TOGGLE_MENU', payload: { notifId } };
}

/**
 * Action to mark a notification as deleted
 * @param {Number} notifId 
 */
 export function actDeletedNotification(notifId) {

    return async (dispatch) => {

        // call the actual endpoint
        const response = await deleteNotification(notifId);

        if (response.message == true) {
            dispatch(actDeleteNotification(notifId));
        }
    }
}

function actDeleteNotification(notifId) {
    return { type: 'NOTIFICATIONS_DELETE_ITEM', payload: { notifId } };
}