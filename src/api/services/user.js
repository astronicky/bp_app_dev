/*
 * Created by Justice on Thu Nov 12 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import ApiRequest from './../manager';
import { Constants } from './../manager/constant';

/**
 * Load user data
 * @param {String} uname - user name
 */
export async function loadUser(uname) {
    const params = `?uname=${uname}`;
    return await ApiRequest(Constants.USER_PROFILE_URL + params, 'GET');
}

/**
 * Load current user data
 */
export async function loadCurrentUser() {
    return await ApiRequest(Constants.USER_INFO, 'GET');
}

/**
 * Report a user
 * @param {Number} uid - user id to report
 */
export async function reportUser(uid) {
    const payload = { uid };
    return await ApiRequest(Constants.USER_FLAG, 'POST', payload);
}

/**
 * Load user suggestions
 * @param {Number} limit - number of items per page
 */
export async function loadUserSuggestions(limit = 8) {
    const params = `?limit=${limit}`;
    return await ApiRequest(Constants.USER_SUGGESTIONS_URL + params, 'GET');
}

/**
 * Follow a user
 * @param {Number} uid - user id of the user to follow
 */
export async function followUser(uid) {
    const payload = { uid };
    return await ApiRequest(Constants.USER_FOLLOW_URL, 'POST', payload);
}

/**
 * Unfollow a user
 * @param {Number} uid - user id of the user to unfollow
 */
export async function unfollowUser(uid) {
    const payload = { uid };
    return await ApiRequest(Constants.USER_UNFOLLOW_URL, 'POST', payload);
}

/**
 * Block a user
 * @param {Number} uid - user id of the user to block
 */
export async function blockUser(uid) {
    const payload = { uid };
    return await ApiRequest(Constants.USER_BLOCK, 'POST', payload);
}

/**
 * Unblock a user
 * @param {Number} uid - user id of the user to unblock
 */
export async function unblockUser(uid) {
    const payload = { uid };
    return await ApiRequest(Constants.USER_UNBLOCK, 'POST', payload);
}

/**
 * Load blocked users
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function loadUserBlockList(offset = 0, limit = 25) {
    let params = `?offset=${offset}&limit=${limit}`;
    return await ApiRequest(Constants.USER_BLOCKED_USERS + params, 'GET');
}

/**
 * Checks if a user is flagged by the logged in user
 * @param {Number} uid - user id of the user
 */
export async function loadUserIsFlagged(uid) {
    let params = `?uid=${uid}`;
    return await ApiRequest(Constants.USER_IS_FLAGGED_BY_ME + params, 'GET');
}

/**
 * Load user followers 
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 * @param {Number} uid - leave it to undefined if you're loading the owner's followers otherwise indicate other user's uid
 */
export async function loadUserFollowers(offset = 0, limit = 25, uid = undefined) {
    let params = `?offset=${offset}&limit=${limit}`;
    if (uid != undefined) { params = `${params}&uid=${uid}`; }
    return await ApiRequest(Constants.USER_FOLLOWERS_URL + params, 'GET');
}

/**
 * Load user following 
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 * @param {Number} uid - leave it to undefined if you're loading the owner's following otherwise indicate other user's uid
 */
export async function loadUserFollowing(offset = 0, limit = 25, uid = undefined) {
    let params = `?offset=${offset}&limit=${limit}`;
    if (uid != undefined) { params = `${params}&uid=${uid}`; }
    return await ApiRequest(Constants.USER_FOLLOWING_URL + params, 'GET');
}

/**
 * Update user profile pic
 * @param {String} image - base 64 string
 */
export async function setUserAvatar(image) {
    const payload = { img: image };
    return await ApiRequest(Constants.USER_SET_PIC_URL, 'POST', payload);
}

/**
 * Update user cover pic
 * @param {String} image - base 64 string
 */
export async function setUserCover(image) {
    const payload = { img: image };
    return await ApiRequest(Constants.USER_SET_COVER_URL, 'POST', payload);
}

/**
 * Update user bio
 * @param {String} bio
 */
export async function setUserBio(bio) {
    const payload = { bio };
    return await ApiRequest(Constants.USER_SET_BIO_URL, 'POST', payload);
}

/**
 * Update user is online
 */
export async function setUserIsOnline() {
    return await ApiRequest(Constants.USER_SET_ONLINE, 'POST', {});
}

/**
 * Update account current location
 * @param {Number} lat - latitude of current location
 * @param {Number} lng - longitude of current location
 */
export async function setUserCurrentLocation(lat, lng) {
    const payload = { lat, lon: lng };
    return await ApiRequest(Constants.USER_SET_CURRENT_LOCATION, 'POST', payload);
}