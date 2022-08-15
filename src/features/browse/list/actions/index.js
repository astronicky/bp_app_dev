/*
 * Created by Justice on Tue Dec 01 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    loadAgeFilters, loadGenderFilters, filterUsers, 
    followUser, unfollowUser, blockUser, reportUser 
} from 'app/api/index';

export function actToggleSearching() {
    return { type: 'BROWSE_SEARCH_TOGGLE', payload: { } };
}

export function actToggleFilters() {
    return { type: 'BROWSE_FILTER_TOGGLE', payload: { } };
}

export function actSetLocation(lat, lng) {
    return { type: 'BROWSE_FILTER_LOCATION', payload: { lat, lng } };
}

export function actSetIsOnline() {
    return { type: 'BROWSE_FILTER_IS_ONLINE', payload: { } };
}

export function actSetIsNearby() {
    return { type: 'BROWSE_FILTER_IS_NEARBY', payload: { } };
}

export function actSetGenderFilter(genderId) {
    return { type: 'BROWSE_FILTER_GENDER', payload: { genderId } };
}

export function actSetAgeFilter(ageId) {
    return { type: 'BROWSE_FILTER_AGE', payload: { ageId } };
}

export function actResetFilter() {
    return { type: 'BROWSE_FILTER_RESET', payload: { } };
}

/**
 * Action to load available gender filters
 */
export function actLoadGenderFilters() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingGenderFilters(true));

        // call the actual endpoint
        const response = await loadGenderFilters();

        // hide loading indicator
        dispatch(actIsLoadingGenderFilters(false));

        // act on the response
        if (response && response[0] != undefined) {
            dispatch(actSuccessGenderFilters(response));
        } else {
            dispatch(actIsFailedGenderFilters('Failed loading list of genders'));
        }
    }
}

function actIsLoadingGenderFilters(isLoading) {
    return { type: 'BROWSE_IS_LOADING_GENDER', payload: { isLoading } };
}

function actSuccessGenderFilters(genders) {
    return { type: 'BROWSE_SET_GENDERS', payload: { genders } };
}

function actIsFailedGenderFilters(error) {
    return { type: 'BROWSE_FAILED', payload: { error } };
}

/**
 * Action to load available age filters
 */
export function actLoadAgeFilters() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingAgeFilters(true));

        // call the actual endpoint
        const response = await loadAgeFilters();

        // hide loading indicator
        dispatch(actIsLoadingAgeFilters(false));

        // act on the response
        if (response && response[0] != undefined) {
            dispatch(actSuccessAgeFilters(response));
        } else {
            dispatch(actIsFailedAgeFilters('Failed loading list of age filters'));
        }
    }
}

function actIsLoadingAgeFilters(isLoading) {
    return { type: 'BROWSE_IS_LOADING_AGE', payload: { isLoading } };
}

function actSuccessAgeFilters(ageRange) {
    return { type: 'BROWSE_SET_AGE_RANGE', payload: { ageRange } };
}

function actIsFailedAgeFilters(error) {
    return { type: 'BROWSE_FAILED', payload: { error } };
}

/**
 * Action to filter users
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} lat - latitude
 * @param {Number} lng - longitude
 * @param {String} gender - gender
 * @param {String} age - age range filter
 * @param {Boolean} online - filter online/offline users
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export function actFilterUsers(offset = 0, lat, lng, gender, age, online, limit = 25) {

    return async (dispatch) => {

        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingUserFilters(true));
            dispatch(actResetUserFilters());
        }

        // call the actual endpoint
        const response = await filterUsers(offset, lat, lng, gender, age, online, limit);

        // hide loading indicator
        dispatch(actIsLoadingUserFilters(false));

        // act on the response
        if (response.users != undefined && response.total != undefined) {
            dispatch(actSuccessUserFilters(response.users, response.total));
        } else {
            dispatch(actIsFailedUserFilters('Failed loading filtered users'));
        }
    }
}

function actIsLoadingUserFilters(isLoading) {
    return { type: 'BROWSE_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserFilters(users, total) {
    return { type: 'BROWSE_SET_DATA', payload: { users, total } };
}

function actIsFailedUserFilters(error) {
    return { type: 'BROWSE_FAILED', payload: { error } };
}

function actResetUserFilters() {
    return { type: 'BROWSE_RESET_DATA', payload: { } };
}

/**
 * Give a verdict to a user (follow/unfollow)
 * @param {Number} userId - user id to give verdict
 * @param {String} verdict - user verdict 'follow' or 'unfollow'
 * @param {String} pageLocation - page location
 */
export function actGiveUserVerdict(userId, verdict = 'follow', pageLocation) {
    
    return async (dispatch) => {

        // show loading indicator or disable follow/unfollow button
        dispatch(actIsLoadingUserVerdict(true, userId));

        // call the actual endpoint
        const response = verdict == 'follow' 
            ? await followUser(userId)
            : await unfollowUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserVerdict(false, userId));
        
        // act on the response
        if (response.message) {
            dispatch(actSuccessUserVerdict(userId, verdict));
        } else {
            dispatch(actFailedUserVerdict('Failed giving a user verdict', userId));
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
function actIsLoadingUserVerdict(isLoading, userId) {
    return { type: 'BROWSE_VERDICT_IS_LOADING', payload: { isLoading, userId } };
}

function actSuccessUserVerdict(userId, verdict) {
    return { type: 'BROWSE_VERDICT_SUCCESS', payload: { userId, verdict } };
}
 
function actFailedUserVerdict(error, userId) {
    return { type: 'BROWSE_VERDICT_FAILED', payload: { error, userId } };
} 

/**
 * Block a user
 * @param {Number} userId - user id to block
 * @param {String} pageLocation - page location
 */
 export function actBlockUser(userId, pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingUserBlock(true));

        // call the actual endpoint
        const response = await blockUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserBlock(false));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserBlock());
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedUserBlock(undefined));
            }, 250);
        } else {
            dispatch(actFailedUserBlock('Failed blocking the user'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined && _userId != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.BLOCK_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    target_id: userId
                }
            )
        }
    }
}

// Block Reducers 
function actIsLoadingUserBlock(isLoading) {
    return { type: 'BROWSE_BLOCK_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserBlock() {
    return { type: 'BROWSE_BLOCK_SUCCESS', payload: { } };
}

function actFailedUserBlock(error) {
    return { type: 'BROWSE_BLOCK_FAILED', payload: { error } };
}

/**
 * Report a user
 * @param {Number} userId - user id to block
 */
 export function actReportUser(userId) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingUserReport(true));

        // call the actual endpoint
        const response = await reportUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserReport(false));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserReport());
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedUserReport(undefined));
            }, 250);
        } else {
            dispatch(actFailedUserReport('Failed reporting the user'));
        }
    }
}

// Verdict Reducers 
function actIsLoadingUserReport(isLoading) {
    return { type: 'BROWSE_REPORT_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserReport() {
    return { type: 'BROWSE_REPORT_SUCCESS', payload: { } };
}

function actFailedUserReport(error) {
    return { type: 'BROWSE_REPORT_FAILED', payload: { error } };
}