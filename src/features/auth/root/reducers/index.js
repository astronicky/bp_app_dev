/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

export default function root(state = {}, action) {
    switch (action.type) {
        case 'ROOT_NO_USER': {
            return { hasNoUser: true };
        }
        case 'ROOT_HAS_USER': {
            const { isDeactivated } = action.payload
            return { hasNoUser: false, isDeactivated };
        }
        case 'ROOT_SUCCESS_LOGOUT': {
            return { successLogout: true };
        }
        case 'ROOT_EXIT_APP': {
            // just to make sure it changes everytime
            return { hasExitedApp: new Date() }; 
        }
        case 'ROOT_SET_UNREAD_NOTIF_COUNT': {
            const { count } = action.payload

            let countDesc
            if (count) {
                if (count > 20) {
                    countDesc = "20+"
                }
            }

            return {
                ...state, unreadNotifCount: countDesc ?? count
            }
        }
        case 'ROOT_SET_UNREAD_MSG_COUNT': {
            const { count } = action.payload

            let countDesc
            if (count) {
                if (count > 20) {
                    countDesc = "20+"
                }
            }

            return {
                ...state, unreadMsgCount: countDesc ?? count
            }
        }
        case 'ROOT_ACTIVATE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                activateAccountIsLoading: isLoading
            };
        }
        case 'ROOT_ACTIVATE_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                activateAccountSuccess: true
            };
        }
        case 'ROOT_ACTIVATE_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                activateAccountSuccess: false,
                activateAccountError: error
            };
        }
        case 'ROOT_SET_CURRENT_SCREEN': {
            const { screenName } = action.payload
            return { ...state, currentPageLocation: screenName };
        }
        default: {
            return state;
        }
    }
}
