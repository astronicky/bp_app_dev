/*
 * Created by Justice on Thu Nov 26 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import _ from 'lodash'

export default function register(state = {}, action) {
    switch (action.type) {
        case 'REGISTER_CODE_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingCode: isLoading }
        }
        case 'REGISTER_CODE_SUCCESS': {
            return { ...state, codeSuccess: true, codeError: undefined }
        }
        case 'REGISTER_CODE_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingCode: false, codeSuccess: false, codeError: error }
        }
        case 'REGISTER_RESEND_CODE_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingResendCode: isLoading }
        }
        case 'REGISTER_RESEND_CODE_SUCCESS': {
            return { ...state, resendCodeSuccess: true, resendCodeError: undefined }
        }
        case 'REGISTER_RESEND_CODE_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingResendCode: false, resendCodeSuccess: false, resendCodeError: error }
        }
        case 'REGISTER_VERIFY_CODE_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingVerifyCode: isLoading }
        }
        case 'REGISTER_VERIFY_CODE_SUCCESS': {
            return { ...state, verifyCodeSuccess: true, verifyCodeLoginSuccess: undefined, verifyCodeError: undefined }
        }
        case 'REGISTER_VERIFY_CODE_LOGIN_SUCCESS': {
            return { ...state, verifyCodeSuccess: undefined, verifyCodeLoginSuccess: true, verifyCodeSuccess: undefined, verifyCodeError: undefined }
        }
        case 'REGISTER_VERIFY_CODE_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingVerifyCode: false, verifyCodeSuccess: false, verifyCodeLoginSuccess: false, verifyCodeError: error }
        }
        case 'REGISTER_GENDER_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingGender: isLoading }
        }
        case 'REGISTER_GENDER_SUCCESS': {
            const { genders } = action.payload;
            genders.map(item => {
                item.label = item.value
                item.value = item.id
                return item
            })
            return { ...state, availableGenders: genders, genderSuccess: true, genderError: undefined }
        }
        case 'REGISTER_GENDER_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingGender: false, genderSuccess: false, genderError: error }
        }
        case 'REGISTER_LOCATION_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingLocation: isLoading }
        }
        case 'REGISTER_LOCATION_SUCCESS': {
            return { ...state, locationSuccess: true, locationError: undefined }
        }
        case 'REGISTER_LOCATION_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingLocation: false, locationSuccess: false, locationError: error }
        }
        case 'REGISTER_SET_EMAIL': {
            const { email } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, email }}
        }
        case 'REGISTER_SET_USERNAME': {
            const { username } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, username }}
        }
        case 'REGISTER_SET_DISPLAYNAME': {
            const { displayname } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, display_name: displayname }}
        }
        case 'REGISTER_SET_PASSWORD': {
            const { password } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, password }}
        }
        case 'REGISTER_SET_CONFIRM_PASSWORD': {
            const { confirmPassword } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, confirm_password: confirmPassword }}
        }
        case 'REGISTER_SET_BIRTHDAY': {
            const { birthdayObj, birthday, birthdayDesc } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, dob: birthday, dob_desc: birthdayDesc, dob_date: birthdayObj }}
        }
        case 'REGISTER_SET_VERIFICATION_CODE': {
            const { code } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, code }}
        }
        case 'REGISTER_SET_LOCATION': {
            const { location } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, location }}
        }
        case 'REGISTER_SET_CURRENT_LOCATION': {
            const { location } = action.payload;
            return { ...state, userInfo: { ...state.userInfo, currentLocation: location }}
        }
        case 'REGISTER_SET_GENDER': {
            const { genderId } = action.payload;
            
            let genderDesc
            const genderList = state.availableGenders || []
            let index = _.findIndex(genderList, { id: genderId })
            if (index != -1) {
                genderDesc = genderList[index].label
            }

            return { ...state, userInfo: { ...state.userInfo, gender: genderId, gender_des: genderDesc }}
        }
        case 'REGISTER_FRIEND_SUGGESTIONS_IS_LOADING': {
            const isLoading = action.payload.isLoading || false
            return {
                ...state, isLoadingSuggestions: isLoading
            }
        }
        case 'REGISTER_FRIEND_SUGGESTIONS_SET_DATA': {
            const { suggestions } = action.payload
            return {
                ...state, suggestions, suggestionsSuccess: true, suggestionsEror: undefined
            }
        }
        case 'REGISTER_FRIEND_SUGGESTIONS_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, suggestionsSuccess: false, suggestionsEror: error
            }
        }
        case 'REGISTER_USER_VERDICT_IS_LOADING': {
            const { userId } = action.payload
            const isVerdictLoading = action.payload.isLoading || false

            const friends = (state.suggestions || [])
            const userIndex = _.findIndex(friends, { id: userId })
            
            return {
                ...state, 
                suggestions: state.suggestions.map(
                    (friend, i) => i === userIndex
                        ? { ...friend, isVerdictLoading }
                        : friend
                )
            }
        }
        case 'REGISTER_USER_VERDICT_SUCCESS': {
            const { userId, verdict } = action.payload
            
            const isFollowing = verdict == 'follow'
            const friends = (state.suggestions || [])
            const userIndex = _.findIndex(friends, { id: userId })
            
            return {
                ...state, 
                suggestions: state.suggestions.map(
                    (friend, i) => i === userIndex
                        ? { ...friend, isFollowing, verdictSuccess: true, verdictError: undefined }
                        : friend
                )
            }
        }
        case 'REGISTER_USER_VERDICT_FAILED': {
            const { userId, error } = action.payload

            const friends = (state.suggestions || [])
            const userIndex = _.findIndex(friends, { id: userId })
            
            return {
                ...state, 
                suggestions: state.suggestions.map(
                    (friend, i) => i === userIndex
                        ? { ...friend, verdictSuccess: false, verdictError: error }
                        : friend
                )
            }
        }
        case 'REGISTER_RESET': {
            return {}
        }
        default: {
            return state;
        }
    }
}