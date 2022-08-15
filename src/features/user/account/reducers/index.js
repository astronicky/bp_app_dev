/*
 * Created by Justice on Wed Nov 18 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import _ from 'lodash'
import moment from 'moment'

const initState = {
    placeholders: {
        browserNotifTitle: 'Browser notifications',
        browserNotifCaption: 'Send me browser notifications when users follow me, send me messages and comment on my posts.',
        postNotifTitle: 'Posts notifications',
        postNotifCaption: 'Send me browser notifications when users follow me, send me messages and comment on my posts.',
        popularNotifTitle: 'Popular Today Email',
        popularNotifCaption: 'Send me an email notification when users follow me, send me messages and comment on my posts.',
        mentionNotifTitle: 'Mentions',
        mentionNotifCaption: 'Send me an email notification when users mention me.',
        followNotifTitle: 'Follows',
        followNotifCaption: 'Send me an email notification when users follow me.',
        messagesNotifTitle: 'Messages',
        messagesNotifCaption: 'Send me an email notification when users message me.',
        profilePrivateTitle: 'Make my profile private',
        profilePrivateCaption: 'People you follow will still be able to see your content.',
        displayLocationTitle: 'Make my location public',
        displayLocationCaption: 'Tip: Be mindful of when you decide to make your location public. If geotagging, be aware of when and how you share places that you frequent  (example: home, school, and work.)',
        displayAgeTitle: 'Make my age public',
        displayAgeCaption: 'Tip: Even if your age is not visible on this platform, you are still responsible for how you interact on the site in compliance with your age.',
        usernameTitle: 'Username',
        displaynameTitle: 'Display name',
        emailTitle: 'Email address',
        genderTitle: 'Gender',
        birthdayTitle: 'Birthday',
        passwordTitle: 'Password',
        currentPassCaption: 'Current password',
        newPassCaption: 'New password',
        confirmNewPassCaption: 'Confirm password',
        successfulUpdatePassword: 'Password successfully updated',
        successfulUpdateBirthday: 'Birthday successfully updated',
        searchPlaceholder: 'Search ...',
        viewAll: 'View all',
        update: 'Update',
        cancel: 'Cancel',
        blockTitle: 'Blocked Users',
        deactivateTitle: 'Deactivate your account',
        deactivateCaption: "Deactivating your account will not delete the content of posts and comments you've made on BlackPlanet. To do so please delete them individually.",
        blockCaption: 'Search a user to block them from viewing your profile. You will not be able to receive messages from blocked users.',
        deactivateModalTitle: 'Deactivating or Deleting your BlackPlanet Account',
        deactivateModalSubtitle: 'If you want to deactive or delete your account please choose an option below.',
        deactivateOptions: [
            {
                value: 'deactivate',
                title: 'Deactivate Account',
                subtitle: 'Deactivating your account can be temporary. Your profile will be disabled and your content will be removed. You will have 30 days before your account is permanently removed to reactivate.'
            },
            {
                value: 'delete',
                title: 'Delete Account',
                subtitle: 'Deleting your account is immediate and permanent. Chose this option if you no longer wish to have a BlackPlanet account. All your content will be deleted.'
            },
        ]
    }
}

export default function account(state = {}, action) {
    switch (action.type) {
        case 'ACCOUNT_SETTINGS_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoading, success: undefined, error: undefined
            };
        }
        case 'ACCOUNT_SETTINGS_SUCCESS': {
            const { settings } = action.payload

            // assign gender labels for display
            if (settings.available_genders) {
                settings.available_genders.map(item => {
                    item.label = item.value
                    item.value = item.id
                    return item
                })
            }

            // get selected gender id for display
            if (settings.gender != null) {
                const genderList = settings.available_genders || []
                let index = _.findIndex(genderList, { label: settings.gender })
                if (index != -1) {
                    settings.genderId = genderList[index].id
                }
            }

            // format date
            if (settings.dob_y_m_d) {
                const formattedBirthday = moment(settings.dob_y_m_d, 'YYYY-MM-DD').format('MMM DD, YYYY')
                settings.birthday = formattedBirthday.toString()
                settings.birthdate = moment(settings.dob_y_m_d, 'YYYY-MM-DD').toDate()
            }

            return {
                ...state,
                ...settings
            };
        }
        case 'ACCOUNT_SETTINGS_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoading: false, success: false, error
            }
        }
        case 'ACCOUNT_BROWSER_NOTIF_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    browserNotifIsLoading: isLoading
                }
            };
        }
        case 'ACCOUNT_BROWSER_NOTIF_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    ...setting,
                    browserNotifSuccess: true,
                    browserNotifError: undefined
                }
            };
        }
        case 'ACCOUNT_BROWSER_NOTIF_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    browserNotifSuccess: false,
                    browserNotifError: error
                }
            };
        }
        case 'ACCOUNT_POST_NOTIF_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    postNotifIsLoading: isLoading
                }
            };
        }
        case 'ACCOUNT_POST_NOTIF_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    ...setting,
                    postNotifSuccess: true,
                    postNotifError: undefined
                }
            };
        }
        case 'ACCOUNT_POST_NOTIF_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    postNotifSuccess: false,
                    postNotifError: error
                }
            };
        }
        case 'ACCOUNT_POPULAR_NOTIF_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    popularNotifIsLoading: isLoading
                }
            };
        }
        case 'ACCOUNT_POPULAR_NOTIF_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    ...setting,
                    popularNotifSuccess: true,
                    popularNotifError: undefined
                }
            };
        }
        case 'ACCOUNT_POPULAR_NOTIF_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    popularNotifSuccess: false,
                    popularNotifError: error
                }
            };
        }
        case 'ACCOUNT_FOLLOW_NOTIF_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    followNotifIsLoading: isLoading
                }
            };
        }
        case 'ACCOUNT_FOLLOW_NOTIF_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    ...setting,
                    followNotifSuccess: true,
                    followNotifError: undefined
                }
            };
        }
        case 'ACCOUNT_FOLLOW_NOTIF_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    followNotifSuccess: false,
                    followNotifError: error
                }
            };
        }
        case 'ACCOUNT_MENTION_NOTIF_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    mentionNotifIsLoading: isLoading
                }
            };
        }
        case 'ACCOUNT_MENTION_NOTIF_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    ...setting,
                    mentionNotifSuccess: true,
                    mentionNotifError: undefined
                }
            };
        }
        case 'ACCOUNT_MENTION_NOTIF_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    mentionNotifSuccess: false,
                    mentionNotifError: error
                }
            };
        }
        case 'ACCOUNT_MESSAGE_NOTIF_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    messageNotifIsLoading: isLoading
                }
            };
        }
        case 'ACCOUNT_MESSAGE_NOTIF_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    ...setting,
                    messageNotifSuccess: true,
                    messageNotifError: undefined
                }
            };
        }
        case 'ACCOUNT_MESSAGE_NOTIF_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                notifications: {
                    ...state.notifications || {},
                    messageNotifSuccess: false,
                    messageNotifError: error
                }
            };
        }
        case 'ACCOUNT_PRIVACY_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                profilePrivacyIsLoading: isLoading
            };
        }
        case 'ACCOUNT_PRIVACY_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                ...setting,
                profilePrivacySuccess: true,
                profilePrivacyError: undefined
            };
        }
        case 'ACCOUNT_PRIVACY_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                profilePrivacySuccess: false,
                profilePrivacyError: error
            };
        }
        case 'ACCOUNT_USERNAME_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                usernameIsLoading: isLoading
            };
        }
        case 'ACCOUNT_USERNAME_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                ...setting,
                usernameSuccess: true,
                usernameError: undefined
            };
        }
        case 'ACCOUNT_USERNAME_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                usernameSuccess: false,
                usernameError: error
            };
        }
        case 'ACCOUNT_DISPLAYNAME_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                displaynameIsLoading: isLoading
            };
        }
        case 'ACCOUNT_DISPLAYNAME_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                ...setting,
                displaynameSuccess: true,
                displaynameError: undefined
            };
        }
        case 'ACCOUNT_DISPLAYNAME_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                displaynameSuccess: false,
                displaynameError: error
            };
        }
        case 'ACCOUNT_BIRTHDATE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                birthdateIsLoading: isLoading
            };
        }
        case 'ACCOUNT_BIRTHDATE_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            if (setting.dob_y_m_d) {
                const formattedBirthday = moment(setting.dob_y_m_d, 'YYYY-MM-DD').format('MMM DD, YYYY')
                setting.birthday = formattedBirthday.toString()
                setting.birthdate = moment(setting.dob_y_m_d, 'YYYY-MM-DD').toDate()
            }

            return {
                ...state,
                ...setting,
                birthdateSuccess: true,
                birthdateError: undefined
            };
        }
        case 'ACCOUNT_BIRTHDATE_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                birthdateSuccess: false,
                birthdateError: error
            };
        }
        case 'ACCOUNT_GENDER_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                genderIsLoading: isLoading
            };
        }
        case 'ACCOUNT_GENDER_SUCCESS': {
            const { setting } = action.payload;

            // get selected gender id for display
            let genderId
            if (setting.gender != null) {
                const genderList = state.available_genders || []
                let index = _.findIndex(genderList, { label: setting.gender })
                if (index != -1) {
                    genderId = genderList[index].id
                }
            }

            return {
                ...state,
                ...setting,
                genderSuccess: true,
                genderId: genderId,
                genderError: undefined
            };
        }
        case 'ACCOUNT_GENDER_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                genderSuccess: false,
                genderError: error
            };
        }
        case 'ACCOUNT_PASSWORD_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                passwordIsLoading: isLoading
            };
        }
        case 'ACCOUNT_PASSWORD_SUCCESS': {
            // always reset the state of error and success
            return {
                ...state,
                passwordSuccess: true,
                passwordError: undefined
            };
        }
        case 'ACCOUNT_PASSWORD_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                passwordSuccess: false,
                passwordError: error
            };
        }
        case 'ACCOUNT_LOCATION_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                locationIsLoading: isLoading
            };
        }
        case 'ACCOUNT_LOCATION_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                ...setting,
                locationSuccess: true,
                locationError: undefined
            };
        }
        case 'ACCOUNT_LOCATION_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                locationSuccess: false,
                locationError: error
            };
        }
        case 'ACCOUNT_SET_VERIFICATION_CODE': {
            const { code } = action.payload;
            return { ...state, verificationCode: code };
        }
        case 'ACCOUNT_UPDATE_EMAIL_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                updateEmailIsLoading: isLoading
            };
        }
        case 'ACCOUNT_UPDATE_EMAIL_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                ...setting,
                updatedEmail: undefined,
                updateEmailSuccess: true,
                updateEmaillError: undefined
            };
        }
        case 'ACCOUNT_UPDATE_EMAIL_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                updateEmailSuccess: false,
                updateEmaillError: error
            };
        }
        case 'ACCOUNT_VERIFY_EMAIL_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                verifyEmailIsLoading: isLoading
            };
        }
        case 'ACCOUNT_VERIFY_EMAIL_SUCCESS': {
            // always reset the state of error and success
            return {
                ...state,
                updatedEmail: undefined,
                verifyEmailSuccess: true,
                verifyEmaillError: undefined
            };
        }
        case 'ACCOUNT_VERIFY_EMAIL_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                verifyEmailSuccess: false,
                verifyEmaillError: error
            };
        }
        case 'ACCOUNT_SEND_CODE_ISLOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingSendCode: isLoading }
        }
        case 'ACCOUNT_SEND_CODE_SUCCESS': {
            const { email } = action.payload;
            return { ...state, sendCodeSuccess: true, sendCodeError: undefined, updatedEmail: email }
        }
        case 'ACCOUNT_SEND_CODE_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingSendCode: false, sendCodeSuccess: false, sendCodeError: error }
        }
        case 'ACCOUNT_ONLINE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return { ...state, isLoadingSetOnline: isLoading }
        }
        case 'ACCOUNT_ONLLINE_SUCCESS': {
            return { ...state, setOnlineSuccess: true, setOnlineError: undefined }
        }
        case 'ACCOUNT_ONLINE_FAILED': {
            const error = action.payload.error;
            return { ...state, isLoadingSetOnline: false, setOnlineSuccess: false, setOnlineError: error }
        }
        case 'ACCOUNT_BLOCKED_LIST_IS_LOADING': {
            const isLoading = action.payload.isLoading || false
            return {
                ...state, isLoadingBlockedUsers: isLoading
            }
        }
        case 'ACCOUNT_BLOCKED_LIST_RESET_DATA': {
            return {
                ...state, totalBlockedUsers: 0, blockedUsers: []
            }
        }
        case 'ACCOUNT_BLOCKED_LIST_SET_DATA': {
            const { total, usersList } = action.payload
            return {
                ...state, totalBlockedUsers: total, blockedUsers: usersList
            }
        }
        case 'ACCOUNT_BLOCKED_LIST_SET_DATA': {
            const { error } = action.payload
            return {
                ...state, blockUsersError: error
            }
        }
        case 'USER_UNBLOCK_IS_LOADING': {
            const { userId } = action.payload
            const isLoading = action.payload.isLoading || false;
            const blockedUsers = state.blockedUsers || []
            let index = _.findIndex(blockedUsers, { id: userId })

            return {
                ...state, unblockSuccess: undefined, unblockError: undefined,
                blockedUsers: state.blockedUsers.map(
                    (user, i) => i === index
                        ? { ...user, userIsLoading: isLoading }
                        : user
                )
            };
        }
        case 'USER_UNBLOCK_SUCCESS': {
            const { userId } = action.payload

            const blockedUsers = state.blockedUsers || []
            let index = _.findIndex(blockedUsers, { id: userId })

            return {
                ...state, unblockSuccess: true, unblockError: undefined,
                blockedUsers: [
                    ...state.blockedUsers.slice(0, index),
                    ...state.blockedUsers.slice(index + 1)
                ]
            };
        }
        case 'USER_UNBLOCK_FAILED': {
            const { error } = action.payload
            return {
                ...state, unblockSuccess: undefined, unblockError: error
            };
        }
        case 'ACCOUNT_CLOSE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                closeAccountIsLoading: isLoading
            };
        }
        case 'ACCOUNT_CLOSE_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                closeAccountSuccess: true
            };
        }
        case 'ACCOUNT_CLOSE_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                closeAccountSuccess: false,
                closeAccountError: error
            };
        }
        case 'ACCOUNT_DEACTIVATE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state,
                deactivateAccountIsLoading: isLoading
            };
        }
        case 'ACCOUNT_DEACTIVATE_SUCCESS': {
            const { setting } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                deactivateAccountSuccess: true
            };
        }
        case 'ACCOUNT_DEACTIVATE_FAILED': {
            const { error } = action.payload;
            // always reset the state of error and success
            return {
                ...state,
                deactivateAccountSuccess: false,
                deactivateAccountError: error
            };
        }
        default: {
            return initState;
        }
    }
}
