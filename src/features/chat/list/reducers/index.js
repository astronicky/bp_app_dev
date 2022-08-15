/*
 * Created by Justice on Thu Jan 28 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import _ from 'lodash';
import moment from 'moment';
import Config from 'react-native-config';

function abbreviateNumber(number) {
    var SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
    var tier = Math.log10(Math.abs(number)) / 3 | 0;
    if (tier == 0) return number;
    var postfix = SI_POSTFIXES[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    var formatted = scaled.toFixed(1) + '';
    if (/\.0$/.test(formatted))
        formatted = formatted.substr(0, formatted.length - 2);
    return formatted + postfix;
}

const initialState = {
    pusherConfig: {
        broadcaster: "pusher",
        key: Config.APP_PUSHER_KEY,
        cluster: "us2",
        forceTLS: true,
        encrypted: true,
        logToConsole: true,
        authEndpoint: `${Config.APP_BASE_URL}broadcasting/auth`,
    },
    pusherEventName: '.ChatMessageSent'
}

export default function chatRoom(state = initialState, action) {
    switch (action.type) {
        case 'CHAT_ROOMS_SET_TOKEN': {
            const { token } = action.payload;
            return {
                ...state,
                userToken: token
            }
        }
        case 'CHAT_ROOMS_HAS_UPDATES': {
            const { roomId, withChanges } = action.payload;
            return {
                ...state,
                roomChanges: { roomId, withChanges }
            }
        }
        case 'CHAT_ROOMS_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoading, success: undefined, error: undefined
            };
        }
        case 'CHAT_ROOMS_SET_DATA': {
            const { rooms, total } = action.payload;

            rooms.map(room => {
                if (room.total != undefined) {
                    room.totalDesc = `${abbreviateNumber(room.total)}`;
                }
            });

            return {
                ...state, total,
                chatRooms: [...state.chatRooms || [], ...rooms]
            };
        }
        case 'CHAT_ROOMS_RESET_DATA': {
            return {
                ...state, total: 0, chatRooms: []
            }
        }
        case 'CHAT_ROOMS_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoading: false, success: false, error: error
            }
        }
        case 'CHAT_MESSAGES_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoadingMessages: isLoading, messagesSuccess: undefined, messagesError: undefined
            };
        }
        case 'CHAT_MESSAGES_SET_DATA': {
            const { messages, roomId, total, offset } = action.payload;

            messages.map((msg, index) => {
                if (msg.message) {
                    msg.text = msg.message;
                }

                if (msg.created_gmt_ts && msg.message) {
                    // to avoid error on rare scenario in which some messages have the same created_gmt_ts
                    msg._id = msg.created_gmt_ts + `-` + `${index}`; 
                    msg.createdAt = new Date(msg.created_gmt_ts * 1000);
                    const msgDate = moment.unix(msg.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a");
                    msg.timeAgo = moment(msgDate, "MMMM Do YYYY, h:mm:ss a").fromNow();
                } 

                if (msg.user) {
                    if (msg.user.id) {
                        msg.user._id = msg.user.id;
                    }

                    if (msg.user.username) {
                        msg.user.name = msg.user.username;
                    }

                    if (msg.user.avatar?.sm) {
                        msg.user.avatar = msg.user.avatar.sm;
                    }
                } else {
                    msg.user._id = -1
                    msg.user.name = 'Guest'
                    msg.user.avatar = ''
                }
            });

            let index = _.findIndex((state.messages || []), { roomId: roomId });

            if (index == -1) {
                return {
                    ...state,
                    messages: [
                        ...state.messages,
                        { roomId, messages, messagesTotalCount: total }
                    ]
                }
            }

            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? {
                            ...message,
                            messages:
                                offset == 0
                                    ?
                                    messages.map(msg => {
                                        if ((message.mutedUsers ?? []).includes(msg.user.id) == true) {
                                            msg.isHidden = true
                                        }
                                        return msg
                                    })
                                    : [...(messages.map(msg => {
                                            if ((message.mutedUsers ?? []).includes(msg.user.id) == true) {
                                                msg.isHidden = true
                                            }
                                            return msg
                                        })),
                                        ...message.messages
                                      ]
                                    ,
                            messagesTotalCount: total
                        }
                        : message
                ),

            }
        }
        case 'CHAT_MESSAGES_SET_INFO': {
            const { roomId, info } = action.payload
            const index = _.findIndex((state.messages || []), { roomId: roomId });

            if (info.embed) {
                const htmlStyleFix = `<meta name="viewport" content="width=device-width, initial-scale=1" /><style type="text/css">iframe{width: 100%;height: 100%}</style>`;
                info.embed = `${htmlStyleFix}<p>${info.embed}</p>`
            }

            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? { ...message, info }
                        : message
                )
            }
        }
        case 'CHAT_MESSAGES_IS_LOADING_INFO': {
            const { roomId } = action.payload
            const isLoading = action.payload.isLoading || false;
            const index = _.findIndex((state.messages || []), { roomId: roomId });
            
            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? { ...message, isLoadingInfo: isLoading }
                        : message
                )
            }
        }
        case 'CHAT_MESSAGES_MUTE_USER': {
            const { roomId, userId } = action.payload
            const index = _.findIndex((state.messages || []), { roomId: roomId });

            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? {
                            ...message,
                            messages: message.messages.map(msg => {
                                if (msg.user.id == userId) {
                                    msg.isHidden = true
                                }
                                return msg
                            }),
                            mutedUsers: [...message.mutedUsers ?? [], userId]
                        }
                        : message
                )
            }
        }
        case 'CHAT_MESSAGES_UNMUTE_USER': {
            const { roomId, userId } = action.payload
            const index = _.findIndex((state.messages || []), { roomId: roomId });

            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? {
                            ...message,
                            messages: message.messages.map(msg => {
                                if (msg.user.id == userId) {
                                    msg.isHidden = false
                                }
                                return msg
                            }),
                            mutedUsers: message.mutedUsers.filter(user => user != userId)
                        }
                        : message
                )
            }
        }
        case 'CHAT_MESSAGES_RESET_DATA': {
            const { roomId } = action.payload;

            let index = _.findIndex((state.messages || []), { roomId: roomId });

            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? { ...message, messages: [], info: undefined, isLoadingInfo: undefined }
                        : message
                )
            }
        }
        case 'CHAT_MESSAGES_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoadingMessages: false, messagesSuccess: false, messagesError: error
            }
        }
        case 'CHAT_SENDMSG_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoadingSendMsg: isLoading, sengMsgSuccess: undefined, sengMsgError: undefined
            };
        }
        case 'CHAT_SENDMSG_SET_DATA': {
            const { msg, roomId } = action.payload;

            if (msg.message) {
                msg.text = msg.message;
            }

            if (msg.created_gmt_ts) {
                msg._id = msg.created_gmt_ts;
                msg.createdAt = new Date(msg.created_gmt_ts * 1000);
                const msgDate = moment.unix(msg.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a");
                msg.timeAgo = moment(msgDate, "MMMM Do YYYY, h:mm:ss a").fromNow();
            }

            if (msg.user) {
                if (msg.user.id) {
                    msg.user._id = msg.user.id;
                }

                if (msg.user.username) {
                    msg.user.name = msg.user.username;
                }

                if (msg.user.avatar?.sm) {
                    msg.user.avatar = msg.user.avatar.sm;
                }
            }

            let index = _.findIndex((state.messages || []), { roomId: roomId });
            let mutedUsers = []

            if (index != -1) {
                mutedUsers = state.messages[index].mutedUsers ?? []
            }

            // do not append a message if it is from a muted user
            if (mutedUsers.includes(msg.user.id) == true) {
                msg.isHidden = true
            }

            return {
                ...state,
                messages: (state.messages || []).map(
                    (message, i) => i === index
                        ? { ...message, messages: [...message.messages, msg], messagesTotalCount: (state.messagesTotalCount ?? 0) + 1 }
                        : message
                )
            }
        }
        case 'CHAT_SENDMSG_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoadingSendMsg: false, sengMsgSuccess: false, sengMsgError: error
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}