/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

export const Constants = {

    EMBEDLY_KEY: '02363a0aaf79477eba6314d5eb5f1ae9',
    GEOCODE_KEY: 'tMqhJoApQJL9whtTCnq8jG0Qpjq9ybqY',

    USER_LOGIN_URL: 'login',
    USER_LOGOUT_URL: 'logout',

    USER_FEED_POSTS_URL: 'feed/recent/posts',
    USER_PROFILE_POSTS_URL: 'user/profile/posts',
    USER_PROFILE_MEDIA_URL: 'user/profile/posts/media',

    USER_PROFILE_URL: 'user/profile',
    USER_SET_PIC_URL: 'user/profile/set/avatar',
    USER_SET_COVER_URL: 'user/profile/set/page_cover',
    USER_SET_BIO_URL: 'user/profile/set/bio',
    USER_SET_CURRENT_LOCATION: 'user/set/current/location',
    USER_SET_ONLINE: 'user/set/online',
    USER_BLOCKED_LISTS: 'user/blocked_by_me',
    USER_BLOCK: 'user/block',
    USER_UNBLOCK: 'user/unblock',
    USER_INFO: 'user',

    NOTIFICATION_GET_ITEMS: 'notifications',
    NOTIFICATION_DELETE_ITEM: 'notifications/delete',
    NOTIFICATION_READ_ITEM: 'notifications/read',

    USER_FOLLOWERS_URL: 'user/followers',
    USER_FOLLOWING_URL: 'user/following',

    USER_FOLLOW_URL: 'user/follow',
    USER_UNFOLLOW_URL: 'user/unfollow',
    USER_SUGGESTIONS_URL: 'user/suggested',

    USER_BLOCKED_USERS: 'user/blocked_by_me',
    USER_IS_FLAGGED_BY_ME: 'user/is_flagged_by_me',
    USER_FLAG: 'flag/user',

    BROADCAST_AUTH: 'broadcasting/auth',
    
    POST_LOAD: 'post',
    POST_LIKE:  'post/reaction/add/like',
    POST_UNLIKE: 'post/reaction/remove/like',
    POST_CREATE: 'post/create',
    POST_COMMENTS_URL: 'post/comments',
    POST_FLAG: 'flag/post',
    POST_DELETE: 'post/delete',

    COMMENT_LIKE: 'comment/reaction/add/like',
    COMMENT_UNLIKE: 'comment/reaction/remove/like',
    COMMENT_CREATE: 'comment/create',

    ACCOUNT_GET_PROFILE_SETTINGS: 'account/settings',
    ACCOUNT_SET_PROFILE_PRIVACY: 'account/set/profile',
    ACCOUNT_SET_USERNAME: 'account/set/username',
    ACCOUNT_SET_DISPLAYNAME: 'account/set/display_name',
    ACCOUNT_SET_GENDER: 'account/set/gender',
    ACCOUNT_SET_BIRTHDAY: 'account/set/dob',
    ACCOUNT_SET_LOCATION: 'account/set/location',
    ACCOUNT_SET_PASSWORD: 'account/set/password',
    ACCOUNT_SET_EMAIL: 'account/set/email',
    ACCOUNT_DEACTIVATE: 'account/deactivate',
    ACCOUNT_ACTIVATE: 'account/activate',

    ACCOUNT_SET_NOTIF_BROWSER: 'account/set/notification/browser',
    ACCOUNT_SET_NOTIF_POSTS: 'account/set/notification/posts',
    ACCOUNT_SET_NOTIF_POPULAR: 'account/set/notification/popular',
    ACCOUNT_SET_NOTIF_MENTIONS: 'account/set/notification/mentions',
    ACCOUNT_SET_NOTIF_FOLLOWS: 'account/set/notification/follows',
    ACCOUNT_SET_NOTIF_MESSAGES: 'account/set/notification/messages',

    ACCOUNT_GET_GENDERS: 'ref/genders',
    ACCOUNT_CHECK_EMAIL_EXISTS: 'account/email/exists',
    ACCOUNT_CHECK_USERNAME_EXISTS: 'account/username/exists',
    ACCOUNT_SEND_CODE: 'account/code/send',
    ACCOUNT_VALIDATE_CODE: 'account/code/validate',
    ACCOUNT_CREATE: 'account/create',
    ACCOUNT_DELETE: 'account/delete',

    BROWSE_AGE_FILTERS: 'browse/get/age/categories',
    BROWSE_GENDER_FILTERS: 'browse/get/genders',
    BROWSE_USERS: 'browse/users',

    SEARCH_PEOPLE: 'search/people',
    SEARCH_POST: 'search/posts',

    CHAT_GET_ROOMS: 'chats',
    CHAT_JOIN_ROOM: 'chat/join',
    CHAT_LEAVE_ROOM: 'chat/leave',
    CHAT_INFO_ROOM: 'chat/info',
    CHAT_GET_MESSAGES: 'chat/messages',
    CHAT_SEND_MESSAGE: 'chat/message/send',

    DM_GET_THREADS: 'dm/threads/all',
    DM_GET_MESSAGES: 'dm/thread/messages',
    DM_SEND_MESSAGE: 'dm/thread/send/message',
    DM_DELETE_THREAD: 'dm/thread/delete',
    DM_READ_MESSAGES: 'dm/thread/set/read'
}