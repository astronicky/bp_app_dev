/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { browserDefaults } from './defaults';

export default function login(state = browserDefaults, action) {
    switch (action.type) {
        case 'LOGIN_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoading, success: undefined, error: undefined }
        }
        case 'LOGIN_SUCCESS': {
            const { user } = action.payload;
            const isVerified = user.show_verified_badge ?? false;
            const isDeactivated = user.account_status == 'Deactivated';
            return { ...state, isLoading: false, success: true, isVerified, isDeactivated, error: undefined }
        }
        case 'LOGIN_FAILED': {
            const error = action.payload.error || 'Failed Logging in';
            return { ...state, isLoading: false, success: false, error }
        }
        case 'LOGIN_RESET': {
            return { ...state, isLoading: undefined, success: undefined, error: undefined }
        }
        default: {
            return state;
        }
    }
}