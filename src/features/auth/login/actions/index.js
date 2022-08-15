/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { loginAccount } from 'app/api';
import { actSetUser, actSetUserToken } from 'app/features/user/profile/actions/index';
import { actLoadUserNofications, actLoadUserMessages } from 'app/features/auth/root/actions/index';

export function actIsLoadingLogin(isLoading) {
    return { type: 'LOGIN_ISLOADING', payload: { isLoading } };
}

export function actIsSuccessLogin(user) {
    return { type: 'LOGIN_SUCCESS', payload: { user } };
}

export function actIsFailedLoginReset() {
    return { type: 'LOGIN_RESET' };
}

export function actIsFailedLogin(error) {
    return { type: 'LOGIN_FAILED', payload: { error } };
}

/**
 * Action for Logging in an account
 * @param {String} username 
 * @param {String} password 
 */
export function actLogin(username, password) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingLogin(true));

        try {
            // make sure fields are valid
            if (username == undefined || password == undefined) {
                setTimeout(() => {
                    dispatch(actIsLoadingLogin(false));
                    dispatch(actIsFailedLogin('Invalid Credentials'));
                    setTimeout(() => {
                        dispatch(actIsFailedLoginReset());
                    }, 0.5)
                }, 50);
                return;
            }

            // call the actual endpoint
            const response = await loginAccount(username, password);

            // hide loading indicator
            dispatch(actIsLoadingLogin(false));

            // act on the response
            if (response.error || response.message) {
                const error = response.message || (response.error || {}).message;
                dispatch(actIsFailedLogin(error));
                setTimeout(() => {
                    dispatch(actIsFailedLoginReset());
                }, 0.5)
            } else if (response.user && response.token) {
                // show successful login and navigate to next comp
                dispatch(actIsSuccessLogin(response.user));
                // get current user and store to state
                dispatch(actSetUser(response.user));
                dispatch(actSetUserToken(response.token));
                dispatch(actLoadUserNofications());
                dispatch(actLoadUserMessages());
                // important: immediately clean login success for logout
                setTimeout(() => {
                    dispatch(actIsFailedLoginReset());
                }, 500)
            }
        } catch (error) {
            if (error) {
                dispatch(actIsFailedLogin(error));
                setTimeout(() => {
                    dispatch(actIsFailedLoginReset());
                }, 0.5)
            }
        }
    };
}
