/*
 * Created by Justice on Thu Nov 05 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import RNFetchBlob from "rn-fetch-blob";
import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';

import { 
    AnalyticsEvents,
    createTextPost, createLinkPost, createMediaPost, 
    loadUrlPreview 
} from 'app/api/index';

/**
 * Create a text post
 * @param {String} message - text comment
 */
export function actCreateTextPost(message) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingCreatePost(true));

        // call the actual endpoint
        const response = await createTextPost(message);

        // hide loading indicator
        dispatch(actIsLoadingCreatePost(false));

        // act on the response
        if (response.post) {
            dispatch(actSuccessCreatePost(response.post));
        } else {
            dispatch(actFailedCreatePost('Failed creating a post'));
        }

        // clear state
        setTimeout(() => {
            dispatch(actResetCreatePost());
        }, 0.5);

        // call analytics event
        if (response.post != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.POST_SUBMITTED, 
                response.post
            )
        }
    }
}

/**
 * Create a link post
 * @param {String} message - text comment
 * @param {Object} preview - preview of the link
 * @param {[String]} urls - array of url
 */
export function actCreateLinkPost(message, preview, urls) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingCreatePost(true));

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
            response = await createMediaPost(message, [data]);
        } else {
            response = await createLinkPost(message, preview, urls);
        }

        // hide loading indicator
        dispatch(actIsLoadingCreatePost(false));

        // act on the response
        if (response.post) {
            dispatch(actSuccessCreatePost(response.post));
        } else {
            dispatch(actFailedCreatePost('Failed creating a post'));
        }

        // clear state
        setTimeout(() => {
            dispatch(actResetCreatePost());
        }, 0.5);

        // call analytics event
        if (response.post != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.POST_SUBMITTED, 
                response.post
            )
        }
    }
}

/**
 * Create a media post
 * @param {String} message - text comment
 * @param {[String]} images - array of base 64 strings
 */
export function actCreateMediaPost(message, images) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingCreatePost(true));

        // call the actual endpoint
        const response = await createMediaPost(message, images);

        // hide loading indicator
        dispatch(actIsLoadingCreatePost(false));

        // act on the response
        if (response.post) {
            dispatch(actSuccessCreatePost(response.post));
        } else {
            dispatch(actFailedCreatePost('Failed creating a post'));
        }

        // clear state
        setTimeout(() => {
            dispatch(actResetCreatePost());
        }, 0.5);

        // call analytics event
        if (response.post != undefined) {
            await analytics().logEvent(
                AnalyticsEvents.POST_SUBMITTED, 
                response.post
            )
        }
    }
}

/**
 * Cancel post creation
 */
export function actCancelCreatePost() {
    return async (dispatch) => {
        dispatch(actResetCreatePost());
    }
}

// Create Post Reducers (pls refer to feedReducers)
function actIsLoadingCreatePost(isLoading) {
    return { type: 'CREATE_POST_IS_LOADING', payload: { isLoading } };
}

function actSuccessCreatePost(post) {
    return { type: 'CREATE_POST_SUCCESS', payload: { post } };
}

function actFailedCreatePost(error) {
    return { type: 'CREATE_POST_FAILED', payload: { error } };
}

function actResetCreatePost(error) {
    return { type: 'CREATE_POST_RESET', payload: { error } };
}

/**
 * Create a link preview
 * @param {String} urls - url where to get preview
 */
export function actCreateLinkPreview(url) {

    return async (dispatch) => {

        // show loading indicator 
        dispatch(actIsLoadingCreatePostPreview(true));

        // call the actual endpoint
        const response = await loadUrlPreview(url);

        // hide loading indicator
        dispatch(actIsLoadingCreatePostPreview(false));

        // act on the response
        if (response.title) {
            dispatch(actSuccessCreatePostPreview(response));
        } else {
            dispatch(actRemoveCreatePostPreview());
        }
    }
}

// Create Post Preview Reducers (pls refer to feedReducers)
function actIsLoadingCreatePostPreview(isLoading) {
    return { type: 'CREATE_POST_PREVIEW_IS_LOADING', payload: { isLoading } };
}

function actSuccessCreatePostPreview(preview) {
    return { type: 'CREATE_POST_PREVIEW_SUCCESS', payload: { preview } };
}

export function actRemoveCreatePostPreview() {
    return { type: 'CREATE_POST_PREVIEW_FAILED', payload: { } };
}

// Create Post Media Reducers (pls refer to feedReducers)
export function actAddPostMedia(mediaItem) {
    return { type: 'CREATE_POST_ADD_MEDIA', payload: { mediaItem } };
}

/**
 * Action to remove an attached media 
 * @param {Number} index - index of the media item
 */
export function actRemovePostMedia(index) {
    return { type: 'CREATE_POST_REMOVE_MEDIA', payload: { index } };
}