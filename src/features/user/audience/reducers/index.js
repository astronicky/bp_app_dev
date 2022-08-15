/*
 * Created by Justice on Sun Nov 15 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import _ from 'lodash';

export default function audience(state = {}, action) {
    switch (action.type) {
        case 'AUDIENCE_LIST_IS_LOADING': {
            const { userId } = action.payload
            const isLoading = action.payload.isLoading || false

            // extract user index
            let users = state.users || []
            let userIndex = _.findIndex(users, { id: userId })

            // if found, update the item
            if (userIndex != -1) {
                // update user object
                return {
                    ...state,
                    users: state.users.map(
                        (user, i) => i === userIndex
                            ? { ...user, isLoading }
                            : user
                    )
                };
            }

            // if not found, create one
            return {
                ...state,
                users: [
                    ...state.users || [], { id: userId, isLoading }
                ]
            }
        }
        case 'AUDIENCE_LIST_SET_FOLLOWERS_DATA': {
            const { userId, totalFollowers, usersList } = action.payload

            // extract user index
            let users = state.users || []
            let userIndex = _.findIndex(users, { id: userId })

            // update user object
            return {
                ...state,
                users: state.users.map(
                    (user, i) => i === userIndex
                        ? { ...user, total: totalFollowers, followers: [...user.followers || [], ...usersList] }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_SET_FOLLOWING_DATA': {
            const { userId, totalFollowing, usersList } = action.payload

            // extract user index
            let users = state.users || []
            let userIndex = _.findIndex(users, { id: userId })

            // update user object
            return {
                ...state,
                users: state.users.map(
                    (user, i) => i === userIndex
                        ? { ...user, total: totalFollowing, following: [...user.following || [], ...usersList] }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_RESET_FOLLOWERS_DATA': {
            const { userId } = action.payload

            // extract user index
            let users = state.users || []
            let userIndex = _.findIndex(users, { id: userId })

            // update user object
            return {
                ...state,
                users: state.users.map(
                    (user, i) => i === userIndex
                        ? { ...user, total: 0, followers: [] }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_RESET_FOLLOWING_DATA': {
            const { userId } = action.payload

            // extract user index
            let users = state.users || []
            let userIndex = _.findIndex(users, { id: userId })

            // update user object
            return {
                ...state,
                users: state.users.map(
                    (user, i) => i === userIndex
                        ? { ...user, total: 0, following: [] }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_FAILED': {
            const { userId, error } = action.payload

            // extract user index
            let users = state.users || []
            let userIndex = _.findIndex(users, { id: userId })

            // update user object
            return {
                ...state,
                users: state.users.map(
                    (user, i) => i === userIndex
                        ? { ...user, error }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_VERDICT_IS_LOADING': {
            const { mode, ownerId, userId } = action.payload
            const isUserVerdictLoading = action.payload.isLoading || false

            let users = (state.users || [])
            let index = _.findIndex(users, { id: ownerId })

            if (mode == 'follower' && index != -1) {
                let followers = users[index].followers ?? []
                let followerIndex = _.findIndex(followers, { id: userId })

                return {
                    ...state,
                    users: state.users.map(
                        (user, i) => i === index
                            ? {
                                ...user,
                                followers: user.followers.map(
                                    (followerItem, j) => j === followerIndex
                                        ? { ...followerItem, isUserVerdictLoading }
                                        : followerItem
                                )
                            }
                            : user
                    )
                };
            }

            let following = users[index].following ?? []
            let followingIndex = _.findIndex(following, { id: userId })

            return {
                ...state,
                users: state.users.map(
                    (user, i) => i === index
                        ? {
                            ...user,
                            following: user.following.map(
                                (followingItem, k) => k === followingIndex
                                    ? { ...followingItem, isUserVerdictLoading }
                                    : followingItem
                            )
                        }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_VERDICT_SUCCESS': {
            const { ownerId, userId, verdict, mode } = action.payload
            const followed = verdict == 'follow'

            let users = (state.users || [])
            let index = _.findIndex(users, { id: ownerId })
            let userViewer
 
            if (mode == 'follower' && index != -1) {
                let followers = users[index].followers ?? []
                let followerIndex = _.findIndex(followers, { id: userId })

                // update is user followed by the viewer
                if (followerIndex != -1) {
                    let updatedUser = followers[followerIndex]
                    userViewer = updatedUser.viewer || {}
                    userViewer.is_follower = followed
                }

                return {
                    ...state,
                    userVerdictSuccess: true, userVerdictError: undefined,
                    users: state.users.map(
                        (user, i) => i === index
                            ? {
                                ...user,
                                followers: user.followers.map(
                                    (followerItem, j) => j === followerIndex
                                        ? { ...followerItem, viewer: userViewer }
                                        : followerItem
                                )
                            }
                            : user
                    )
                };
            }

            let following = users[index].following ?? []
            let followingIndex = _.findIndex(following, { id: userId })

            // update is user followed by the viewer
            if (followingIndex != -1) {
                let updatedUser = following[followingIndex]
                userViewer = updatedUser.viewer || {}
                userViewer.is_follower = followed
            }

            return {
                ...state,
                userVerdictSuccess: true, userVerdictError: undefined,
                users: state.users.map(
                    (user, i) => i === index
                        ? {
                            ...user,
                            following: user.following.map(
                                (followingItem, k) => k === followingIndex
                                    ? { ...followingItem, viewer: userViewer }
                                    : followingItem
                            )
                        }
                        : user
                )
            };
        }
        case 'AUDIENCE_LIST_VERDICT_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, userVerdictSuccess: undefined, userVerdictError: error
            }
        }
        default: {
            return state
        }
    }
}