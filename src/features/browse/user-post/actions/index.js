/*
 * Created by Justice on Mon Jun 21 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    searchUser, searchUserIndexed, searchPost
} from 'app/api/index';

/**
 * Action to search users
 * @param {String} query - search query
 * @param {String} pageLocation - page location
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
 export function actSearchUser(query, pageLocation, offset = 0, limit = 25) {

    return async (dispatch) => {
        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingSearchUsers(true));
        }

        // clear previous contents
        if (offset == 0) {
            dispatch(actResetSearchUsers());
        }

        // call the actual endpoint
        const response = await searchUserIndexed(query);

        // hide loading indicator
        dispatch(actIsLoadingSearchUsers(false));

        // act on the response
        if (response.results && response.results[0] != undefined) {
            const total = response.results[0].nbHits;
            const data = response.results[0].hits ?? [];
            dispatch(actStoreSearchUserResults(data, total));
        } else {
            dispatch(actIsFailedSearchUsers('Failed loading list of users'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.data != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.SEARTH_START, {
                    user_id: _userId, 
                    page_title: pageLocation
                }
            )
        }
    }
}

/**
 * Action to report analytics event for selected user
 * @param {String} query - search query
 * @param {String} ownerId - selected user id 
 * @param {String} pageLocation 
 */
 export function actReportSelectedUser(query, ownerId, pageLocation) {
    return async (dispatch) => {
        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id
    
        await analytics().logEvent(
            AnalyticsEvents.SEARCH_RESULT_CLICK, {
                user_id: _userId, 
                page_title: pageLocation,
                search_term: query,
                target_id: ownerId
            }
        )
    }
}

// Search User Reducers
export function actIsLoadingSearchUsers(isLoading) {
    return { type: 'USER_LIST_IS_LOADING', payload: { isLoading } };
}

export function actResetSearchUsers() {
    return { type: 'USER_LIST_RESET_DATA', payload: { } };
}

function actStoreSearchUserResults(usersList, total) {
    return { type: 'USER_LIST_SET_DATA', payload: { data: usersList, total } };
}

function actIsFailedSearchUsers(error) {
    return { type: 'USER_LIST_FAILED', payload: { error } };
}

/**
 * Action to search posts
 * @param {String} query - search query
 * @param {String} pageLocation - page location
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
 export function actSearchPost(query, pageLocation, offset = 0, limit = 25) {

    return async (dispatch) => {
        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingSearchPosts(true));
        }

        // clear previous contents
        if (offset == 0) {
            dispatch(actResetSearchPosts());
        }

        // call the actual endpoint
        const response = await searchPost(query);

        // hide loading indicator
        dispatch(actIsLoadingSearchPosts(false));

        // act on the response
        if (response.data && response.total) {
            dispatch(actStoreSearchPostsResults(response.data, response.total));
        } else {
            dispatch(actIsFailedSearchPosts('Failed loading list of users'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.data != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.SEARTH_START, {
                    user_id: _userId, 
                    page_title: pageLocation
                }
            )
        }
    }
}

/**
 * Action to report analytics event
 * @param {String} query - search query
 * @param {String} postId 
 * @param {String} ownerId 
 * @param {String} pageLocation - page location
 */
export function actReportSelectedPost(query, postId, ownerId, pageLocation) {
    return async (dispatch) => {
        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id
    
        await analytics().logEvent(
            AnalyticsEvents.SEARCH_RESULT_CLICK, {
                user_id: _userId, 
                page_title: pageLocation,
                search_term: query,
                target_id: ownerId,
                post_id: postId
            }
        )
    }
}

// Search Posts Reducers
export function actIsLoadingSearchPosts(isLoading) {
    return { type: 'POST_LIST_IS_LOADING', payload: { isLoading } };
}

export function actResetSearchPosts() {
    return { type: 'POST_LIST_RESET_DATA', payload: { } };
}

function actStoreSearchPostsResults(usersList, total) {
    return { type: 'POST_LIST_SET_DATA', payload: { data: usersList, total } };
}

function actIsFailedSearchPosts(error) {
    return { type: 'POST_LIST_FAILED', payload: { error } };
}