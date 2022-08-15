/*
 * Created by Justice on Wed Nov 11 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    likePost, unlikePost, likeComment, 
    unlikeComment, createTextComment, createMediaComment, 
    loadUser, followUser, unfollowUser, 
    loadPostComments, setUserAvatar, setUserCover, 
    setUserBio, loadUrlPreview, createLinkComment, 
    loadCurrentUser, deletePost, blockUser, 
    reportUser, flagPost, loadUserPosts, loadUserMedia
} from 'app/api/index';

/**
 * Action to load the user posts and store it to state
 * @param {Number} uid - user id
 * @param {Number} offset - number of total items already received
 */
export function actLoadUserPosts(uid, offset = 0, limit = 25) {

    return async (dispatch) => {

        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingPosts(uid, true));

            // remove previous contents
            dispatch(actResetPosts(uid));
        }

        // call the actual endpoint
        const response = await loadUserPosts(uid, offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingPosts(uid, false));

        // act on the response
        if (response.posts && response.total) {
            dispatch(actStoreDataPosts(uid, response.posts, response.total));
        } else {
            dispatch(actIsFailedPosts(uid, 'Failed loading user posts'));
        }  
    }
}

// User Posts Reducers
function actIsLoadingPosts(userId, isLoading) {
    return { type: 'PROFILE_POSTS_IS_LOADING', payload: { userId, isLoading } };
}

function actStoreDataPosts(userId, posts, total) {
    return { type: 'PROFILE_POSTS_SET_DATA', payload: { userId, posts, total } };
}

function actIsFailedPosts(userId, error) {
    return { type: 'PROFILE_POSTS_FAILED', payload: { userId, error } };
}

export function actResetPosts(userId) {
    return { type: 'PROFILE_POSTS_RESET', payload: { userId } };
}

/**
 * Action to load the user media and store it to state
 * @param {Number} uid - user id
 * @param {Number} offset - number of total items already received
 * @param {Number} limit 
 * @param {Boolean} forceReload
 */
export function actLoadUserMedia(uid, offset = 0, limit = 25, forceReload = false) {

    return async (dispatch) => {

        if (forceReload == true) {
            offset = 0;
            dispatch(actIsReloadingUser(true));
        }

        if (offset == 0) {
            // show loading indicator
            dispatch(actIsLoadingMedia(uid, true));

            // remove previous contents
            dispatch(actResetMedia(uid));
        }

        // call the actual endpoint
        const response = await loadUserMedia(uid, offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingMedia(uid, false));
        if (forceReload == true) {
            dispatch(actIsReloadingUser(false));
        }

        // act on the response
        if (response.posts && response.total) {
            dispatch(actStoreDataMedia(uid, response.posts, response.total));
        } else {
            dispatch(actIsFailedMedia(uid, 'Failed loading user posts'));
        }  
    }
}

// User Posts Reducers
function actIsLoadingMedia(userId, isLoading) {
    return { type: 'PROFILE_MEDIA_IS_LOADING', payload: { userId, isLoading } };
}

function actStoreDataMedia(userId, posts, total) {
    return { type: 'PROFILE_MEDIA_SET_DATA', payload: { userId, posts, total } };
}

function actIsFailedMedia(userId, error) {
    return { type: 'PROFILE_MEDIA_FAILED', payload: { userId, error } };
}

export function actResetMedia(userId) {
    return { type: 'PROFILE_MEDIA_RESET', payload: { userId } };
}

/**
 * Action to user current user data to state
 * @param {Object} user - user object stored in async storage
 */
export function actSetUser(user) {
    return { type: 'PROFILE_SET_USER', payload: { user } };
}

/**
 * Action to user current user token to state
 * @param {String} token
 */
export function actSetUserToken(token) {
    return { type: 'PROFILE_SET_USER_TOKEN', payload: { token } };
}

/**
 * Action to update user cover pic
 * @param {String} image - base 64 string
 */
export function actUpdateUserCoverPic(image) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingCoverPic(true));

        // call the actual endpoint
        const imgString = `data:image/jpeg;base64,${image}`
        const response = await setUserCover(imgString);

        // hide loading indicator
        dispatch(actIsLoadingCoverPic(false));

        // act on the response
        if (response.page_cover != undefined) {
            dispatch(actSuccessCoverPic(response));
        } else {
            dispatch(actIsFailedCoverPic('Failed updating user cover'));
        }  
    }
}

// Cover Pic Reducers
function actIsLoadingCoverPic(isLoading) {
    return { type: 'PROFILE_COVER_PIC_IS_LOADING', payload: { isLoading } };
}

function actSuccessCoverPic(cover) {
    return { type: 'PROFILE_COVER_PIC_SET_SUCCESS', payload: { cover } };
}

function actIsFailedCoverPic(error) {
    return { type: 'PROFILE_COVER_PIC_FAILED', payload: { error } };
}

/**
 * Action to update user bio
 * @param {String} bio - updated bio
 */
export function actUpdateUserBio(bio) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingBio(true));

        // call the actual endpoint
        const response = await setUserBio(bio);

        // hide loading indicator
        dispatch(actIsLoadingBio(false));

        // act on the response
        if (response.bio != undefined) {
            dispatch(actSuccessBio(response));
            // clear success status immediately
            dispatch(actIsFailedBio(undefined));
        } else {
            dispatch(actIsFailedBio('Failed updating user cover'));
        }  
    }
}

// Cover Pic Reducers
function actIsLoadingBio(isLoading) {
    return { type: 'PROFILE_BIO_IS_LOADING', payload: { isLoading } };
}

function actSuccessBio(bio) {
    return { type: 'PROFILE_BIO_SUCCESS', payload: { bio } };
}

function actIsFailedBio(error) {
    return { type: 'PROFILE_BIO_FAILED', payload: { error } };
}

/**
 * Action to update user avatar pic
 * @param {String} image - base 64 string
 */
export function actUpdateUserAvatarPic(image) {

    return async (dispatch) => {
        
        // show loading indicator
        dispatch(actIsLoadingAvatarPic(true));

        // call the actual endpoint
        const imgString = `data:image/jpeg;base64,${image}`
        const response = await setUserAvatar(imgString);

        // hide loading indicator
        dispatch(actIsLoadingAvatarPic(false));

        // act on the response
        if (response.avatar != undefined) {
            dispatch(actSuccessAvatarPic(response));
        } else {
            dispatch(actIsFailedAvatarPic('Failed updating user avatar'));
        }  
    }
}

// Cover Pic Reducers
function actIsLoadingAvatarPic(isLoading) {
    return { type: 'PROFILE_AVATAR_PIC_IS_LOADING', payload: { isLoading } };
}

function actSuccessAvatarPic(avatar) {
    return { type: 'PROFILE_AVATAR_PIC_SET_SUCCESS', payload: { avatar } };
}

function actIsFailedAvatarPic(error) {
    return { type: 'PROFILE_AVATAR_PIC_FAILED', payload: { error } };
}

/**
 * Give a verdict to a post (like/unlike)
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - post id to give verdict
 * @param {String} verdict - post verdict 'like' or 'unlike'
 * @param {String} pageLocation - page location
 */
export function actGivePostVerdict(ownerId, postId, verdict, pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingPostVerdict(true, ownerId, postId));

        // call the actual endpoint
        const response = verdict == 'like'
            ? await likePost(postId)
            : await unlikePost(postId);

        // hide loading indicator
        dispatch(actIsLoadingPostVerdict(false, ownerId, postId));

        // act on the response
        if (response.message) {
            dispatch(actSuccessPostVerdict(ownerId, postId, verdict));
        } else {
            dispatch(actFailedPostVerdict(ownerId, 'Failed giving a post verdict'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.REACTION_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    type: verdict,
                    //kind: 'post',
                    post_id: postId,
                    target_id: ownerId
                }
            )
        }

        // call analytics event
        if (response.message != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.REACTION_SUBMITTED, 
                { ...response, a_type: verdict, a_location: 'post' }
            )
        }
    }
}

// Verdict Reducers 
function actIsLoadingPostVerdict(isLoading, ownerId, postId) {
    return { type: 'PROFILE_VERDICT_IS_LOADING', payload: { isLoading, ownerId, postId } };
}

function actSuccessPostVerdict(ownerId, postId, verdict) {
    return { type: 'PROFILE_VERDICT_SUCCESS', payload: { ownerId, postId, verdict } };
}

function actFailedPostVerdict(ownerId, error) {
    return { type: 'PROFILE_VERDICT_FAILED', payload: { ownerId, error } };
}

/**
 * Create a text comment
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - post id to give comment
 * @param {String} comment - text comment
 * @param {String} pageLocation - page location
 */
export function actGivePostTextComment(ownerId, postId, comment, pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingPostComment(true, ownerId, postId));

        // call the actual endpoint
        const response = await createTextComment(postId, comment);

        // hide loading indicator
        dispatch(actIsLoadingPostComment(false, ownerId, postId));

        // act on the response
        if (response.comment) {
            dispatch(actSuccessPostComment(ownerId, postId, response.comment));
        } else {
            dispatch(actFailedPostComment(ownerId, 'Failed giving a comment'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id
        
        // call analytics event
        if (response.comment != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.COMMENT_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    post_id: postId,
                    comment_id: response.comment.id
                }
            )
        }
    }
}

/**
 * Create a link comment
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - post id to give comment
 * @param {String} comment - text comment
 * @param {Object} preview - preview of the link
 * @param {[String]} urls - array of url
 * @param {String} pageLocation - page location
 */
export function actGivePostLinkComment(ownerId, postId, comment, preview, urls, pageLocation) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingPostComment(true, ownerId, postId));

        // call the actual endpoint
        const response = await createLinkComment(postId, comment, preview, urls);

        // hide loading indicator
        dispatch(actIsLoadingPostComment(false, ownerId, postId));

        // act on the response
        if (response.comment) {
            dispatch(actSuccessPostComment(ownerId, postId, response.comment));
        } else {
            dispatch(actFailedPostComment(ownerId, 'Failed giving a comment'));
        }

        // clear state
        setTimeout(() => {
            dispatch(actRemoveCommentPreview());
        }, 0.5);

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id
        
        // call analytics event
        if (response.comment != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.COMMENT_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    post_id: postId,
                    comment_id: response.comment.id
                }
            )
        }
    }
}

/**
 * Create a media comment
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - id of the post to comment
 * @param {String} comment - message
 * @param {[String]} images - array of base 64 strings
 * @param {String} pageLocation - page location
 */
export function actGivePostMediaComment(ownerId, postId, comment, images, pageLocation) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingPostComment(true, ownerId, postId));

        // call the actual endpoint
        const response = await createMediaComment(postId, comment, images);

        // hide loading indicator
        dispatch(actIsLoadingPostComment(false));

        // act on the response
        if (response.comment) {
            dispatch(actSuccessPostComment(ownerId, postId, response.comment));
        } else {
            dispatch(actFailedPostComment(ownerId, 'Failed giving a comment'));
        }

        // clear state
        setTimeout(() => {
            dispatch(actResetCommentMedia());
        }, 0.5);

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id
        
        // call analytics event
        if (response.comment != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.COMMENT_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    post_id: postId,
                    comment_id: response.comment.id
                }
            )
        }
    }
}

/**
 * Action to store selected media for a comment
 * @param {Number} postId 
 * @param {String} mediaItem - base 64 string
 */
export function actAddCommentMedia(postId, mediaItem) {
    return { type: 'PROFILE_COMMENT_ADD_MEDIA', payload: { postId, mediaItem } };
}

/**
 * Action to remove an attached media for a comment
 * @param {Number} index - index of the media item
 */
export function actRemoveCommentMedia(index) {
    return { type: 'PROFILE_COMMENT_REMOVE_MEDIA', payload: { index } };
}

/**
 * Action to reset selected media for a comment
 */
export function actResetCommentMedia() {
    return { type: 'PROFILE_COMMENT_RESET_MEDIA', payload: { } };
}

// Comment Reducers 
function actIsLoadingPostComment(isLoading, ownerId, postId) {
    return { type: 'PROFILE_COMMENT_IS_LOADING', payload: { isLoading, ownerId, postId } };
}

function actSuccessPostComment(ownerId, postId, comment) {
    return { type: 'PROFILE_COMMENT_SUCCESS', payload: { ownerId, postId, comment } };
}

function actFailedPostComment(ownerId, error) {
    return { type: 'PROFILE_COMMENT_FAILED', payload: { ownerId, error } };
} 

/**
 * Action to load the other user data
 * @param {Number} uid - user id
 * @param {Number} uname - user name
 * @param {Boolean} loadCurrentUserData - load current user data
 * @param {Boolean} forceReload - force reload user data
 */
export function actLoadUserData(uid, uname, loadCurrentUserData, forceReload = false) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingUser(true));
        if (forceReload == true) {
            dispatch(actIsReloadingUser(true));
        }

        // call the actual endpoint
        let response = await loadUser(uname);

        // hide loading indicator
        dispatch(actIsLoadingUser(false));
        if (forceReload == true) {
            dispatch(actIsReloadingUser(false));
        }

        // act on the response
        if (response.profile_status == 'Suspended') {
            // set a temporary uid
            response.id = uid;
            response.username = uname;
            response.viewer = { self: false };
        } 

        if (response.id) {
            dispatch(actStoreDataUser(response));
        }

        // load additional data
        if (loadCurrentUserData && response.email_status == undefined) {
            const userInfo = await loadCurrentUser();
            if (userInfo.user != undefined) {
                dispatch(actStoreUpdateDataUser(userInfo.user));
            }
        }
    }
}

// User Reducers
function actIsLoadingUser(isLoading) {
    return { type: 'PROFILE_OTHER_USER_IS_LOADING', payload: { isLoading } };
}

function actStoreDataUser(newUser) {
    return { type: 'PROFILE_OTHER_USER_SET_DATA', payload: { newUser } };
}

function actStoreUpdateDataUser(userData) {
    return { type: 'PROFILE_OTHER_UPDATE_USER_SET_DATA', payload: { userData } };
}

function actFailedUser(error) {
    return { type: 'PROFILE_OTHER_USER_FAILED', payload: { error } };
} 

function actIsReloadingUser(isReloading) {
    return { type: 'PROFILE_OTHER_USER_IS_RELOADING', payload: { isReloading } };
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
            dispatch(actFailedUserVerdict('Failed giving a post verdict'));
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
    return { type: 'PROFILE_USER_VERDICT_IS_LOADING', payload: { isLoading, userId } };
}

function actSuccessUserVerdict(userId, verdict) {
    return { type: 'PROFILE_USER_VERDICT_SUCCESS', payload: { userId, verdict } };
}
 
function actFailedUserVerdict(error) {
    return { type: 'PROFILE_USER_VERDICT_FAILED', payload: { error } };
} 

/**
 * Create a link preview
 * @param {Number} postId = post id
 * @param {String} urls - url where to get preview
 */
export function actCreateLinkPreview(postId, url) {

    return async (dispatch) => {

        // reset previous selection first
        dispatch(actRemoveCommentPreview());

        // show loading indicator 
        dispatch(actIsLoadingCommentPreview(postId, true));

        // call the actual endpoint
        const response = await loadUrlPreview(url);

        // hide loading indicator
        dispatch(actIsLoadingCommentPreview(postId, false));

        // act on the response
        if (response.title) {
            dispatch(actSuccessCommentPreview(postId, response));
        } else {
            dispatch(actRemoveCommentPreview());
        }
    }
}

// Comment Preview Reducers
function actIsLoadingCommentPreview(postId, isLoading) {
    return { type: 'PROFILE_PREVIEW_IS_LOADING', payload: { postId, isLoading } };
}

function actSuccessCommentPreview(postId, preview) {
    return { type: 'PROFILE_PREVIEW_SUCCESS', payload: { postId, preview } };
}

export function actRemoveCommentPreview() {
    return { type: 'PROFILE_PREVIEW_FAILED', payload: {} };
}

/**
 * Give a verdict to a comment (like/unlike)
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - post id where the comment belongs
 * @param {Number} commentId - comment id to give verdict
 * @param {String} verdict - comment verdict 'like' or 'unlike'
 * @param {String} pageLocation - page location
 */
export function actGiveCommentVerdict(ownerId, postId, commentId, verdict, pageLocation) {
    
    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingCommentVerdict(true, ownerId, postId, commentId));

        // call the actual endpoint
        const response = verdict == 'like' 
            ? await likeComment(commentId)
            : await unlikeComment(commentId);

        // hide loading indicator
        dispatch(actIsLoadingCommentVerdict(false, ownerId, postId, commentId));
        
        // act on the response
        if (response.message) {
            dispatch(actSuccessCommentVerdict(ownerId, postId, commentId, verdict));
        } else {
            dispatch(actFailedCommentVerdict(ownerId, 'Failed giving a comment verdict'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.REACTION_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    type: verdict,
                    //kind: 'comment',
                    post_id: postId,
                    comment_id: commentId,
                    target_id: ownerId
                }
            )
        }
    }
}

// Comment Verdict Reducers 
function actIsLoadingCommentVerdict(isLoading, ownerId, postId, commentId) {
    return { type: 'PROFILE_COMMENT_VERDICT_IS_LOADING', payload: { isLoading, ownerId, postId, commentId } };
}

function actSuccessCommentVerdict(ownerId, postId, commentId, verdict) {
    return { type: 'PROFILE_COMMENT_VERDICT_SUCCESS', payload: { ownerId, postId, commentId, verdict } };
}
 
function actFailedCommentVerdict(ownerId, error) {
    return { type: 'PROFILE_COMMENT_VERDICT_FAILED', payload: { ownerId, error } };
} 

/**
 * Load Post Comments
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - post id where the comment belongs
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
export function actLoadPostComments(ownerId, postId, offset = 0, limit = 25) {
    
    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingPostComments(true, ownerId, postId));

        // call the actual endpoint
        const response = await loadPostComments(postId, offset, limit)

        // hide loading indicator
        dispatch(actIsLoadingPostComments(false, ownerId, postId));
        
        // act on the response
        if (response.comments) {
            dispatch(actSuccessPostComments(ownerId, postId, response.comments));
        } else {
            dispatch(actFailedPostComments(ownerId, 'Failed giving a comment verdict'));
        }
    }
}

// Load Post Comment Reducers 
function actIsLoadingPostComments(isLoading, ownerId, postId) {
    return { type: 'PROFILE_LIST_COMMENT_IS_LOADING', payload: { isLoading, ownerId, postId } };
}

function actSuccessPostComments(ownerId, postId, comments) {
    return { type: 'PROFILE_LIST_COMMENT_SUCCESS', payload: { ownerId, postId, comments } };
}
 
function actFailedPostComments(ownerId, error) {
    return { type: 'PROFILE_LIST_COMMENT_FAILED', payload: { ownerId, error } };
} 

// Action for gif selection
export function actAttachGifUrl(url, postId) {
    return { type: 'PROFILE_SET_GIF_URL', payload: { url, postId } };
} 

/**
 * Delete a Post
 * @param {Number} ownerId - user id of the post creator
 * @param {Number} postId - post id to delete
 * @param {String} postType 
 * @param {Boolean} postIsLegacy 
 */
 export function actDeletePost(ownerId, postId, postType, postIsLegacy) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingDeletePost(true, ownerId, postId));

        // call the actual endpoint
        let response = await deletePost(postId, postType, postIsLegacy)

        // hide loading indicator
        dispatch(actIsLoadingDeletePost(false, ownerId, postId));

        // act on the response
        if (response.message == true) {
            dispatch(actSuccessDeletePost(ownerId, postId));
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedDeletePost(ownerId, undefined));
            }, 0.25);
        } else {
            dispatch(actFailedDeletePost(ownerId, 'Failed deleting the post'));
        }
    }
}

// Load Post Comment Reducers 
function actIsLoadingDeletePost(isLoading, ownerId, postId) {
    return { type: 'PROFILE_POST_DELETE_IS_LOADING', payload: { isLoading, ownerId, postId } };
}

function actSuccessDeletePost(ownerId, postId) {
    return { type: 'PROFILE_POST_DELETE_SUCCESS', payload: { ownerId, postId } };
}

function actFailedDeletePost(ownerId, error) {
    return { type: 'PROFILE_POST_DELETE_FAILED', payload: { ownerId, error } };
}

/**
 * Flag a Post
 * @param {Number} ownerId
 * @param {Number} postId 
 * @param {String} postType 
 * @param {Boolean} postIsLegacy 
 */
 export function actFlagPost(ownerId, postId, postType, postIsLegacy) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingFlagPost(true, ownerId, postId));

        // call the actual endpoint
        const response = await flagPost(postId, postType, postIsLegacy);

        // hide loading indicator
        dispatch(actIsLoadingFlagPost(false, ownerId, postId));

        // act on the response
        if (response.message == true) {
            dispatch(actSuccessFlagPost(ownerId, postId));
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedFlagPost(ownerId, undefined));
            }, 0.25);
        } else {
            dispatch(actFailedFlagPost(ownerId, 'Failed flagging the post'));
        }
    }
}

// Load Post Comment Reducers 
function actIsLoadingFlagPost(ownerId, isLoading, postId) {
    return { type: 'PROFILE_POST_FLAG_IS_LOADING', payload: { isLoading, ownerId, postId } };
}

function actSuccessFlagPost(ownerId, postId) {
    return { type: 'PROFILE_POST_FLAG_SUCCESS', payload: { ownerId, postId } };
}

function actFailedFlagPost(ownerId, error) {
    return { type: 'PROFILE_POST_FLAG_FAILED', payload: { ownerId, error } };
}

/**
 * Block a user
 * @param {Number} userId - user id to block
 * @param {String} pageLocation - page location
 */
 export function actBlockUser(userId, pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingUserBlock(true));

        // call the actual endpoint
        const response = await blockUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserBlock(false));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserBlock(userId));
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedUserBlock(undefined));
            }, 250);
        } else {
            dispatch(actFailedUserBlock('Failed blocking the user'));
        }

        const _userInfo = await AsyncStorage.getItem('userInfo');
        const _userData = JSON.parse(_userInfo ?? '{}');
        const _userId = _userData.id

        // call analytics event
        if (response.message != undefined && _userId != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.BLOCK_SUBMITTED, {
                    user_id: _userId, 
                    page_title: pageLocation,
                    target_id: userId
                }
            )
        }
    }
}

// Block Reducers 
function actIsLoadingUserBlock(isLoading) {
    return { type: 'PROFILE_USER_BLOCK_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserBlock(userId) {
    return { type: 'PROFILE_USER_BLOCK_SUCCESS', payload: { userId } };
}

function actFailedUserBlock(error) {
    return { type: 'PROFILE_USER_BLOCK_FAILED', payload: { error } };
}

/**
 * Report a user
 * @param {Number} userId - user id to block
 */
 export function actReportUser(userId) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingUserReport(true));

        // call the actual endpoint
        const response = await reportUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserReport(false));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserReport());
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedUserReport(undefined));
            }, 250);
        } else {
            dispatch(actFailedUserReport('Failed reporting the user'));
        }
    }
}

// Verdict Reducers 
function actIsLoadingUserReport(isLoading) {
    return { type: 'PROFILE_USER_REPORT_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserReport() {
    return { type: 'PROFILE_USER_REPORT_SUCCESS', payload: { } };
}

function actFailedUserReport(error) {
    return { type: 'PROFILE_USER_REPORT_FAILED', payload: { error } };
}