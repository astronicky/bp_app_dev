/*
 * Created by Justice on Wed Dec 9 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import ApiRequest from './../manager';
import AlgoliaRequest from './../manager/algolia';

import { Constants } from './../manager/constant';

/**
 * Filter users 
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} lat - latitude
 * @param {Number} lng - longitude
 * @param {String} gender - gender
 * @param {String} age - age range filter
 * @param {Boolean} online - filter online/offline users
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function filterUsers(offset = 0, lat, lng, gender, age, online, limit = 25) {
    let params = `?offset=${offset}&limit=${limit}&gender=${gender}&age=${age}&online=${online}`;
    if (lat != undefined && lng != undefined) {
        const locationFilter = `&lat=${lat}&lon=${lng}`;
        params = params.concat(locationFilter);
    }
    return await ApiRequest(Constants.BROWSE_USERS + params, 'GET');
}

/**
 * Load age categories for filtering users
 */
export async function loadAgeFilters() {
    return await ApiRequest(Constants.BROWSE_AGE_FILTERS, 'GET');
}

/**
 * Load gender categories for filtering users
 */
export async function loadGenderFilters() {
    return await ApiRequest(Constants.BROWSE_GENDER_FILTERS, 'GET');
}

/**
 * Search a user by query string
 * @param {String} query 
 */
 export async function searchUserIndexed(query) {
    const params = {"requests":[{"indexName":"users","query":query}]}
    return await AlgoliaRequest(params);
}

/**
 * Search a user by query string
 * @param {String} query 
 */
export async function searchUser(query) {
    const params = `?q=${encodeURIComponent(query)}`;
    return await ApiRequest(Constants.SEARCH_PEOPLE + params, 'GET');
}

/**
 * Search post by query string
 * @param {String} query 
 * @param {Number} daysAgo - show results nth days ago
 */
 export async function searchPost(query, daysAgo = 7) {
    const params = `?q=${encodeURIComponent(query)}`;
    return await ApiRequest(Constants.SEARCH_POST + params, 'GET');
}

/**
 * Search an image post by query string
 * @param {String} query 
 * @param {Number} daysAgo - show results nth days ago
 */
 export async function searchImagePost(query, daysAgo = 7) {
    const params = `?q=${encodeURIComponent(query)}&type=photo&days_ago=${daysAgo}`;
    return await ApiRequest(Constants.SEARCH_POST + params, 'GET');
}

/**
 * Search a link post by query string
 * @param {String} query 
 * @param {Number} daysAgo - show results nth days ago
 */
 export async function searchLinkPost(query, daysAgo = 7) {
    const params = `?q=${encodeURIComponent(query)}&type=list&days_ago=${daysAgo}`;
    return await ApiRequest(Constants.SEARCH_POST + params, 'GET');
}

/**
 * Search a text post by query string
 * @param {String} query 
 * @param {Number} daysAgo - show results nth days ago
 */
 export async function searchTextPost(query, daysAgo = 7) {
    const params = `?q=${encodeURIComponent(query)}&type=text&days_ago=${daysAgo}`;
    return await ApiRequest(Constants.SEARCH_POST + params, 'GET');
}