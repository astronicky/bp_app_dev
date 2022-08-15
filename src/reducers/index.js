/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { combineReducers } from 'redux';

import root from 'app/features/auth/root/reducers/index'
import login from 'app/features/auth/login/reducers/index'
import feed from 'app/features/post/feed/reducers/index'
import profile from 'app/features/user/profile/reducers/index'
import audience from 'app/features/user/audience/reducers/index'
import account from 'app/features/user/account/reducers/index'
import register from 'app/features/auth/register/reducers/index'
import browse from 'app/features/browse/list/reducers/index'
import notifications from 'app/features/user/notifications/reducers/index'
import chatRoom from 'app/features/chat/list/reducers/index'
import messaging from 'app/features/message/list/reducers/index'
import search from 'app/features/browse/user-post/reducers/index'

import { browserDefaults } from 'app/features/auth/login/reducers/defaults'

// Add more reducers here
const reducers = combineReducers({
    root, login, feed, profile, audience, account, register, browse, notifications, chatRoom, messaging, search
});

// Remove all states
export default rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') {
        const oldRoot = state.root || {}
        const oldStateWithBrowserProps = browserDefaults
        state = { 
            root: oldRoot, 
            login: oldStateWithBrowserProps, 
            feed: oldStateWithBrowserProps
        }
    }

    return reducers(state, action)
}