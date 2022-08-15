/*
 * Created by Justice on Tue Dec 01 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import _ from 'lodash'

function abbreviateNumber(number) {
    var SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
    var tier = Math.log10(Math.abs(number)) / 3 | 0;
    if(tier == 0) return number;
    var postfix = SI_POSTFIXES[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    var formatted = scaled.toFixed(1) + '';
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2);
    return formatted + postfix;
}

export default function browse(state = { showFilter: false, showSearch: false }, action) {
    switch (action.type) {
        case 'BROWSE_FILTER_IS_ONLINE': {
            const isOnline = state.isOnline ?? false
            return {
                ...state, isOnline: !isOnline
            };
        }
        case 'BROWSE_FILTER_IS_NEARBY': {
            const isNearby = state.isNearby ?? false
            return {
                ...state, isNearby: !isNearby
            };
        }
        case 'BROWSE_FILTER_GENDER': {
            const genderId = action.payload.genderId
            const genderFilters = state.genderFilters ?? []

            let genderValue
            let genderIndex = _.findIndex(genderFilters, { value: genderId })
            
            if (genderIndex != -1) {
                genderValue = genderFilters[genderIndex].label
            }

            return {
                ...state, genderValue, genderId
            };
        }
        case 'BROWSE_FILTER_AGE': {
            const ageId = action.payload.ageId
            const ageFilters = state.ageFilters ?? []

            let ageValue
            let ageIndex = _.findIndex(ageFilters, { value: ageId })
            
            if (ageIndex != -1) {
                ageValue = ageFilters[ageIndex].label
            }

            return {
                ...state, ageValue, ageId
            };
        }
        case 'BROWSE_FILTER_RESET': {
            return {
                ...state, 
                ageValue: 'All', ageId: 1,
                genderValue: 'All', genderId: 1,
                isOnline: false, isNearby: false,
                showFilter: true
            };
        }
        case 'BROWSE_FILTER_TOGGLE': {
            const showFilter = state.showFilter ?? false
            return {
                ...state,
                showFilter: !showFilter
            }
        }
        case 'BROWSE_SEARCH_TOGGLE': {
            const showSearch = state.showSearch ?? false
            return {
                ...state,
                showSearch: !showSearch
            }
        }
        case 'BROWSE_FILTER_LOCATION': {
            const { lat, lng } = action.payload
            return {
                ...state,
                latValue: lat, lngValue: lng
            }
        }
        case 'BROWSE_IS_LOADING_GENDER': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoadingGender: isLoading, success: undefined, error: undefined
            };
        }
        case 'BROWSE_SET_GENDERS': {
            const { genders } = action?.payload ?? [];
            const filter = genders.map((gender, index) => { 
                return { label: gender, value: index + 1 }; 
            });
            return { ...state, genderFilters: filter };
        }
        case 'BROWSE_IS_LOADING_AGE': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoadingAge: isLoading, success: undefined, error: undefined
            };
        }
        case 'BROWSE_SET_AGE_RANGE': {
            const { ageRange } = action?.payload ?? [];
            const filter = ageRange.map((age, index) => { 
                return { label: age, value: index + 1 }; 
            });
            return { ...state, ageFilters: filter };
        }
        case 'BROWSE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoading, success: undefined, error: undefined
            };
        }
        case 'BROWSE_SET_DATA': {
            const { users, total } = action.payload;

            users.map(user => {
                if (user.total_followers != undefined) {
                    const suffix = user.total_followers > 1 ? 'followers' : 'follower';
                    user.followersDesc = `${abbreviateNumber(user.total_followers)} ${suffix}`;
                }
                user.isOnline = state.isOnline ?? false
            });

            return { 
                ...state, total, 
                users: [...state.users || [], ...users]
            };
        }
        case 'BROWSE_RESET_DATA': {
            return {
                ...state, total: 0, users: []
            }
        }
        case 'BROWSE_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoading: false, success: false, error
            }
        }
        case 'BROWSE_VERDICT_IS_LOADING': {
            const { userId } = action.payload
            const isVerdictLoading = action.payload.isLoading || false

            const users = state.users ?? []
            const userIndex = _.findIndex(users, { id: userId })

            return {
                ...state, 
                users: state.users.map(
                    (user, i) => i === userIndex 
                        ? { ...user, isVerdictLoading }
                        : user
                )
            }
        }
        case 'BROWSE_VERDICT_SUCCESS': {
            const { userId, verdict } = action.payload

            const users = state.users ?? []
            const userIndex = _.findIndex(users, { id: userId })
            const isFollowing = verdict == 'follow'

            return {
                ...state, 
                users: state.users.map(
                    (user, i) => i === userIndex 
                        ? { ...user, viewer: { ...user.viewer, is_follower: isFollowing } }
                        : user
                )
            }
        }
        case 'BROWSE_VERDICT_FAILED': {
            const { userId, error } = action.payload
            
            const users = state.users ?? []
            const userIndex = _.findIndex(users, { id: userId })

            return {
                ...state, 
                users: state.users.map(
                    (user, i) => i === userIndex 
                        ? { ...user, error }
                        : user
                )
            }
        }
        case 'BROWSE_REPORT_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state, reportIsLoading: isLoading, reportSuccess: undefined, reportError: undefined
            };
        }
        case 'BROWSE_REPORT_SUCCESS': {
            return {
                ...state, reportSuccess: true, reportError: undefined
            };
        }
        case 'BROWSE_REPORT_FAILED': {
            const { error } = action.payload
            return {
                ...state, reportSuccess: undefined, reportError: error
            };
        }
        case 'BROWSE_BLOCK_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state, blockIsLoading: isLoading, blockSuccess: undefined, blockError: undefined
            };
        }
        case 'BROWSE_BLOCK_SUCCESS': {
            return {
                ...state, blockSuccess: true, blockError: undefined
            };
        }
        case 'BROWSE_BLOCK_FAILED': {
            const { error } = action.payload
            return {
                ...state, blockSuccess: undefined, blockError: error
            };
        }
        default: {
            return state;
        }
    }
}
