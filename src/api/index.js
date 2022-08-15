/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

export { AnalyticsEvents } from './manager/events';

export { 
    loadUserFeed, 
    createTextComment, createLinkComment,
    createTextPost, createLinkPost, 
    createMediaPost, likePost, 
    unlikePost, loadUrlPreview, 
    loadUserPosts, loadUserMedia, 
    likeComment, unlikeComment, 
    loadPostComments, createMediaComment,
    deletePost, flagPost, loadPost
} from './services/post';

export { 
    loginAccount, logoutAccount, loginBroadcast
} from './services/auth';

export {
    loadChatRooms, loadChatMessages, sendChatMessage, 
    joinChatRoom, leaveChatRoom, loadChatRoomInfo
} from './services/chat';

export {
    loadMessageThreads, loadThreadMessages, sendThreadMessage, 
    deleteMessageThread, markThreadAsRead
} from './services/message';

export { 
    loadUser, followUser, loadCurrentUser,
    unfollowUser, loadUserFollowers, 
    loadUserFollowing, setUserAvatar, 
    setUserCover, setUserBio, 
    loadUserSuggestions, setUserCurrentLocation,
    setUserIsOnline, loadUserBlockList,
    blockUser, unblockUser, reportUser, 
    loadUserIsFlagged
} from './services/user';

export { 
    loadAccountSettings, updateAccountBirthday, 
    updateAccountDisplayname, updateAccountGender, 
    updateAccountLocation, updateAccountPassword, 
    updateAccountUsername, toggleBrowserNotif, 
    toggleAccountVisibility, toggleFollowNotif, 
    toggleMentionNotif, toggleMessageNotif, 
    togglePostNotif, togglePopularNotif, 
    loadLocationAdress,
    sendAccountCode, validateAccountCode,
    checkIfEmailExists, checkIfUsernameExists,
    createAccount, closeAccount, loadAccountGenders,
    updateAccountEmail, deactivateAccount, activateAccount
} from './services/account';

export {
    loadAgeFilters, loadGenderFilters, filterUsers,
    searchUser, searchTextPost, searchImagePost, 
    searchLinkPost, searchPost, searchUserIndexed
} from './services/browse';

export {
    loadNotifications, readNotification, deleteNotification, 
    readAllNotifications
} from './services/notification';