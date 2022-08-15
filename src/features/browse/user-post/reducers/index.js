/*
 * Created by Justice on Mon Jun 21 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import _ from 'lodash';

export default function search(state = {}, action) {
    switch (action.type) {
        case 'USER_LIST_IS_LOADING': {
            const isLoading = action.payload.isLoading || false

            if (isLoading == true) {
                return {
                    ...state, isLoadingUsers: true, users: []
                }
            }

            return {
                ...state, isLoadingUsers: isLoading
            }
        }
        case 'USER_LIST_SET_DATA': {
            const { total, data } = action.payload
            return {
                ...state, totalUsers: total, 
                users: [...state.users || [], ...data]
            };
        }
        case 'USER_LIST_RESET_DATA': {
            return {
                ...state, totalUsers: 0, users: [], isLoadingUsers: undefined
            };
        }
        case 'USER_LIST_FAILED': {
            const { error } = action.payload
            return {
                ...state, errorUsers: error
            };
        }
        case 'POST_LIST_IS_LOADING': {
            const isLoading = action.payload.isLoading || false

            if (isLoading == true) {
                return {
                    ...state, isLoadingPosts: true, posts: []
                }
            }
            
            return {
                ...state, isLoadingPosts: isLoading
            }
        }
        case 'POST_LIST_SET_DATA': {
            const { total, data } = action.payload
            return {
                ...state, totalPosts: total, 
                posts: [...state.posts || [], ...data]
            };
        }
        case 'POST_LIST_RESET_DATA': {
            return {
                ...state, totalPosts: 0, posts: [], isLoadingPosts: undefined
            };
        }
        case 'POST_LIST_FAILED': {
            const { error } = action.payload
            return {
                ...state, errorPosts: error
            };
        }
        default: {
            return state
        }
    }
}