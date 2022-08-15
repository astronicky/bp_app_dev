/*
 * Created by Justice on Sun Nov 15 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    loadUserFollowers, loadUserFollowing, followUser, 
    unfollowUser 
} from 'app/api/index';

/**
 * Action to load the user's followers
 * @param {Number} offset - number of total items already received
 * @param {Number} userId - load user's followers by user id
 * @param {Number} limit - max number of items
 */
export function actLoadUserFollower(offset = 0, userId, limit = 25) {

    return async (dispatch) => {
        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingAudienceList(userId, true));
        }

        // clear previous contents
        if (offset == 0) {
            dispatch(actResetFollowerList(userId));
        }

        // call the actual endpoint
        const response = await loadUserFollowers(offset, limit, userId);

        // hide loading indicator
        dispatch(actIsLoadingAudienceList(userId, false));

        // act on the response
        if (response.users && response.total) {
            dispatch(actStoreDataFollowerList(userId, response.users, response.total));
        } else {
            dispatch(actIsFailedAudienceList('Failed loading list of followers'));
        }
    }
}

/**
 * Action to load the user's following
 * @param {Number} offset - number of total items already received
 * @param {Number} userId - load user's followers by user id
 * @param {Number} limit - max number of items
 */
export function actLoadUserFollowing(offset = 0, userId, limit = 25) {

    return async (dispatch) => {
        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingAudienceList(userId, true));
        }

        // clear previous contents
        if (offset == 0) {
            dispatch(actResetFollowingList(userId));
        }

        // call the actual endpoint
        const response = await loadUserFollowing(offset, limit, userId);

        // hide loading indicator
        dispatch(actIsLoadingAudienceList(userId, false));

        // act on the response
        if (response.users && response.total) {
            dispatch(actStoreDataFollowingList(userId, response.users, response.total));
        } else {
            dispatch(actIsFailedAudienceList('Failed loading list of followers'));
        }
    }
}

// Audience List Reducers
function actIsLoadingAudienceList(userId, isLoading) {
    return { type: 'AUDIENCE_LIST_IS_LOADING', payload: { userId, isLoading } };
}

function actResetFollowerList(userId) {
    return { type: 'AUDIENCE_LIST_RESET_FOLLOWERS_DATA', payload: { userId } };
}

function actResetFollowingList(userId) {
    return { type: 'AUDIENCE_LIST_RESET_FOLLOWING_DATA', payload: { userId } };
}

function actStoreDataFollowerList(userId, usersList, total) {
    return { type: 'AUDIENCE_LIST_SET_FOLLOWERS_DATA', payload: { userId, usersList, totalFollowers: total } };
}

function actStoreDataFollowingList(userId, usersList, total) {
    return { type: 'AUDIENCE_LIST_SET_FOLLOWING_DATA', payload: { userId, usersList, totalFollowing: total } };
}

function actIsFailedAudienceList(userId, error) {
    return { type: 'AUDIENCE_LIST_FAILED', payload: { userId, error } };
}

/**
 * Give a verdict to a user (follow/unfollow)
 * @param {Number} ownerId - who owns the followers/following data
 * @param {Number} userId - user id to give verdict
 * @param {String} verdict - user verdict 'follow' or 'unfollow'
 * @param {String} mode - either follower or following
 * @param {String} pageLocation - page location
 */
 export function actGiveUserVerdict(ownerId, userId, verdict = 'follow', mode = 'follower', pageLocation) {
    
    return async (dispatch) => {

        // show loading indicator or disable follow/unfollow button
        dispatch(actIsLoadingUserVerdict(true, ownerId, userId, mode));

        // call the actual endpoint
        const response = verdict == 'follow' 
            ? await followUser(userId)
            : await unfollowUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserVerdict(false, ownerId, userId, mode));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserVerdict(ownerId, userId, verdict, mode));
        } else {
            dispatch(actFailedUserVerdict('Failed giving a post verdict'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined) {
            const eventName = verdict == 'follow' 
                ? AnalyticsEvents.FOLLOW_SUBMITTED
                : AnalyticsEvents.UNFOLLOW_SUBMITTED
                
            await analytics().logEvent(
                eventName, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    target_id: userId
                }
            )
        }
    }
}

// Verdict Reducers 
function actIsLoadingUserVerdict(isLoading, ownerId, userId, mode) {
    return { type: 'AUDIENCE_LIST_VERDICT_IS_LOADING', payload: { isLoading, ownerId, userId, mode } };
}

function actSuccessUserVerdict(ownerId, userId, verdict, mode) {
    return { type: 'AUDIENCE_LIST_VERDICT_SUCCESS', payload: { ownerId, userId, verdict, mode } };
}
 
function actFailedUserVerdict(error) {
    return { type: 'AUDIENCE_LIST_VERDICT_FAILED', payload: { error } };
} 
