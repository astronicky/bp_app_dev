/*
 * Created by Justice on Wed Nov 18 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { 
    AnalyticsEvents,
    loadAccountSettings, updateAccountBirthday, 
    updateAccountDisplayname, updateAccountGender, 
    updateAccountLocation, updateAccountPassword, 
    updateAccountUsername,
    toggleBrowserNotif, toggleAccountVisibility, 
    toggleFollowNotif, toggleMentionNotif, 
    toggleMessageNotif, togglePopularNotif,
    togglePostNotif, checkIfUsernameExists,
    loadLocationAdress, validateAccountCode,
    updateAccountEmail, sendAccountCode,
    setUserCurrentLocation, setUserIsOnline,
    loadUserBlockList, unblockUser, 
    closeAccount, deactivateAccount
} from 'app/api/index';

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

// const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Action to load the account settings
 */
export function actLoadAccountSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingSettings(true));

        // call the actual endpoint
        const response = await loadAccountSettings();

        // hide loading indicator
        dispatch(actIsLoadingSettings(false));
        
        // act on the response
        if (response.notifications) {
            dispatch(actSuccessSettings(response));
        } else {
            dispatch(actIsFailedSettings('Failed loading account settings'));
        }
    }
}

// User Feed Reducers
function actIsLoadingSettings(isLoading) {
    return { type: 'ACCOUNT_SETTINGS_IS_LOADING', payload: { isLoading } };
}

function actSuccessSettings(settings) {
    return { type: 'ACCOUNT_SETTINGS_SUCCESS', payload: { settings } };
}
 
function actIsFailedSettings(error) {
    return { type: 'ACCOUNT_SETTINGS_FAILED', payload: { error } };
}

/**
 * Action to toggle browser notifs
 */
export function actToggleBrowserSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingBrowserSettings(true));

        // call the actual endpoint
        const response = await toggleBrowserNotif();

        // hide loading indicator
        dispatch(actIsLoadingBrowserSettings(false));

        // act on the response
        if (response.browser != undefined) {
            dispatch(actSuccessBrowserSettings(response));
        } else {
            dispatch(actIsFailedBrowserSettings('Failed updating account settings'));
        }
    }
}

// Browser Settings Reducers
function actIsLoadingBrowserSettings(isLoading) {
    return { type: 'ACCOUNT_BROWSER_NOTIF_IS_LOADING', payload: { isLoading } };
}

function actSuccessBrowserSettings(setting) {
    return { type: 'ACCOUNT_BROWSER_NOTIF_SUCCESS', payload: { setting } };
}
 
function actIsFailedBrowserSettings(error) {
    return { type: 'ACCOUNT_BROWSER_NOTIF_FAILED', payload: { error } };
}

/**
 * Action to toggle posts notifs
 */
export function actTogglePostSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingPostSettings(true));

        // call the actual endpoint
        const response = await togglePostNotif();

        // hide loading indicator
        dispatch(actIsLoadingPostSettings(false));

        // act on the response
        if (response.posts != undefined) {
            dispatch(actSuccessPostSettings(response));
        } else {
            dispatch(actIsFailedPostSettings('Failed updating account settings'));
        }
    }
}

// Posts Settings Reducers
function actIsLoadingPostSettings(isLoading) {
    return { type: 'ACCOUNT_POST_NOTIF_IS_LOADING', payload: { isLoading } };
}

function actSuccessPostSettings(setting) {
    return { type: 'ACCOUNT_POST_NOTIF_SUCCESS', payload: { setting } };
}
 
function actIsFailedPostSettings(error) {
    return { type: 'ACCOUNT_POST_NOTIF_FAILED', payload: { error } };
}

/**
 * Action to toggle popular today email notifs
 */
export function actTogglePopularEmailSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingPopularEmailSettings(true));

        // call the actual endpoint
        const response = await togglePopularNotif();

        // hide loading indicator
        dispatch(actIsLoadingPopularEmailSettings(false));

        // act on the response
        if (response.popular != undefined) {
            dispatch(actSuccessPopularEmailSettings(response));
        } else {
            dispatch(actIsFailedPopularEmailSettings('Failed updating account settings'));
        }
    }
}

// Popular Email Settings Reducers
function actIsLoadingPopularEmailSettings(isLoading) {
    return { type: 'ACCOUNT_POPULAR_NOTIF_IS_LOADING', payload: { isLoading } };
}

function actSuccessPopularEmailSettings(setting) {
    return { type: 'ACCOUNT_POPULAR_NOTIF_SUCCESS', payload: { setting } };
}
 
function actIsFailedPopularEmailSettings(error) {
    return { type: 'ACCOUNT_POPULAR_NOTIF_FAILED', payload: { error } };
}

/**
 * Action to toggle follow notifs
 */
export function actToggleFollowSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingFollowSettings(true));

        // call the actual endpoint
        const response = await toggleFollowNotif();

        // hide loading indicator
        dispatch(actIsLoadingFollowSettings(false));

        // act on the response
        if (response.follows != undefined) {
            dispatch(actSuccessFollowSettings(response));
        } else {
            dispatch(actIsFailedFollowSettings('Failed updating account settings'));
        }
    }
}

// Follow Settings Reducers
function actIsLoadingFollowSettings(isLoading) {
    return { type: 'ACCOUNT_FOLLOW_NOTIF_IS_LOADING', payload: { isLoading } };
}

function actSuccessFollowSettings(setting) {
    return { type: 'ACCOUNT_FOLLOW_NOTIF_SUCCESS', payload: { setting } };
}
 
function actIsFailedFollowSettings(error) {
    return { type: 'ACCOUNT_FOLLOW_NOTIF_FAILED', payload: { error } };
}

/**
 * Action to toggle mention notifs
 */
export function actToggleMentionSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingMentionSettings(true));

        // call the actual endpoint
        const response = await toggleMentionNotif();

        // hide loading indicator
        dispatch(actIsLoadingMentionSettings(false));

        // act on the response
        if (response.mentions != undefined) {
            dispatch(actSuccessMentionSettings(response));
        } else {
            dispatch(actIsFailedMentionSettings('Failed updating account settings'));
        }
    }
}

// Mention Settings Reducers
function actIsLoadingMentionSettings(isLoading) {
    return { type: 'ACCOUNT_MENTION_NOTIF_IS_LOADING', payload: { isLoading } };
}

function actSuccessMentionSettings(setting) {
    return { type: 'ACCOUNT_MENTION_NOTIF_SUCCESS', payload: { setting } };
}
 
function actIsFailedMentionSettings(error) {
    return { type: 'ACCOUNT_MENTION_NOTIF_FAILED', payload: { error } };
}

/**
 * Action to toggle message notifs
 */
export function actToggleMessageSettings() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingMessageSettings(true));

        // call the actual endpoint
        const response = await toggleMessageNotif();

        // hide loading indicator
        dispatch(actIsLoadingMessageSettings(false));

        // act on the response
        if (response.messages != undefined) {
            dispatch(actSuccessMessageSettings(response));
        } else {
            dispatch(actIsFailedMessageSettings('Failed updating account settings'));
        }
    }
}

// Message Settings Reducers
function actIsLoadingMessageSettings(isLoading) {
    return { type: 'ACCOUNT_MESSAGE_NOTIF_IS_LOADING', payload: { isLoading } };
}

function actSuccessMessageSettings(setting) {
    return { type: 'ACCOUNT_MESSAGE_NOTIF_SUCCESS', payload: { setting } };
}
 
function actIsFailedMessageSettings(error) {
    return { type: 'ACCOUNT_MESSAGE_NOTIF_FAILED', payload: { error } };
}

/**
 * Action to toggle account privacy
 */
export function actToggleAccountPrivacy() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingAccountPrivacy(true));

        // call the actual endpoint
        const response = await toggleAccountVisibility();

        // hide loading indicator
        dispatch(actIsLoadingAccountPrivacy(false));

        // act on the response
        if (response.is_profile_private != undefined) {
            dispatch(actSuccessAccountPrivacy(response));
        } else {
            dispatch(actIsFailedAccountPrivacy('Failed updating account settings'));
        }
    }
}

// Message Settings Reducers
function actIsLoadingAccountPrivacy(isLoading) {
    return { type: 'ACCOUNT_PRIVACY_IS_LOADING', payload: { isLoading } };
}

function actSuccessAccountPrivacy(setting) {
    return { type: 'ACCOUNT_PRIVACY_SUCCESS', payload: { setting } };
}
 
function actIsFailedAccountPrivacy(error) {
    return { type: 'ACCOUNT_PRIVACY_FAILED', payload: { error } };
}

/**
 * Action to update account username
 * @param {String} username - updated user name
 */
export function actUpdateUsername(username) {

    return async (dispatch) => {
        // check spaces on username
        if (/\s/.test(username) || username == '') {
            dispatch(actIsFailedUpdateUsername('White space is not allowed in usernames.'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedUpdateUsername(undefined));
            }, 50);
            return;
        }

        // show loading indicator
        dispatch(actIsLoadingUpdateUsername(true));

        const usernameExists = await checkIfUsernameExists(username);
        if (usernameExists.message == true) {
            dispatch(actIsLoadingUpdateUsername(false));
            // throw an error immediately
            dispatch(actIsFailedUpdateUsername('Username is already taken. Please, use a different username.'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedUpdateUsername(undefined));
            }, 50);
            return;
        }

        // call the actual endpoint
        const response = await updateAccountUsername(username);

        // hide loading indicator
        dispatch(actIsLoadingUpdateUsername(false));

        // act on the response
        if (response.username != undefined) {
            dispatch(actSuccessUpdateUsername(response));
        } else {
            dispatch(actIsFailedUpdateUsername('Failed updating account settings'));
        }

        setTimeout(() => {
            // reset state
            dispatch(actIsFailedUpdateUsername(undefined));
        }, 200)
    }
}

// Username Reducers
function actIsLoadingUpdateUsername(isLoading) {
    return { type: 'ACCOUNT_USERNAME_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdateUsername(setting) {
    return { type: 'ACCOUNT_USERNAME_SUCCESS', payload: { setting } };
}
 
function actIsFailedUpdateUsername(error) {
    return { type: 'ACCOUNT_USERNAME_FAILED', payload: { error } };
}

/**
 * Action to update account display name
 * @param {String} displayname - updated display name
 */
export function actUpdateDisplayname(displayname) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateDisplayname(true));

        // call the actual endpoint
        const response = await updateAccountDisplayname(displayname);

        // hide loading indicator
        dispatch(actIsLoadingUpdateDisplayname(false));

        // act on the response
        if (response.display_name != undefined) {
            dispatch(actSuccessUpdateDisplayname(response));
        } else {
            dispatch(actIsFailedUpdateDisplayname('Failed updating account settings'));
        }

        setTimeout(() => {
            // reset state
            dispatch(actIsFailedUpdateDisplayname(undefined));
        }, 200)
    }
}

// Display name Reducers
function actIsLoadingUpdateDisplayname(isLoading) {
    return { type: 'ACCOUNT_DISPLAYNAME_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdateDisplayname(setting) {
    return { type: 'ACCOUNT_DISPLAYNAME_SUCCESS', payload: { setting } };
}
 
function actIsFailedUpdateDisplayname(error) {
    return { type: 'ACCOUNT_DISPLAYNAME_FAILED', payload: { error } };
}

/**
 * Action to update account birthdate
 * @param {String} date - updated birthday (format: Y-m-d)
 */
export function actUpdateDateOfBirth(date) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateBirthdate(true));

        // call the actual endpoint
        const response = await updateAccountBirthday(date);

        // hide loading indicator
        dispatch(actIsLoadingUpdateBirthdate(false));

        // act on the response
        if (response.dob_y_m_d != undefined) {
            dispatch(actSuccessUpdateBirthdate(response));
        } else {
            dispatch(actIsFailedUpdateBirthdate('Failed updating account settings'));
        }

        setTimeout(() => {
            // reset state
            dispatch(actIsFailedUpdateBirthdate(undefined));
        }, 200)
    }
}

// Birthdate Reducers
function actIsLoadingUpdateBirthdate(isLoading) {
    return { type: 'ACCOUNT_BIRTHDATE_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdateBirthdate(setting) {
    return { type: 'ACCOUNT_BIRTHDATE_SUCCESS', payload: { setting } };
}
 
function actIsFailedUpdateBirthdate(error) {
    return { type: 'ACCOUNT_BIRTHDATE_FAILED', payload: { error } };
}

/**
 * Action to update account gender
 * @param {String} gender - updated gender (refer to available genders under settings)
 */
export function actUpdateGender(gender) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateGender(true));

        // call the actual endpoint
        const response = await updateAccountGender(gender);

        // hide loading indicator
        dispatch(actIsLoadingUpdateGender(false));

        // act on the response
        if (response.gender != undefined) {
            dispatch(actSuccessUpdateGender(response));
        } else {
            dispatch(actIsFailedUpdateGender('Failed updating account settings'));
        }

        setTimeout(() => {
            // reset state
            dispatch(actIsFailedUpdateGender(undefined));
        }, 200)
    }
}

// Gender Reducers
function actIsLoadingUpdateGender(isLoading) {
    return { type: 'ACCOUNT_GENDER_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdateGender(setting) {
    return { type: 'ACCOUNT_GENDER_SUCCESS', payload: { setting } };
}
 
function actIsFailedUpdateGender(error) {
    return { type: 'ACCOUNT_GENDER_FAILED', payload: { error } };
}

/**
 * Action to update account location
 * @param {Number} lat 
 * @param {Number} lng 
 */
export function actUpdateLocation(lat, lng) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateLocation(true));

        // update user location
        await setUserCurrentLocation(lat, lng);

        const address = await loadLocationAdress(lat, lng);
        const location = extractAddress(address);

        // call the actual endpoint
        const response = await updateAccountLocation(location);

        // hide loading indicator
        dispatch(actIsLoadingUpdateLocation(false));

        // act on the response
        if (response.location != undefined) {
            dispatch(actSuccessUpdateLocation(response));
        } else {
            dispatch(actIsFailedUpdateLocation('Failed updating account settings'));
        }
    }
}

/**
 * Action to hide account location
 */
export function actHideLocation() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateLocation(true));

        // call the actual endpoint
        const response = await updateAccountLocation('');

        // hide loading indicator
        dispatch(actIsLoadingUpdateLocation(false));

        // act on the response
        if (response.location != undefined) {
            dispatch(actSuccessUpdateLocation(response));
        } else {
            dispatch(actIsFailedUpdateLocation('Failed updating account settings'));
        }
    }
}

extractAddress = (address) => {
    if (address.results && address.results.length != 0) {
        const locations = address.results[0].locations ?? []
        if (locations.length != 0) {
            const firstLocation = locations[0]
            if (firstLocation) {
                if (firstLocation.adminArea5 && firstLocation.adminArea3) {
                    return `${firstLocation.adminArea5}, ${firstLocation.adminArea3}`
                }
            }
            return ''
        }
        return ''
    }
    return ''
}

// Location Reducers
function actIsLoadingUpdateLocation(isLoading) {
    return { type: 'ACCOUNT_LOCATION_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdateLocation(setting) {
    return { type: 'ACCOUNT_LOCATION_SUCCESS', payload: { setting } };
}
 
function actIsFailedUpdateLocation(error) {
    return { type: 'ACCOUNT_LOCATION_FAILED', payload: { error } };
}

/**
 * Action to update account password
 * @param {String} currentPassword 
 * @param {String} newPassword 
 */
export function actUpdatePassword(currentPassword, newPassword) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdatePassword(true));

        // call the actual endpoint
        const response = await updateAccountPassword(currentPassword, newPassword);

        // hide loading indicator
        dispatch(actIsLoadingUpdatePassword(false));

        // act on the response
        if (response.message == 'Success') {
            dispatch(actSuccessUpdatePassword());
            setTimeout(() => {
                // reset state
                dispatch(actIsFailedUpdatePassword(undefined));
            }, 500)
        } else if (response.errors && response.errors.current_password && response.errors.current_password.length != 0) {
            const msg = response.errors.current_password[0] ?? response.message
            dispatch(actIsFailedUpdatePassword(msg));
            setTimeout(() => {
                // reset state
                dispatch(actIsFailedUpdatePassword(undefined));
            }, 500)
        }
    }
}

// Password Reducers
function actIsLoadingUpdatePassword(isLoading) {
    return { type: 'ACCOUNT_PASSWORD_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdatePassword() {
    return { type: 'ACCOUNT_PASSWORD_SUCCESS', payload: { } };
}
 
function actIsFailedUpdatePassword(error) {
    return { type: 'ACCOUNT_PASSWORD_FAILED', payload: { error } };
}

/**
 * Action to verify email
 * @param {String} email 
 * @param {String} code 
 * @param {String} captcha - received captcha
 */
export function actVerifyEmail(email, code, captcha) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingVerifyEmail(true));

        // call the actual endpoint
        const response = await validateAccountCode(email, code, captcha);

        // hide loading indicator
        dispatch(actIsLoadingVerifyEmail(false));

        // act on the response
        if (response.message == 'Verification Code is valid.') {
            dispatch(actSuccessVerifyEmail());
            // dispatch(setVerificationCode(undefined));

            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedVerifyEmail(undefined));
            }, 50);
        } else {
            const msg = 'Invalid verification code'
            dispatch(actIsFailedVerifyEmail(msg));

            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedVerifyEmail(undefined));
            }, 50);
        }
    }
}

function actIsLoadingVerifyEmail(isLoading) {
    return { type: 'ACCOUNT_VERIFY_EMAIL_ISLOADING', payload: { isLoading } };
}

function actSuccessVerifyEmail() {
    return { type: 'ACCOUNT_VERIFY_EMAIL_SUCCESS', payload: { } };
}

function actIsFailedVerifyEmail(error) {
    return { type: 'ACCOUNT_VERIFY_EMAIL_FAILED', payload: { error } };
}

/**
 * Action to verify email and update it if possible
 * @param {String} email 
 * @param {String} code 
 * @param {String} captcha - received captcha
 */
export function actUpdateEmail(email, code, captcha) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateEmail(true));

        // call the actual endpoint
        const response = await validateAccountCode(email, code, captcha);

        // act on the response
        if (response.message == 'Verification Code is valid.') {

            const update = await updateAccountEmail(email, code);

            // hide loading indicator
            dispatch(actIsLoadingUpdateEmail(false));

            if (update.email != undefined) {
                dispatch(actSuccessUpdateEmail(update));
            } else {
                const msg = response.message ?? 'Failed updating user email'
                dispatch(actIsFailedUpdateEmail(msg));
                // clean the error immediately
                setTimeout(() => {
                    dispatch(actIsFailedUpdateEmail(undefined));
                }, 50);
            }
            
        } else {

            // hide loading indicator
            dispatch(actIsLoadingUpdateEmail(false));

            const msg = response.message ?? 'Invalid verification code'
            dispatch(actIsFailedUpdateEmail(msg));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedUpdateEmail(undefined));
            }, 50);
        }
    }
}

export function setUpdatedEmail(email) {
    return { type: 'ACCOUNT_SET_UPDATE_EMAIL', payload: { email } };
}

export function setVerificationCode(code) {
    return { type: 'ACCOUNT_SET_VERIFICATION_CODE', payload: { code } };
}

function actIsLoadingUpdateEmail(isLoading) {
    return { type: 'ACCOUNT_UPDATE_EMAIL_ISLOADING', payload: { isLoading } };
}

function actSuccessUpdateEmail(setting) {
    return { type: 'ACCOUNT_UPDATE_EMAIL_SUCCESS', payload: { setting } };
}

function actIsFailedUpdateEmail(error) {
    return { type: 'ACCOUNT_UPDATE_EMAIL_FAILED', payload: { error } };
}

/**
 * Action to send a verification code to an email
 * @param {String} email 
 */
export function actSendVerificationCode(email) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingSendCode(true));

        // call the actual endpoint
        const response = await sendAccountCode(email);

        // hide loading indicator
        dispatch(actIsLoadingSendCode(false));

        // act on the response
        if (response.message == 'Please check your email box.') {
            dispatch(actSuccessSendCode(email));
            // clean the success immediately
            setTimeout(() => {
                dispatch(actIsFailedSendCode(undefined));
            }, 100);
        } else {
            dispatch(actIsFailedSendCode('Failed sending verification code'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedSendCode(undefined));
            }, 100);
        }
    }
}

function actIsLoadingSendCode(isLoading) {
    return { type: 'ACCOUNT_SEND_CODE_ISLOADING', payload: { isLoading } };
}

function actSuccessSendCode(email) {
    return { type: 'ACCOUNT_SEND_CODE_SUCCESS', payload: { email } };
}

function actIsFailedSendCode(error) {
    return { type: 'ACCOUNT_SEND_CODE_FAILED', payload: { error } };
}

/**
 * Action to toggle mention notifs
 */
export function actUpdateUserIsOnline() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingIsOnlineSettings(true));

        // call the actual endpoint
        const response = await setUserIsOnline();
        
        // hide loading indicator
        dispatch(actIsLoadingIsOnlineSettings(false));

        // act on the response
        if (response.message == true) {
            dispatch(actSuccessIsOnlineSettings());
        } else {
            dispatch(actIsFailedIsOnlineSettings('Failed updating is online'));
        }
    }
}

// Mention Settings Reducers
function actIsLoadingIsOnlineSettings(isLoading) {
    return { type: 'ACCOUNT_ONLINE_IS_LOADING', payload: { isLoading } };
}

function actSuccessIsOnlineSettings() {
    return { type: 'ACCOUNT_ONLLINE_SUCCESS', payload: { } };
}
 
function actIsFailedIsOnlineSettings(error) {
    return { type: 'ACCOUNT_ONLINE_FAILED', payload: { error } };
}

/**
 * Unblock a user
 * @param {Number} userId - user id to unblock
 * @param {String} pageLocation - page location
 */
export function actUnblockUser(userId, pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingUserUnBlock(userId, true));

        // call the actual endpoint
        const response = await unblockUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserUnBlock(userId, false));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserUnBlock(userId));
        } else {
            dispatch(actFailedUserUnBlock('Failed blocking the user'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined && _userId != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.UNBLOCK_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    target_id: userId
                }
            )
        }
    }
}

// Unblock Reducers 
function actIsLoadingUserUnBlock(userId, isLoading) {
    return { type: 'USER_UNBLOCK_IS_LOADING', payload: { userId, isLoading } };
}

function actSuccessUserUnBlock(userId) {
    return { type: 'USER_UNBLOCK_SUCCESS', payload: { userId } };
}

function actFailedUserUnBlock(error) {
    return { type: 'USER_UNBLOCK_FAILED', payload: { error } };
}

/**
 * Action to load the blocked users
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
export function actLoadUserBlockedList(offset = 0, limit = 100) {

    return async (dispatch) => {
        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingBlockedList(true));
        }

        // clear previous contents
        if (offset == 0) {
            dispatch(actResetBlockedList());
        }

        // call the actual endpoint
        const response = await loadUserBlockList(offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingBlockedList(false));

        // act on the response
        if (response.users && response.total) {
            dispatch(actStoreDataBlockedList(response.users, response.total));
        } else {
            dispatch(actIsFailedAudienceList('Failed loading blocked list'));
        }
    }
}

// Blocked List Reducers
function actIsLoadingBlockedList(isLoading) {
    return { type: 'ACCOUNT_BLOCKED_LIST_IS_LOADING', payload: { isLoading } };
}

function actResetBlockedList() {
    return { type: 'ACCOUNT_BLOCKED_LIST_RESET_DATA', payload: { } };
}

function actStoreDataBlockedList(usersList, total) {
    return { type: 'ACCOUNT_BLOCKED_LIST_SET_DATA', payload: { usersList, total } };
}

function actIsFailedAudienceList(error) {
    return { type: 'ACCOUNT_BLOCKED_LIST_FAILED', payload: { error } };
}

/**
 * Action to close the account
 */
export function actCloseAccount() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingCloseAccount(true));

        // call the actual endpoint
        const response = await closeAccount();

        // hide loading indicator
        dispatch(actIsLoadingCloseAccount(false));
        
        // act on the response
        if (response.message == true) {
            dispatch(actSuccessCloseAccount());
        } else {
            dispatch(actIsFailedCloseAccount('Failed closing the account'));
        }
    }
}

// Close Account Reducers
function actIsLoadingCloseAccount(isLoading) {
    return { type: 'ACCOUNT_CLOSE_IS_LOADING', payload: { isLoading } };
}

function actSuccessCloseAccount() {
    return { type: 'ACCOUNT_CLOSE_SUCCESS', payload: { } };
}
 
function actIsFailedCloseAccount(error) {
    return { type: 'ACCOUNT_CLOSE_FAILED', payload: { error } };
}

/**
 * Action to deactivate the account
 */
export function actDeactivateAccount() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingDeactivateAccount(true));

        // call the actual endpoint
        const response = await deactivateAccount();

        // hide loading indicator
        dispatch(actIsLoadingDeactivateAccount(false));
        
        // act on the response
        if (response.message == true) {
            dispatch(actSuccessDeactivateAccount());
        } else {
            dispatch(actIsFailedDeactivateAccount('Failed deactivating the account'));
        }
    }
}

// Deactivate Account Reducers
function actIsLoadingDeactivateAccount(isLoading) {
    return { type: 'ACCOUNT_DEACTIVATE_IS_LOADING', payload: { isLoading } };
}

function actSuccessDeactivateAccount() {
    return { type: 'ACCOUNT_DEACTIVATE_SUCCESS', payload: { } };
}
 
function actIsFailedDeactivateAccount(error) {
    return { type: 'ACCOUNT_DEACTIVATE_FAILED', payload: { error } };
}