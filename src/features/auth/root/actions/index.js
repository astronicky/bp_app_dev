/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import { actSetUser } from 'app/features/user/profile/actions/index';
import { 
    loadNotifications, loadCurrentUser, activateAccount,
    logoutAccount, setUserIsOnline, loadMessageThreads
} from 'app/api';

export function actRootHasUser(isDeactivated) {
    return { type: 'ROOT_HAS_USER', payload: { isDeactivated } };
}

export function actRootHasNoUser() {
    return { type: 'ROOT_NO_USER' };
}

export function actRootSetUnreadNotifCount(count) {
    return { type: 'ROOT_SET_UNREAD_NOTIF_COUNT', payload: { count } };
}

export function actRootSetUnreadMsgCount(count) {
    return { type: 'ROOT_SET_UNREAD_MSG_COUNT', payload: { count } };
}

export function actSuccessLogout() {
    return { type: 'ROOT_SUCCESS_LOGOUT' };
}

export function actResetStore() {
    return { type: 'RESET_STORE' };
}

export function actRootExitApp() {
    return { type: 'ROOT_EXIT_APP' };
}

/**
 * Action that determines the next root view
 */
export function actSetRootView() {

    return async (dispatch) => {
        const currUserId = await AsyncStorage.getItem('userToken');

        if (currUserId == undefined) {
            dispatch(actRootHasNoUser());
        } else {
            // get current user and store to state
            const userInfo = await loadCurrentUser();
            const message = userInfo.message ?? '';

            if (userInfo.user) {
                const isDeactivated = userInfo.user.account_status == 'Deactivated'
                if (isDeactivated) {
                    dispatch(actRootHasUser(true));
                } else {
                    dispatch(actRootHasUser(false));
                    dispatch(actLoadUserNofications());
                    dispatch(actLoadUserMessages());
                    dispatch(actSetUser(userInfo.user))
                }
            } else if (message.includes("Unauthenticated request")) {
                dispatch(actLogoutUser());
            } 
        }
    }
}

/**
 * Action to logout current user 
 */
export function actLogoutUser() {
    return async (dispatch) => {
        // STEP 1: clear session 
        await logoutAccount();

        // STEP 2: clear all values from redux store
        dispatch(actResetStore());

        // STEP 3: Notify
        dispatch(actSuccessLogout());
    }
}

/**
 * Action to load user if is online
 */
export function actSetUserIsOnline() {
    return async (dispatch) => {
        
        // call the actual endpoint
        const response = await setUserIsOnline();
    }
}

/**
 * Action to pre-load user notifications
 */
export function actLoadUserNofications() {
    return async (dispatch) => {
        
        // call the actual endpoint
        const response = await loadNotifications();

        if (response.unread) {
            dispatch(actRootSetUnreadNotifCount(response.unread));
        }
    }
}

/**
 * Action to pre-load user messages
 */
 export function actLoadUserMessages() {
    return async (dispatch) => {
        
        // call the actual endpoint
        const response = await loadMessageThreads();

        if (response.unread != undefined) {
            dispatch(actRootSetUnreadMsgCount(response.unread));
        }
    }
}

/**
 * Action to activate the account
 */
 export function actActivateAccount() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingActivateAccount(true));

        // call the actual endpoint
        const response = await activateAccount();

        // hide loading indicator
        dispatch(actIsLoadingActivateAccount(false));
        
        // act on the response
        if (response.message == true) {
            dispatch(actSuccessActivateAccount());
        } else {
            dispatch(actIsFailedActivateAccount('Failed activating the account'));
        }
    }
}

// Deactivate Account Reducers
function actIsLoadingActivateAccount(isLoading) {
    return { type: 'ROOT_ACTIVATE_IS_LOADING', payload: { isLoading } };
}

function actSuccessActivateAccount() {
    return { type: 'ROOT_ACTIVATE_SUCCESS', payload: { } };
}
 
function actIsFailedActivateAccount(error) {
    return { type: 'ROOT_ACTIVATE_FAILED', payload: { error } };
}