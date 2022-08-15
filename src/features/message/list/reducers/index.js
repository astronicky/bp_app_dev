/*
 * Created by Justice on Sun Feb 21 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import _ from 'lodash'
import moment from 'moment'
import Config from 'react-native-config'

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
    pusherEventName: '.DirectMessageSent', 
    deleteTitle: 'Unsubscribe from this conversation?',
    deleteMessage: 'Please confirm you would like to be removed from this conversation. YouI will not be able to access its history nor receive new messages sent to it by other recipients, but they may continue to have access to it.'
}

export default function messaging(state = initialState, action) {
    switch (action.type) {
        case 'MESSAGING_SET_TOKEN': {
            const { token } = action.payload;
            return {
                ...state,
                userToken: token
            }
        }
        case 'DM_THREADS_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoading, success: undefined, error: undefined
            };
        }
        case 'DM_THREADS_SET_DATA': {
            const { threads, total, unread, userId } = action.payload;

            threads.map(thread => {
                if (thread.recipients != undefined) {
                    thread.title = 'Messages';
                    thread.recipientIsVerified = false
                    if (thread.recipients.length <= 2) {
                        const otherUser = thread.recipients.filter(item => item.id != userId)[0]
                        const name = otherUser?.nickname ?? 'Messages';
                        thread.title = name;
                        thread.recipientIsVerified = otherUser?.show_verified_badge ?? false
                    }
                }

                if (thread.messages != undefined) {
                    thread.messages.map(msg => {
                        if (msg.message) {
                            msg.text = msg.message;
                        }
        
                        if (msg.created_gmt_ts) {
                            msg._id = msg.created_gmt_ts;
                            msg.createdAt = new Date(msg.created_gmt_ts * 1000);
                            msg.createdDate = moment.unix(msg.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a");
                            msg.createdTimeAgo = moment(msg.createdDate, "MMMM Do YYYY, h:mm:ss a").fromNow();
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
                    });
                    
                    const lastMessage = thread.messages[0]
                    if (lastMessage != undefined) {
                        thread.lastMessage = lastMessage
                    }
                }
            });

            return { 
                ...state, total, unread,
                threads: [...state.threads || [], ...threads]
            };
        }
        case 'DM_THREADS_RESET_DATA': {
            return {
                ...state, total: 0, threads: []
            }
        }
        case 'DM_THREADS_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoading: false, success: false, error: error
            }
        }
        case 'DM_THREADS_DELETE_CONFIRM': {
            const { thread } = action.payload;
            return {
                ...state,
                showDeleteConfirmation: true,
                deleteThreadId: thread.thread_id
            }
        }
        case 'DM_THREADS_DELETE_CANCEL': {
            return {
                ...state,
                showDeleteConfirmation: false,
                deleteThreadId: undefined
            }
        }
        case 'DM_THREADS_DELETE_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state,
                deleteThreadIsLoading: isLoading,
                deleteThreadId: undefined
            }
        }
        case 'DM_THREADS_DELETE_SUCCESS': {
            return {
                ...state,
                deleteThreadIsLoading: false,
                deleteThreadSuccess: true
            }
        }
        case 'DM_THREADS_DELETE_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, 
                deleteThreadIsLoading: false, 
                deleteThreadSuccess: false, 
                deleteThreadError: error
            }
        }
        case 'DM_MESSAGES_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoadingMessages: isLoading, messagesSuccess: undefined, messagesError: undefined
            };
        }
        case 'DM_MESSAGES_SET_DATA': {
            const { messages, threadId, offset, total } = action.payload;

            messages.map(msg => {
                if (msg.message) {
                    msg.text = msg.message;
                }

                if (msg.created_gmt_ts) {
                    msg._id = msg.created_gmt_ts;
                    msg.createdAt = new Date(msg.created_gmt_ts * 1000);
                    msg.createdDate = moment.unix(msg.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a");
                    msg.createdTimeAgo = moment(msg.createdDate, "MMMM Do YYYY, h:mm:ss a").fromNow();
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
            });

            let index = _.findIndex((state.dms || []), { threadId: threadId });

            if (index == -1) {
                return {
                    ...state,
                    dms: [
                        ...state.dms,
                        { threadId, messages, messagesTotalCount: total }
                    ]
                }
            }

            return {
                ...state,
                dms: (state.dms || []).map(
                    (dm, i) => i === index 
                        ? { ...dm, 
                            messages: offset == 0 ? messages : [...messages, ...dm.messages],
                            messagesTotalCount: total 
                        }
                        : dm
                )
            }
        }
        case 'DM_MESSAGES_RESET_DATA': {
            const { threadId } = action.payload;

            let index = _.findIndex((state.dms || []), { threadId: threadId });

            return {
                ...state,
                dms: (state.dms || []).map(
                    (dm, i) => i === index 
                        ? { ...dm, messages: [] }
                        : dm
                )
            }
        }
        case 'DM_MESSAGES_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoadingMessages: false, messagesSuccess: false, messagesError: error
            }
        }
        case 'DM_SENDMSG_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoadingSendMsg: isLoading, sengMsgSuccess: undefined, sengMsgError: undefined
            };
        }
        case 'DM_SENDMSG_SET_DATA': {
            const { msg, threadId } = action.payload;

            if (msg.message) {
                msg.text = msg.message;
            }

            if (msg.created_gmt_ts) {
                msg._id = msg.created_gmt_ts;
                msg.createdAt = new Date(msg.created_gmt_ts * 1000);
                msg.createdDate = moment.unix(msg.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a");
                msg.createdTimeAgo = moment(msg.createdDate, "MMMM Do YYYY, h:mm:ss a").fromNow();
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

            let index = _.findIndex((state.dms || []), { threadId: threadId });
            let threadIndex = _.findIndex((state.threads || []), { thread_id: threadId });

            return {
                ...state,
                dms: (state.dms || []).map(
                    (dm, i) => i === index 
                        ? { ...dm, messages: [...dm.messages, msg] }
                        : dm
                ),
                threads: (state.threads || []).map(
                    (thread, i) => i === threadIndex 
                        ? { ...thread, lastMessage: msg }
                        : thread
                )
            }
        }
        case 'DM_SENDMSG_FAILED': {
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