/*
 * Created by Justice on Thu Nov 26 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import moment from 'moment';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    sendAccountCode, validateAccountCode, loadAccountGenders, 
    checkIfEmailExists, checkIfUsernameExists, createAccount, 
    loginAccount, updateAccountLocation, loadLocationAdress, 
    loadUserSuggestions, followUser, unfollowUser, 
    setUserCurrentLocation 
} from 'app/api';

import { actSetUser } from 'app/features/user/profile/actions/index'

export function setEmail(email) {
    return { type: 'REGISTER_SET_EMAIL', payload: { email } };
}

export function setUsername(username) {
    return { type: 'REGISTER_SET_USERNAME', payload: { username } };
}

export function setDisplayname(displayname) {
    return { type: 'REGISTER_SET_DISPLAYNAME', payload: { displayname } };
}

export function setGender(genderId) {
    return { type: 'REGISTER_SET_GENDER', payload: { genderId } };
}

export function setPassword(password) {
    return { type: 'REGISTER_SET_PASSWORD', payload: { password } };
}

export function setConfirmPassword(confirmPassword) {
    return { type: 'REGISTER_SET_CONFIRM_PASSWORD', payload: { confirmPassword } };
}

export function setBirthday(birthdayObj, birthday, birthdayDesc) {
    return { type: 'REGISTER_SET_BIRTHDAY', payload: { birthdayObj, birthday, birthdayDesc } };
}

export function setLocation(location) {
    return { type: 'REGISTER_SET_LOCATION', payload: { location } };
}

export function setCurrentLocation(location) {
    return { type: 'REGISTER_SET_CURRENT_LOCATION', payload: { location } };
}

export function setVerificationCode(code) {
    return { type: 'REGISTER_SET_VERIFICATION_CODE', payload: { code } };
}

export function resetRegister() {
    return { type: 'REGISTER_RESET' };
}

function actIsLoadingCode(isLoading) {
    return { type: 'REGISTER_CODE_ISLOADING', payload: { isLoading } };
}

function actSuccessCode() {
    return { type: 'REGISTER_CODE_SUCCESS' };
}

function actIsFailedCode(error) {
    return { type: 'REGISTER_CODE_FAILED', payload: { error } };
}

/**
 * Action to send a verification code to an email
 * @param {String} email 
 * @param {String} username 
 * @param {String} password 
 * @param {String} confirmPassword 
 * @param {String} birthday
 */
export function actSendVerificationCode(email, username, password, confirmPassword, birthday) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingCode(true));

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false || email === undefined) {
            dispatch(actIsFailedCode('Invalid Email'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        // check spaces on username
        if (/\s/.test(username) || username == '') {
            dispatch(actIsFailedCode('White space is not allowed in usernames.'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        const age = moment().diff(birthday, 'years');
        if (age < 13) {
            dispatch(actIsFailedCode('Younger users are not permitted.'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        if (password.length < 8 || confirmPassword.length < 8) {
            dispatch(actIsFailedCode("Password cannot be longer than 16 characters or shorter than 8 characters."));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        if (password.length > 16 || confirmPassword.length > 16) {
            dispatch(actIsFailedCode("Password cannot be longer than 16 characters or shorter than 8 characters."));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        if (password !== confirmPassword) {
            dispatch(actIsFailedCode("Password and Confirm Password doesn't match."));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        const emailExists = await checkIfEmailExists(email);
        if (emailExists.message == true) {
            dispatch(actIsFailedCode('Email already exists. Try changing it.'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        const usernameExists = await checkIfUsernameExists(username);
        if (usernameExists.message == true) {
            // throw an error immediately
            dispatch(actIsFailedCode('Username is already taken. Please, use a different username.'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
            return;
        }

        // call the actual endpoint
        const response = await sendAccountCode(email);

        // hide loading indicator
        dispatch(actIsLoadingCode(false));

        // act on the response
        if (response.message == 'Please check your email box.') {
            dispatch(actSuccessCode());
            // clean the success immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
        } else {
            dispatch(actIsFailedCode('Failed sending verification code'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedCode(undefined));
            }, 50);
        }
    }
}

/**
 * Action to resend a verification code to an email
 * @param {String} email 
 */
export function actResendVerificationCode(email) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingResendCode(true));

        // call the actual endpoint
        const response = await sendAccountCode(email);

        // hide loading indicator
        dispatch(actIsLoadingResendCode(false));

        // act on the response
        if (response.message == 'Please check your email box.') {
            dispatch(actSuccessResendCode());
            // clean the success immediately
            setTimeout(() => {
                dispatch(actIsFailedResendCode(undefined));
            }, 50);
        } else {
            dispatch(actIsFailedResendCode('Failed sending verification code'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedResendCode(undefined));
            }, 50);
        }
    }
}

function actIsLoadingResendCode(isLoading) {
    return { type: 'REGISTER_RESEND_CODE_ISLOADING', payload: { isLoading } };
}

function actSuccessResendCode() {
    return { type: 'REGISTER_RESEND_CODE_SUCCESS' };
}

function actIsFailedResendCode(error) {
    return { type: 'REGISTER_RESEND_CODE_FAILED', payload: { error } };
}

/**
 * Action to verify email registation and create an account once successful
 * @param {String} email 
 * @param {String} username 
 * @param {String} password 
 * @param {String} displayname 
 * @param {String} birthday 
 * @param {String} code 
 * @param {String} captcha - received captcha
 * @param {String} gender - defaults to female
 */
export function actCheckVerificationCode(email, username, password, displayname, birthday, code, captcha, gender = 1) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingVerifyCode(true));

        // call the actual endpoint
        const response = await validateAccountCode(email, code, captcha);

        // act on the response
        if (response.message == 'Verification Code is valid.') {

            // create the account now
            const userResponse = await createAccount(email, username, password, displayname, birthday, code, captcha, gender);

            if (userResponse.user) {

                // login the newly created account
                const loginResponse = await loginAccount(username, password);

                if (loginResponse.user && loginResponse.token) {
                    // hide loading indicator
                    dispatch(actIsLoadingVerifyCode(false));

                    dispatch(actSuccessLoginAfterVerifyCode());

                    // get current user and store to state
                    dispatch(actSetUser(loginResponse.user))

                    // clean the success immediately
                    setTimeout(() => {
                        dispatch(actIsFailedVerifyCode(undefined));
                    }, 50);

                } else {
                    // hide loading indicator
                    dispatch(actIsLoadingVerifyCode(false));

                    dispatch(actSuccessVerifyCode());
                    // clean the success immediately
                    setTimeout(() => {
                        dispatch(actIsFailedVerifyCode(undefined));
                    }, 50);
                }

            } else {
                // hide loading indicator
                dispatch(actIsLoadingVerifyCode(false));

                dispatch(actIsFailedVerifyCode('Cannot create an account at this time.'));
                // clean the error immediately
                setTimeout(() => {
                    dispatch(actIsFailedVerifyCode(undefined));
                }, 50);
            }
            
        } else {

            // hide loading indicator
            dispatch(actIsLoadingVerifyCode(false));

            const msg = response.message ?? 'Invalid verification code'
            dispatch(actIsFailedVerifyCode(msg));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedVerifyCode(undefined));
            }, 50);
        }
    }
}

function actIsLoadingVerifyCode(isLoading) {
    return { type: 'REGISTER_VERIFY_CODE_ISLOADING', payload: { isLoading } };
}

function actSuccessLoginAfterVerifyCode() {
    return { type: 'REGISTER_VERIFY_CODE_LOGIN_SUCCESS' };
}

function actSuccessVerifyCode() {
    return { type: 'REGISTER_VERIFY_CODE_SUCCESS' };
}

function actIsFailedVerifyCode(error) {
    return { type: 'REGISTER_VERIFY_CODE_FAILED', payload: { error } };
}

/**
 * Action to load available genders
 */
export function actLoadGenders() {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingGender(true));

        // call the actual endpoint
        const response = await loadAccountGenders();

        // hide loading indicator
        dispatch(actIsLoadingGender(false));

        // act on the response
        if (response && response[0] != undefined) {
            dispatch(actSuccessGender(response));
        } else {
            dispatch(actIsFailedGender('Failed loading list of genders'));
        }
    }
}

function actIsLoadingGender(isLoading) {
    return { type: 'REGISTER_GENDER_ISLOADING', payload: { isLoading } };
}

function actSuccessGender(genders) {
    return { type: 'REGISTER_GENDER_SUCCESS', payload: { genders } };
}

function actIsFailedGender(error) {
    return { type: 'REGISTER_GENDER_FAILED', payload: { error } };
}

/**
 * Action to find user location
 * @param {Number} lat 
 * @param {Number} lng 
 */
export function actFindLocation(lat, lng) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateLocation(true));

        // update user location
        await setUserCurrentLocation(lat, lng);

        const address = await loadLocationAdress(lat, lng);
        const location = extractAddress(address);

        // hide loading indicator
        dispatch(actIsLoadingUpdateLocation(false));

        // act on the response
        if (location && _.isEmpty(location) == false) {
            dispatch(setCurrentLocation(location));
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

/**
 * Action to update account location
 * @param {Number} lat 
 * @param {Number} lng 
 */
export function actUpdateLocation(location) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUpdateLocation(true));

        // call the actual endpoint
        const response = await updateAccountLocation(location);

        // hide loading indicator
        dispatch(actIsLoadingUpdateLocation(false));

        // act on the response
        if (response.location != undefined) {
            dispatch(actSuccessUpdateLocation());
            // clean the success immediately
            setTimeout(() => {
                dispatch(actIsFailedUpdateLocation(undefined));
            }, 50);
        } else {
            dispatch(actIsFailedUpdateLocation('Failed updating account settings'));
            // clean the error immediately
            setTimeout(() => {
                dispatch(actIsFailedUpdateLocation(undefined));
            }, 50);
        }
    }
}

// Location Reducers
function actIsLoadingUpdateLocation(isLoading) {
    return { type: 'REGISTER_LOCATION_IS_LOADING', payload: { isLoading } };
}

function actSuccessUpdateLocation() {
    return { type: 'REGISTER_LOCATION_SUCCESS' };
}
 
function actIsFailedUpdateLocation(error) {
    return { type: 'REGISTER_LOCATION_FAILED', payload: { error } };
}

/**
 * Action to load the user suggestions
 * @param {Number} limit - max number of items
 */
export function actLoadUserSuggestions(limit = 40) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingSuggestions(true));

        // call the actual endpoint
        const response = await loadUserSuggestions(limit);

        // hide loading indicator
        dispatch(actIsLoadingSuggestions(false));

        // act on the response
        if (response.length && response.length != 0) {
            dispatch(actStoreDataSuggestions(response));
        } else {
            dispatch(actIsFailedSuggestions('Error loading friend suggestions'));
        }
    }
}

// User Feed Reducers
function actIsLoadingSuggestions(isLoading) {
    return { type: 'REGISTER_FRIEND_SUGGESTIONS_IS_LOADING', payload: { isLoading } };
}

function actStoreDataSuggestions(suggestions) {
    return { type: 'REGISTER_FRIEND_SUGGESTIONS_SET_DATA', payload: { suggestions } };
}
 
function actIsFailedSuggestions(error) {
    return { type: 'REGISTER_FRIEND_SUGGESTIONS_FAILED', payload: { error } };
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
            dispatch(actFailedUserVerdict('Failed giving a post verdict', userId));
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
    return { type: 'REGISTER_USER_VERDICT_IS_LOADING', payload: { isLoading, userId } };
}

function actSuccessUserVerdict(userId, verdict) {
    return { type: 'REGISTER_USER_VERDICT_SUCCESS', payload: { userId, verdict } };
}
 
function actFailedUserVerdict(error, userId) {
    return { type: 'REGISTER_USER_VERDICT_FAILED', payload: { error, userId } };
} 