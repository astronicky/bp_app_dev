/*
 * Created by Justice on Fri Jan 8 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import moment from 'moment';
import _ from 'lodash';

export default function notifications(state = {}, action) {
    switch (action.type) {
        case 'NOTIFICATIONS_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoading, error: undefined
            };
        }
        case 'NOTIFICATIONS_SET_DATA': {
            const { notifications, total } = action.payload;

            // modify notifs date
            notifications.map(notif => {
                notif.notifDate = moment.unix(notif.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                notif.notifTimeAgo = moment(notif.notifDate, "MMMM Do YYYY, h:mm:ss a").fromNow()
                return notif
            });

            notifications.map(notif => {
                const userName = notif.user?.username ?? 'User'
                if (notif.notification == 'CommentLiked') {
                    notif.message = ` liked your comment.`
                } else if (notif.notification == 'PostLiked') {
                    notif.message = ` liked your post.`
                } else if (notif.notification == 'UserFollowed') {
                    notif.message = ` just followed you.`
                } else if (notif.notification == 'PostCommented') {
                    notif.message = ` commented on your post.`
                }
                return notif
            });

            return {
                ...state, totalNotificationCount: total,
                notifications: [...state.notifications || [], ...notifications]
            }
        }
        case 'NOTIFICATIONS_RESET': {
            return {
                ...state, notifications: [], totalNotificationCount: 0
            }
        }
        case 'NOTIFICATIONS_FAILED': {
            const { error } = action.payload;
            return {
                ...state, error
            }
        }
        case 'NOTIFICATIONS_UPDATE_STATUS': {
            const { notifId } = action.payload;
            let index = _.findIndex((state.notifications || []), { id: notifId });

            return {
                ...state,
                notifications: (state.notifications || []).map(
                    (notif, i) => i === index 
                        ? { ...notif, unread: false }
                        : notif
                )
            }
        }
        case 'NOTIFICATIONS_READ_ALL': {
            return {
                ...state,
                notifications: (state.notifications || []).map(
                    (notif) => { return { ...notif, unread: false } }
                )
            }
        }
        case 'NOTIFICATIONS_TOGGLE_MENU': {
            const { notifId } = action.payload;
            let index = _.findIndex((state.notifications || []), { id: notifId });

            return {
                ...state,
                notifications: (state.notifications || []).map(
                    (notif, i) => i === index 
                        ? { ...notif, showMenu: !(notif.showMenu ?? false) }
                        : notif
                )
            }
        }
        case 'NOTIFICATIONS_DELETE_ITEM': {
            const { notifId } = action.payload
            let index = _.findIndex((state.notifications || []), { id: notifId });
            let total = state.totalNotificationCount

            return {
                ...state, 
                notifications: [
                    ...state.notifications.slice(0, index),
                    ...state.notifications.slice(index + 1)
                ],
                totalNotificationCount: index != -1 ? total - 1 : total
            }
        }
        default: {
            return state
        }
    }

}