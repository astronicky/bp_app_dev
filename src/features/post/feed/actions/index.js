/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import RNFetchBlob from "rn-fetch-blob";
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    likePost, unlikePost, likeComment, 
    unlikeComment, createTextComment, loadPostComments, 
    loadUserSuggestions, followUser, unfollowUser, 
    loadUrlPreview, createLinkComment, createMediaComment, 
    blockUser, reportUser, flagPost, 
    deletePost, loadPost, loadUserFeed
} from 'app/api/index';

/**
 * Action to load the user feed and store it  to state
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
export function actLoadUserFeed(offset = 0, limit = 25) {

    return async (dispatch) => {
        // show loading indicator
        if (offset == 0) {
            dispatch(actIsLoadingFeed(true));
            dispatch(actResetDataSuggestions());
        }

        // call the actual endpoint
        const response = await loadUserFeed(offset, limit);

        // hide loading indicator
        dispatch(actIsLoadingFeed(false));

        // act on the response
        if (response.status && response.status != 200) {
            dispatch(actIsFailedFeed(response.error));
        } else if (response.posts && response.total && response.response_gmt_ts && response.request) {
            dispatch(actStoreDataFeed(response.posts, response.total, offset, limit, response.response_gmt_ts, response.request.offset));
        }
    }
}

// User Feed Reducers
function actIsLoadingFeed(isLoading) {
    return { type: 'FEED_IS_LOADING', payload: { isLoading } };
}

function actStoreDataFeed(posts, total, offset, limit, since, requestOffset) {
    return { type: 'FEED_SET_DATA', payload: { posts, total, offset, limit, since, requestOffset } };
}

function actIsFailedFeed(error) {
    return { type: 'FEED_FAILED', payload: { error } };
}

/**
 * Action to force reload the user feed and store it  to state
 * @param {Number} limit - max number of items
 */
export function actForceReloadUserFeed(limit = 25) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsReloadingFeed(true));

        setTimeout(() => {
            dispatch(actIsLoadingFeed(true));
        }, 200)

        // call the actual endpoint
        const response = await loadUserFeed(0, limit);

        // hide loading indicator
        dispatch(actIsReloadingFeed(false));
        dispatch(actIsLoadingFeed(false));

        // act on the response
        if (response.status != undefined && response.status != 200) {
            dispatch(actIsFailedFeed(response.error));
        } else if (response.posts && response.total && response.response_gmt_ts && response.request) {
            dispatch(actStoreDataFeed(response.posts, response.total, 0, limit, response.response_gmt_ts, response.request.offset));
        }
    }
}

function actIsReloadingFeed(isReloading) {
    return { type: 'FEED_IS_RELOADING', payload: { isReloading } };
}

/**
 * Action to reload the user feed and store it  to state
 * @param {Number} since - last value of response_gmt_ts returned by the feed endpoint 
 * @param {Number} recentItemId - the first item in the response of feed api endpoint
 * @param {Number} limit - max number of items
 */
export function actCheckNewPostItems(since, recentItemId, limit = 25) {

    return async (dispatch) => {

        // call the actual endpoint
        const response = await loadUserFeed(0, limit);

        // act on the response
        if (response.posts && response.total && response.response_gmt_ts) {
            if (response.posts.length != 0) {
                const firstItemId = response.posts[0].id
                if (firstItemId != recentItemId) {
                    dispatch(actStoreReloadDataFeed(response.posts, response.total, response.response_gmt_ts));
                }
            }
        }
    }
}

export function actDisplayUpdatedUserFeed() {
    return { type: 'FEED_DISPLAY_UPDATED_DATA', payload: { } };
}

function actStoreReloadDataFeed(posts, total, since) {
    return { type: 'FEED_RELOAD_DATA', payload: { posts, total, since } };
}

/**
 * Action to load the user suggestions
 * @param {Number} limit - max number of items
 */
export function actLoadUserSuggestions(limit = 50) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingSuggestions(true));

        // call the actual endpoint
        const response = await loadUserSuggestions(limit);

        // hide loading indicator
        dispatch(actIsLoadingSuggestions(false));

        // act on the response
        if (response.length && response.length != 0) {
            dispatch(actStoreDataSuggestions(response));
        } else {
            dispatch(actIsFailedSuggestions('Error loading friend suggestions'));
        }
    }
}

// User Feed Reducers
function actIsLoadingSuggestions(isLoading) {
    return { type: 'FEED_FRIEND_SUGGESTIONS_IS_LOADING', payload: { isLoading } };
}

function actStoreDataSuggestions(suggestions) {
    return { type: 'FEED_FRIEND_SUGGESTIONS_SET_DATA', payload: { suggestions } };
}

function actIsFailedSuggestions(error) {
    return { type: 'FEED_FRIEND_SUGGESTIONS_FAILED', payload: { error } };
}

function actResetDataSuggestions() {
    return { type: 'FEED_FRIEND_SUGGESTIONS_RESET', payload: {} };
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
        dispatch(actIsLoadingPostVerdict(true, postId));

        // call the actual endpoint
        const response = verdict == 'like'
            ? await likePost(postId)
            : await unlikePost(postId);

        // hide loading indicator
        dispatch(actIsLoadingPostVerdict(false, postId));

        // act on the response
        if (response.message) {
            dispatch(actSuccessPostVerdict(postId, verdict));
        } else {
            dispatch(actFailedPostVerdict('Failed giving a post verdict'));
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
    }
}

// Verdict Reducers 
function actIsLoadingPostVerdict(isLoading, postId) {
    return { type: 'FEED_VERDICT_IS_LOADING', payload: { isLoading, postId } };
}

function actSuccessPostVerdict(postId, verdict) {
    return { type: 'FEED_VERDICT_SUCCESS', payload: { postId, verdict } };
}

function actFailedPostVerdict(error) {
    return { type: 'FEED_VERDICT_FAILED', payload: { error } };
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
    return { type: 'USER_BLOCK_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserBlock(userId) {
    return { type: 'USER_BLOCK_SUCCESS', payload: { userId } };
}

function actFailedUserBlock(error) {
    return { type: 'USER_BLOCK_FAILED', payload: { error } };
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
    return { type: 'USER_REPORT_IS_LOADING', payload: { isLoading } };
}

function actSuccessUserReport() {
    return { type: 'USER_REPORT_SUCCESS', payload: { } };
}

function actFailedUserReport(error) {
    return { type: 'USER_REPORT_FAILED', payload: { error } };
}

/**
 * Give a verdict to a user (follow/unfollow)
 * @param {Number} index = index where the friend suggestion is located
 * @param {Number} userId - user id to give verdict
 * @param {String} verdict - user verdict 'follow' or 'unfollow'
 * @param {String} pageLocation - page location
 */
export function actGiveUserVerdict(index, userId, verdict = 'follow', pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable follow/unfollow button
        dispatch(actIsLoadingUserVerdict(true, userId, index));

        // call the actual endpoint
        const response = verdict == 'follow'
            ? await followUser(userId)
            : await unfollowUser(userId);

        // hide loading indicator
        dispatch(actIsLoadingUserVerdict(false, userId, index));

        // act on the response
        if (response.message) {
            dispatch(actSuccessUserVerdict(userId, verdict, index));
        } else {
            dispatch(actFailedUserVerdict('Failed giving a post verdict', userId, index));
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
function actIsLoadingUserVerdict(isLoading, userId, index) {
    return { type: 'FEED_USER_VERDICT_IS_LOADING', payload: { isLoading, userId, index } };
}

function actSuccessUserVerdict(userId, verdict, index) {
    return { type: 'FEED_USER_VERDICT_SUCCESS', payload: { userId, verdict, index } };
}

function actFailedUserVerdict(error, userId, index) {
    return { type: 'FEED_USER_VERDICT_FAILED', payload: { error, userId, index } };
}

/**
 * Load a post item
 * @param {Number} postId - post id to give comment
 */
export function actLoadPostItem(postId) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingPostItem(postId, true));

        // call the actual endpoint
        const response = await loadPost(postId);

        // hide loading indicator
        dispatch(actIsLoadingPostItem(postId, false));

        // act on the response
        if (response.id) {
            dispatch(actSuccessPostItem(postId, response));
            setTimeout(() => {
                dispatch(actFailedPostItem(undefined));
            }, 100)
        } else {
            dispatch(actFailedPostItem('Failed loading a post item'));
        }
    }
}

// Load post item Reducers 
function actIsLoadingPostItem(postId, isLoading) {
    return { type: 'FEED_ITEM_IS_LOADING', payload: { postId, isLoading } };
}

function actSuccessPostItem(postId, postItem) {
    return { type: 'FEED_ITEM_SUCCESS', payload: { postId, postItem } };
}

function actFailedPostItem(error) {
    return { type: 'FEED_ITEM_FAILED', payload: { error } };
}

/**
 * Create a text comment
 * @param {Number} postId - post id to give comment
 * @param {String} comment - text comment
 * @param {String} pageLocation - page location
 */
export function actGivePostTextComment(postId, comment, pageLocation) {

    return async (dispatch) => {

        // show loading indicator or disable like/unlike button
        dispatch(actIsLoadingPostComment(true));

        // call the actual endpoint
        const response = await createTextComment(postId, comment);

        // hide loading indicator
        dispatch(actIsLoadingPostComment(false));

        // act on the response
        if (response.comment) {
            dispatch(actSuccessPostComment(postId, response.comment));
        } else {
            dispatch(actFailedPostComment('Failed giving a comment'));
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
 * @param {Number} postId - post id to give comment
 * @param {String} comment - text comment
 * @param {Object} preview - preview of the link
 * @param {[String]} urls - array of url
 * @param {String} pageLocation - page location
 */
export function actGivePostLinkComment(postId, comment, preview, urls, pageLocation) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingPostComment(true));

        const fs = RNFetchBlob.fs;
        let imagePath = null;
        let response;

        // call the actual endpoint
        if (_.includes(preview.url, 'giphy.com/media')) {
            // download the image first
            const gifUrl = preview.images[0].url;
            const data = await RNFetchBlob
                .config({ fileCache: true })
                .fetch("GET", gifUrl)
                .then(resp => {
                    imagePath = resp.path();
                    return resp.readFile("base64");
                })
                .then(base64Data => {
                    fs.unlink(imagePath);        
                    return `data:image/gif;base64,${base64Data}`;  
                });
            response = await createMediaComment(postId, comment, [data]);
        } else {
            response = await createLinkComment(postId, comment, preview, urls);
        }

        // hide loading indicator
        dispatch(actIsLoadingPostComment(false));

        // act on the response
        if (response.comment) {
            dispatch(actSuccessPostComment(postId, response.comment));
        } else {
            dispatch(actFailedPostComment('Failed giving a comment'));
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
 * @param {Number} postId - id of the post to comment
 * @param {String} comment - message
 * @param {[String]} images - array of base 64 strings
 * @param {String} pageLocation - page location
 */
export function actGivePostMediaComment(postId, comment, images, pageLocation) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingPostComment(true));

        // call the actual endpoint
        const response = await createMediaComment(postId, comment, images);

        // hide loading indicator
        dispatch(actIsLoadingPostComment(false));

        // act on the response
        if (response.comment) {
            dispatch(actSuccessPostComment(postId, response.comment));
        } else {
            dispatch(actFailedPostComment('Failed giving a comment'));
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
    return { type: 'FEED_COMMENT_ADD_MEDIA', payload: { postId, mediaItem } };
}

/**
 * Action to remove an attached media for a comment
 * @param {Number} index - index of the media item
 */
export function actRemoveCommentMedia(index) {
    return { type: 'FEED_COMMENT_REMOVE_MEDIA', payload: { index } };
}

/**
 * Action to reset selected media for a comment
 */
export function actResetCommentMedia() {
    return { type: 'FEED_COMMENT_RESET_MEDIA', payload: { } };
}

// Comment Reducers 
function actIsLoadingPostComment(isLoading) {
    return { type: 'FEED_COMMENT_IS_LOADING', payload: { isLoading } };
}

function actSuccessPostComment(postId, comment) {
    return { type: 'FEED_COMMENT_SUCCESS', payload: { postId, comment } };
}

function actFailedPostComment(error) {
    return { type: 'FEED_COMMENT_FAILED', payload: { error } };
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
    return { type: 'CREATE_POST_PREVIEW_IS_LOADING', payload: { postId, isLoading } };
}

function actSuccessCommentPreview(postId, preview) {
    return { type: 'CREATE_POST_PREVIEW_SUCCESS', payload: { postId, preview } };
}

export function actRemoveCommentPreview() {
    return { type: 'CREATE_POST_PREVIEW_FAILED', payload: {} };
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
        dispatch(actIsLoadingCommentVerdict(true, postId, commentId));

        // call the actual endpoint
        const response = verdict == 'like'
            ? await likeComment(commentId)
            : await unlikeComment(commentId);

        // hide loading indicator
        dispatch(actIsLoadingCommentVerdict(false, postId, commentId));

        // act on the response
        if (response.message) {
            dispatch(actSuccessCommentVerdict(postId, commentId, verdict));
        } else {
            dispatch(actFailedCommentVerdict('Failed giving a comment verdict'));
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
function actIsLoadingCommentVerdict(isLoading, postId, commentId) {
    return { type: 'FEED_COMMENT_VERDICT_IS_LOADING', payload: { isLoading, postId, commentId } };
}

function actSuccessCommentVerdict(postId, commentId, verdict) {
    return { type: 'FEED_COMMENT_VERDICT_SUCCESS', payload: { postId, commentId, verdict } };
}

function actFailedCommentVerdict(error) {
    return { type: 'FEED_COMMENT_VERDICT_FAILED', payload: { error } };
}

/**
 * Load Post Comments
 * @param {Number} postId - post id where the comment belongs
 * @param {Number} offset - number of total items already received
 * @param {Number} limit - max number of items
 */
export function actLoadPostComments(postId, offset = 0, limit = 25) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingPostComments(true, postId));

        // call the actual endpoint
        const response = await loadPostComments(postId, offset, limit)

        // hide loading indicator
        dispatch(actIsLoadingPostComments(false, postId));

        // act on the response
        if (response.comments) {
            dispatch(actSuccessPostComments(postId, response.comments));
        } else {
            dispatch(actFailedPostComments('Failed giving a comment verdict'));
        }
    }
}

// Load Post Comment Reducers 
function actIsLoadingPostComments(isLoading, postId) {
    return { type: 'FEED_POST_COMMENT_IS_LOADING', payload: { isLoading, postId } };
}

function actSuccessPostComments(postId, comments) {
    return { type: 'FEED_POST_COMMENT_SUCCESS', payload: { postId, comments } };
}

function actFailedPostComments(error) {
    return { type: 'FEED_POST_COMMENT_FAILED', payload: { error } };
}

// Action for gif selection
export function actAttachGifUrl(url, postId) {
    return { type: 'FEED_SET_GIF_URL', payload: { url, postId } };
} 

/**
 * Delete a Post
 * @param {Number} postId 
 * @param {String} postType 
 * @param {Boolean} postIsLegacy 
 */
export function actDeletePost(postId, postType, postIsLegacy) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingDeletePost(true, postId));

        // call the actual endpoint
        let response = await deletePost(postId, postType, postIsLegacy)

        // hide loading indicator
        dispatch(actIsLoadingDeletePost(false, postId));

        // act on the response
        if (response.message == true) {
            dispatch(actSuccessDeletePost(postId));
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedDeletePost(undefined));
            }, 0.25);
        } else {
            dispatch(actFailedDeletePost('Failed deleting the post'));
        }
    }
}

// Load Post Comment Reducers 
function actIsLoadingDeletePost(isLoading, postId) {
    return { type: 'FEED_POST_DELETE_IS_LOADING', payload: { isLoading, postId } };
}

function actSuccessDeletePost(postId) {
    return { type: 'FEED_POST_DELETE_SUCCESS', payload: { postId } };
}

function actFailedDeletePost(error) {
    return { type: 'FEED_POST_DELETE_FAILED', payload: { error } };
}

/**
 * Flag a Post
 * @param {Number} postId 
 * @param {String} postType 
 * @param {Boolean} postIsLegacy 
 */
export function actFlagPost(postId, postType, postIsLegacy) {

    return async (dispatch) => {

        // show loading indicator
        dispatch(actIsLoadingFlagPost(true, postId));

        // call the actual endpoint
        const response = await flagPost(postId, postType, postIsLegacy);

        // hide loading indicator
        dispatch(actIsLoadingFlagPost(false, postId));

        // act on the response
        if (response.message == true) {
            dispatch(actSuccessFlagPost(postId));
            // reset immediately
            setTimeout(() => {
                dispatch(actFailedFlagPost(undefined));
            }, 0.25);
        } else {
            dispatch(actFailedFlagPost('Failed flagging the post'));
        }
    }
}

// Load Post Comment Reducers 
function actIsLoadingFlagPost(isLoading, postId) {
    return { type: 'FEED_POST_FLAG_IS_LOADING', payload: { isLoading, postId } };
}

function actSuccessFlagPost(postId) {
    return { type: 'FEED_POST_FLAG_SUCCESS', payload: { postId } };
}

function actFailedFlagPost(error) {
    return { type: 'FEED_POST_FLAG_FAILED', payload: { error } };
}