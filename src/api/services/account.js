/*
 * Created by Justice on Tue Nov 17 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import ApiRequest from './../manager';
import ReverseGeocodingRequest from './../manager/geocode';

import { Constants } from './../manager/constant';

/**
 * Load account settings
 */
export async function loadAccountSettings() {
    return await ApiRequest(Constants.ACCOUNT_GET_PROFILE_SETTINGS, 'GET');
}

/**
 * Load available genders
 */
export async function loadAccountGenders() {
    return await ApiRequest(Constants.ACCOUNT_GET_GENDERS, 'GET');
}

/**
 * Toggle visibility of account (switching of accounts from private to public and vv)
 */
export async function toggleAccountVisibility() {
    return await ApiRequest(Constants.ACCOUNT_SET_PROFILE_PRIVACY, 'POST', {});
}

/**
 * Update account user name
 * @param {String} username - updated user name
 */
export async function updateAccountUsername(username) {
    const payload = { username };
    return await ApiRequest(Constants.ACCOUNT_SET_USERNAME, 'POST', payload);
}

/**
 * Update account email
 * @param {String} email 
 * @param {String} code 
 */
export async function updateAccountEmail(email, code) {
    const payload = { email, code };
    return await ApiRequest(Constants.ACCOUNT_SET_EMAIL, 'POST', payload);
}

/**
 * Update account display name
 * @param {String} displayName - updated display name
 */
export async function updateAccountDisplayname(displayName) {
    const payload = { display_name: displayName };
    return await ApiRequest(Constants.ACCOUNT_SET_DISPLAYNAME, 'POST', payload);
}

/**
 * Update account gender
 * @param {String} gender - updated gender
 */
export async function updateAccountGender(gender) {
    const payload = { gender };
    return await ApiRequest(Constants.ACCOUNT_SET_GENDER, 'POST', payload);
}

/**
 * Update account birthday
 * @param {String} birthday - updated birthday (format: Y-m-d)
 */
export async function updateAccountBirthday(birthday) {
    const payload = { dob: birthday };
    return await ApiRequest(Constants.ACCOUNT_SET_BIRTHDAY, 'POST', payload);
}

/**
 * Update account location
 * @param {String} location - updated location
 */
export async function updateAccountLocation(location) {
    const payload = { location };
    return await ApiRequest(Constants.ACCOUNT_SET_LOCATION, 'POST', payload);
}

/**
 * Update account password
 * @param {String} currentPassword 
 * @param {String} newPassword 
 */
export async function updateAccountPassword(currentPassword, newPassword) {
    const payload = { current_password: currentPassword, new_password: newPassword };
    return await ApiRequest(Constants.ACCOUNT_SET_PASSWORD, 'POST', payload);
}

/**
 * Toggle browser notification settings
 */
export async function toggleBrowserNotif() {
    return await ApiRequest(Constants.ACCOUNT_SET_NOTIF_BROWSER, 'POST', {});
}

/**
 * Toggle posts notification settings
 */
export async function togglePostNotif() {
    return await ApiRequest(Constants.ACCOUNT_SET_NOTIF_POSTS, 'POST', {});
}

/**
 * Toggle popular notification settings
 */
export async function togglePopularNotif() {
    return await ApiRequest(Constants.ACCOUNT_SET_NOTIF_POPULAR, 'POST', {});
}

/**
 * Toggle mention notification settings
 */
export async function toggleMentionNotif() {
    return await ApiRequest(Constants.ACCOUNT_SET_NOTIF_MENTIONS, 'POST', {});
}

/**
 * Toggle follow notification settings
 */
export async function toggleFollowNotif() {
    return await ApiRequest(Constants.ACCOUNT_SET_NOTIF_FOLLOWS, 'POST', {});
}

/**
 * Toggle message notification settings
 */
export async function toggleMessageNotif() {
    return await ApiRequest(Constants.ACCOUNT_SET_NOTIF_MESSAGES, 'POST', {});
}

/**
 * Reverse geocode location
 * @param {Number} lat 
 * @param {Number} lng 
 */
export async function loadLocationAdress(lat, lng) {
    return await ReverseGeocodingRequest(lat, lng);
}

/**
 * Send a code to an email to validate the registration
 * @param {String} email - where to send the email
 */
export async function sendAccountCode(email) {
    const payload = { email };
    return await ApiRequest(Constants.ACCOUNT_SEND_CODE, 'POST', payload);
}

/**
 * Validate if a code sent into an email is valid
 * @param {String} email - where the code is received
 * @param {String} code - code to validate
 * @param {String} captcha - captcha string
 */
export async function validateAccountCode(email, code, captcha) {
    const payload = { email, code, 'g-recaptcha-response': captcha };
    return await ApiRequest(Constants.ACCOUNT_VALIDATE_CODE, 'POST', payload);
}

/**
 * Checks if an email already exists
 * @param {String} email 
 */
export async function checkIfEmailExists(email) {
    const path = `?email=${email}`;
    return await ApiRequest(Constants.ACCOUNT_CHECK_EMAIL_EXISTS + path, 'GET');
}

/**
 * Checks if a username already exists
 * @param {String} username 
 */
export async function checkIfUsernameExists(username) {
    const path = `?username=${username}`;
    return await ApiRequest(Constants.ACCOUNT_CHECK_USERNAME_EXISTS + path, 'GET');
}

/**
 * Create an account
 * @param {String} email - desired email
 * @param {String} username - desired username 
 * @param {String} password - desired password (minimum length is 8)
 * @param {String} displayname - desired display name
 * @param {String} birthday - format: YYYY-MM-DD
 * @param {String} code - code received from the email registered
 * @param {String} captcha - received captcha
 * @param {Number} gender - gender id from the list of genders
 */
export async function createAccount(email, username, password, displayname, birthday, code, captcha, gender = 1) {
    const payload = { code, email, username, password, display_name: displayname, dob: birthday, gender, 'g-recaptcha-response': captcha };
    return await ApiRequest(Constants.ACCOUNT_CREATE, 'POST', payload);
}

/**
 * Close the current account
 * @param {Number} uid 
 */
export async function closeAccount() {
    const payload = { };
    return await ApiRequest(Constants.ACCOUNT_DELETE, 'POST', payload);
}

/**
 * Deactivate the current account
 */
export async function deactivateAccount() {
    const payload = { };
    return await ApiRequest(Constants.ACCOUNT_DEACTIVATE, 'POST', payload);
}

/**
 * Activate the current account
 */
export async function activateAccount() {
    const payload = { };
    return await ApiRequest(Constants.ACCOUNT_ACTIVATE, 'POST', payload);
}