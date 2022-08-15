/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import ApiRequest from './../manager';
import EmbedlyRequest from './../manager/embedly';

import { Constants } from './../manager/constant';

/**
 * Load a list of public feed data
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 * @param {Number} since - current timeslot (useful for checking post updates)
 */
export async function loadUserFeed(offset = 0, limit = 25, since) {
    let params = `?offset=${offset}&limit=${limit}`;
    if (since) {
        params = `${params}&since=${since}`;
    }
    return await ApiRequest(Constants.USER_FEED_POSTS_URL + params, 'GET');
}

/**
 * Load a list of user posts
 * @param {Number} uid - user id
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function loadUserPosts(uid, offset = 0, limit = 25) {
    const params = `?offset=${offset}&limit=${limit}&uid=${uid}`;
    return await ApiRequest(Constants.USER_PROFILE_POSTS_URL + params, 'GET');
}

/**
 * Load a list of user media
 * @param {Number} uid - user id
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function loadUserMedia(uid, offset = 0, limit = 25) {
    const params = `?offset=${offset}&limit=${limit}&uid=${uid}`;
    return await ApiRequest(Constants.USER_PROFILE_MEDIA_URL + params, 'GET');
}

/**
 * Load a list post comments
 * @param {Number} pid - post id
 * @param {Number} offset - total items already received (defaults to 0 as first page)
 * @param {Number} limit - number of items per page (defaults to 25 items)
 */
export async function loadPostComments(pid, offset = 0, limit = 25) {
    const params = `?offset=${offset}&limit=${limit}&pid=${pid}&type=text&is_legacy=0`;
    return await ApiRequest(Constants.POST_COMMENTS_URL + params, 'GET');
}

/**
 * Load a post 
 * @param {Number} postId - id of the post to load
 */
export async function loadPost(postId) {
    const params = `?pid=${postId}`
    return await ApiRequest(Constants.POST_LOAD + params, 'GET');
}

/**
 * Like a post 
 * @param {Number} postId - id of the post to like
 */
export async function likePost(postId) {
    const payload = { pid: postId };
    return await ApiRequest(Constants.POST_LIKE, 'POST', payload);
}

/**
 * Unlike a post 
 * @param {Number} postId - id of the post to unlike
 */
export async function unlikePost(postId) {
    const payload = { pid: postId };
    return await ApiRequest(Constants.POST_UNLIKE, 'POST', payload);
}

/**
 * Create a text comment
 * @param {Number} postId - id of the post to comment
 * @param {String} comment - message
 */
export async function createTextComment(postId, comment) {
    const payload = { pid: postId, type: "text", body: comment };
    return await ApiRequest(Constants.COMMENT_CREATE, 'POST', payload);
}

/**
 * Create a link comment
 * @param {Number} postId - id of the post to comment
 * @param {String} comment - message
 * @param {Object} preview - preview of the link
 * @param {[String]} urls - array of urls
 */
export async function createLinkComment(postId, comment, preview, urls) {
    const payload = { pid: postId, type: "link", body: comment, preview, links: urls };
    return await ApiRequest(Constants.COMMENT_CREATE, 'POST', payload);
}

/**
 * Create a media comment
 * @param {Number} postId - id of the post to comment
 * @param {String} comment - message
 * @param {[String]} images - array of base 64 strings
 */
export async function createMediaComment(postId, comment, images) {
    const payload = { pid: postId, type: "photo", body: comment, images };
    return await ApiRequest(Constants.COMMENT_CREATE, 'POST', payload);
}

/**
 * Like a comment 
 * @param {Number} commentId - id of the comment to like
 */
export async function likeComment(commentId) {
    const payload = { cid: commentId };
    return await ApiRequest(Constants.COMMENT_LIKE, 'POST', payload);
}

/**
 * Unlike a comment 
 * @param {Number} commentId - id of the comment to unlike
 */
export async function unlikeComment(commentId) {
    const payload = { cid: commentId };
    return await ApiRequest(Constants.COMMENT_UNLIKE, 'POST', payload);
}

/**
 * Create a text post
 * @param {String} message - post body
 */
export async function createTextPost(message) {
    const payload = { type: "text", body: message };
    return await ApiRequest(Constants.POST_CREATE, 'POST', payload);
}

/**
 * Create a link post
 * @param {String} message - post body
 * @param {Object} preview - preview object from embedly
 * @param {[String]} urls - array of links
 */
export async function createLinkPost(message, preview, urls) {
    const payload = { type: "link", body: message, preview, links: urls };
    return await ApiRequest(Constants.POST_CREATE, 'POST', payload);
}

/**
 * Create a media post
 * @param {String} message - post body
 * @param {[String]} images - array of base 64 strings
 */
export async function createMediaPost(message, images) {
    const payload = { type: "photo", body: message, images};
    return await ApiRequest(Constants.POST_CREATE, 'POST', payload);
}

/**
 * Load URL Open Graph Data
 * @param {String} url 
 */
export async function loadUrlPreview(url) {
    return await EmbedlyRequest(url);
}

/**
 * Delete a post
 * @param {Number} postId 
 * @param {String} postType 
 * @param {Boolean} postIsLegacy 
 */
export async function deletePost(postId, postType, postIsLegacy) {
    const payload = { pid: postId, type: postType, is_legacy: postIsLegacy };
    return await ApiRequest(Constants.POST_DELETE, 'POST', payload);
}

/**
 * Flag a post
 * @param {Number} postId 
 * @param {String} postType 
 * @param {Boolean} postIsLegacy 
 */
export async function flagPost(postId, postType, postIsLegacy) {
    const payload = { pid: postId, type: postType, is_legacy: postIsLegacy };
    return await ApiRequest(Constants.POST_FLAG, 'POST', payload);
}