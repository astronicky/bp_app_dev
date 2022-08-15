/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash';
import moment from 'moment';
import Link from 'app/features/shared/link/components/index';
import { browserDefaults } from 'app/features/auth/login/reducers/defaults'

function abbreviateNumber(number) {
    var SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
    var tier = Math.log10(Math.abs(number)) / 3 | 0;
    if(tier == 0) return number;
    var postfix = SI_POSTFIXES[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    var formatted = scaled.toFixed(1) + '';
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2);
    return formatted + postfix;
}

export default function feed(state = browserDefaults, action) {
    switch (action.type) {
        case 'FEED_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            // always reset the state of error and success
            return {
                ...state, isLoading, success: undefined, error: undefined
            };
        }
        case 'FEED_IS_RELOADING': {
            const isReloading = action.payload.isReloading || false;
            // always reset the state of error and success
            return {
                ...state, refreshing: isReloading, requestOffsets: [], success: undefined, error: undefined
            };
        }
        case 'FEED_SET_DATA': {
            const { posts, total, offset, limit, since, requestOffset } = action.payload
            const { browserProps } = state
            
            const requestOffsets = state.requestOffsets ?? []
            if (requestOffsets.includes(requestOffset)) {
                return {
                    ...state
                }
            } else {
                requestOffsets.push(requestOffset)
            }

            posts.map(item => {
                // modify post date
                item.datePosted = moment.unix(item.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                item.datePostedTimeAgo = moment(item.datePosted, "MMMM Do YYYY, h:mm:ss a").fromNow()

                // set ui tags
                item.postTag1 = item.id + 1001
                item.postTag2 = item.id + 2001
                item.postTag3 = item.id + 3001

                // modify comments date
                item.comments.map(comment => {
                    comment.commentPosted = moment.unix(comment.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                    comment.commentPostedTimeAgo = moment(comment.commentPosted, "MMMM Do YYYY, h:mm:ss a").fromNow()
                    return comment
                })

                if (item.post_counts != undefined && item.post_counts.likes != undefined) {
                    item.post_counts.likesDesc = item.post_counts.likesDesc != 0 ? abbreviateNumber(item.post_counts.likes) : '0'
                }

                // modify post body
                if (item.type == 'link') {
                    const message = item.body || ''

                    // Split the content on space characters
                    var words = message.split(/\s/);
                    var hasLink = false

                    // Loop through the words
                    var contents = words.map(function (word, i) {
                        // Space if the word isn't the very last in the set, thus not requiring a space after it
                        var separator = i < (words.length - 1) ? ' ' : '';
                        // The word is a URL, return the URL wrapped in a custom <Link> component
                        if (word.match(/^https?\:\//)) {
                            hasLink = true
                            return <Link key={i} url={word} browserProps={browserProps}>{word}{separator}</Link>;
                            // The word is not a URL, return the word as-is
                        } else {
                            hasLink = true
                            return word + separator;
                        }
                    });

                    item.messageContents = hasLink ? contents : undefined
                }

                return item
            });

            // add suggestion item
            const index = offset / limit
            const hasSuggestions = (state.suggestions ?? []).length != 0
            if (hasSuggestions) {
                const users = state.suggestions[index]
                const id = posts.length + 1
                if (users) {
                    const suggestion = { isSuggestionItem: true, id, index, users }
                    posts.push(suggestion)
                }
            }

            return {
                ...state, totalPostsCount: total, since, requestOffsets,
                posts: offset !== 0 
                    ? [...state.posts || [], ...posts]
                    : posts
            }
        }
        case 'FEED_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, isLoading: false, success: false, error
            }
        }
        case 'FEED_RELOAD_DATA': {
            const { posts, total, since } = action.payload
            const { browserProps } = state

            posts.map(item => {
                // modify post date
                item.datePosted = moment.unix(item.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                item.datePostedTimeAgo = moment(item.datePosted, "MMMM Do YYYY, h:mm:ss a").fromNow()

                // set ui tags
                item.postTag1 = item.id + 1001
                item.postTag2 = item.id + 2001
                item.postTag3 = item.id + 3001

                // modify comments date
                item.comments.map(comment => {
                    comment.commentPosted = moment.unix(comment.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                    comment.commentPostedTimeAgo = moment(comment.commentPosted, "MMMM Do YYYY, h:mm:ss a").fromNow()
                    return comment
                })

                if (item.post_counts != undefined && item.post_counts.likes != undefined) {
                    item.post_counts.likesDesc = item.post_counts.likesDesc != 0 ? abbreviateNumber(item.post_counts.likes) : '0'
                }

                // modify post body
                if (item.type == 'link') {
                    const message = item.body || ''

                    // Split the content on space characters
                    var words = message.split(/\s/);
                    var hasLink = false

                    // Loop through the words
                    var contents = words.map(function (word, i) {
                        // Space if the word isn't the very last in the set, thus not requiring a space after it
                        var separator = i < (words.length - 1) ? ' ' : '';
                        // The word is a URL, return the URL wrapped in a custom <Link> component
                        if (word.match(/^https?\:\//)) {
                            hasLink = true
                            return <Link key={i} url={word} browserProps={browserProps}>{word}{separator}</Link>;
                            // The word is not a URL, return the word as-is
                        } else {
                            hasLink = true
                            return word + separator;
                        }
                    });

                    item.messageContents = hasLink ? contents : undefined
                }

                return item
            });

            return {
                ...state, totalUpdatedPostsCount: total, since,
                updatedPosts: posts
            }
        }
        case 'FEED_DISPLAY_UPDATED_DATA': {
            const updatedPosts = state.updatedPosts ?? []
            const totalUpdatedPostsCount = state.totalUpdatedPostsCount ?? 0

            return {
                ...state,
                posts: updatedPosts,
                totalPostsCount: totalUpdatedPostsCount,
                updatedPosts: [], 
                totalUpdatedPostsCount: 0
            }
        }
        case 'FEED_FRIEND_SUGGESTIONS_IS_LOADING': {
            const isLoading = action.payload.isLoading || false
            return {
                ...state,
                suggestionsIsLoading: isLoading
            }
        }
        case 'FEED_FRIEND_SUGGESTIONS_SET_DATA': {
            const { suggestions } = action.payload
            return {
                ...state, suggestions: _.chunk(suggestions, 10),
                suggestionsSuccess: true, suggestionsEror: undefined
            }
        }
        case 'FEED_FRIEND_SUGGESTIONS_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state,
                suggestionsSuccess: false, suggestionsEror: error
            }
        }
        case 'FEED_FRIEND_SUGGESTIONS_RESET': {
            return {
                ...state,
                suggestions: []
            }
        }
        case 'FEED_USER_VERDICT_IS_LOADING': {
            const { userId, index } = action.payload
            const isVerdictLoading = action.payload.isLoading || false

            let posts = (state.posts || [])
            let userIndex 

            if (index) {
                const users = posts[index].users ?? []
                userIndex = _.findIndex(users, { id: userId })
            }
            
            return {
                ...state, 
                posts: state.posts.map(
                    (post, i) => i === index && post.isSuggestionItem == true
                        ? { ...post, users: post.users.map((user, j) =>
                            j == userIndex
                                ? { ...user, isVerdictLoading }
                                : user
                            )
                        }
                        : post
                )
            }
        }
        case 'FEED_USER_VERDICT_SUCCESS': {
            const { verdict, userId, index } = action.payload
            const isFollowing = verdict == 'follow' ? true : false

            let posts = (state.posts || [])
            let userIndex 

            if (index) {
                const users = posts[index].users ?? []
                userIndex = _.findIndex(users, { id: userId })
            }

            return {
                ...state, 
                posts: state.posts.map(
                    (post, i) => i === index && post.isSuggestionItem == true
                        ? { ...post, users: post.users.map((user, j) =>
                            j == userIndex
                                ? { ...user, following: isFollowing }
                                : user
                            )
                        }
                        : post
                )
            }
        }
        case 'FEED_USER_VERDICT_FAILED': {
            const { userId, index, error } = action.payload

            let posts = (state.posts || [])
            let userIndex 

            if (index) {
                const users = posts[index].users ?? []
                userIndex = _.findIndex(users, { id: userId })
            }

            return {
                ...state, 
                posts: state.posts.map(
                    (post, i) => i === index && post.isSuggestionItem == true
                        ? { ...post, users: post.users.map((user, j) =>
                            j == userIndex
                                ? { ...user, error }
                                : user
                            )
                        }
                        : post
                )
            }
        }
        case 'FEED_ITEM_IS_LOADING': {
            const { postId } = action.payload
            const isLoading = action.payload.isLoading || false

            let posts = (state.postItems || [])
            let index = _.findIndex(posts, { id: postId })

            if (index === -1) {
                return {
                    ...state, postItemSuccess: undefined, postItemError: undefined,
                    postItems: [
                        ...posts,
                        { id: postId, isLoading }
                    ]
                }
            }

            // always reset the state of error and success
            return {
                ...state, postItemSuccess: undefined, postItemError: undefined,
                postItems: posts.map(
                    (post, i) => i === index
                        ? { id: postId, isLoading }
                        : post
                )
            };
        }
        case 'FEED_ITEM_SUCCESS': {
            const { postItem, postId } = action.payload

            if (postItem.created_gmt_ts != undefined) {
                postItem.datePosted = moment.unix(postItem.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                postItem.datePostedTimeAgo = moment(postItem.datePosted, "MMMM Do YYYY, h:mm:ss a").fromNow()
            }

            if (postItem.post_counts != undefined && postItem.post_counts.likes != undefined) {
                postItem.post_counts.likesDesc = postItem.post_counts.likesDesc != 0 ? abbreviateNumber(postItem.post_counts.likes) : '0'
            }

            let posts = (state.postItems || [])
            let index = _.findIndex(posts, { id: postId })

            if (index == -1) {
                return {
                    ...state, postItemSuccess: true, postItemError: undefined,
                    postItems: [
                        ...state.postItems,
                        postItem
                    ]
                }
            }

            return {
                ...state, postItemSuccess: true, postItemError: undefined,
                postItems: posts.map(
                    (post, i) => i === index
                        ? { ...postItem, ...post }
                        : post
                )
            }
        }
        case 'FEED_ITEM_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, postItemSuccess: undefined, postItemError: error
            }
        }
        case 'FEED_VERDICT_IS_LOADING': {
            const { postId } = action.payload
            const isVerdictLoading = action.payload.isLoading || false

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            // always reset the state of error and success
            return {
                ...state, isVerdictLoading, verdictSuccess: undefined, verdictError: undefined,
                posts: state.posts.map(
                    (post, i) => i === index
                        ? { ...post, isVerdictLoading }
                        : post
                )
            };
        }
        case 'FEED_VERDICT_SUCCESS': {
            const { postId, verdict } = action.payload

            const liked = verdict == 'like'

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            let postViewer, postCounts

            if (index !== -1) {
                let updatedPost = posts[index]
                postViewer = updatedPost.viewer || {}
                postCounts = updatedPost.post_counts || {}

                // update is post liked by the viewer
                postViewer.liked_this = liked

                // compute total likes
                let likesCount = (postCounts.likes || 0)
                if (liked) {
                    likesCount = likesCount + 1
                } else {
                    likesCount = likesCount - 1
                }

                // update likes count
                postCounts.likes = likesCount
                postCounts.likesDesc = likesCount != 0 ? abbreviateNumber(likesCount) : '0'
            }

            return {
                ...state, verdictSuccess: true, verdictError: undefined,
                posts: state.posts.map(
                    (post, i) => i === index
                        ? { ...post, viewer: postViewer, post_counts: postCounts }
                        : post
                )
            }
        }
        case 'FEED_VERDICT_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, verdictSuccess: undefined, verdictError: error
            }
        }
        case 'FEED_COMMENT_VERDICT_IS_LOADING': {
            const { postId, commentId } = action.payload
            const isCommentVerdictLoading = action.payload.isLoading || false

            // extract post index
            let posts = state.posts || []
            let postIndex = _.findIndex(posts, { id: postId })
            let commentIndex

            if (postIndex !== -1) {
                // find the post first then find the comment
                let comments = posts[postIndex].comments || []
                commentIndex = _.findIndex(comments, { id: commentId })
            }

            // update post and comment item
            return {
                ...state,
                posts: state.posts.map(
                    (post, i) => i === postIndex
                        ? {
                            ...post, comments: post.comments.map(
                                (comment, j) => j === commentIndex
                                    ? { ...comment, isCommentVerdictLoading }
                                    : comment
                            )
                        }
                        : post
                )
            };
        }
        case 'FEED_COMMENT_VERDICT_SUCCESS': {
            const { postId, commentId, verdict } = action.payload

            const liked = verdict == 'like'

            // extract post index
            let posts = state.posts || []
            let postIndex = _.findIndex(posts, { id: postId })
            let commentIndex, commentViewer, commentCounts

            if (postIndex !== -1) {
                // find the post first then find the comment
                let comments = posts[postIndex].comments || []
                commentIndex = _.findIndex(comments, { id: commentId })

                if (commentIndex !== -1) {
                    let updatedComment = comments[commentIndex]
                    commentViewer = updatedComment.viewer || {}
                    commentCounts = updatedComment.comment_counts || {}

                    // update is post liked by the viewer
                    commentViewer.liked_this = liked

                    // compute total likes
                    let likesCount = (commentCounts.likes || 0)
                    if (liked) {
                        likesCount = likesCount + 1
                    } else {
                        likesCount = likesCount - 1
                    }

                    // update likes count
                    commentCounts.likes = likesCount
                }
            }

            // update post and comment item
            return {
                ...state,
                posts: state.posts.map(
                    (post, i) => i === postIndex
                        ? {
                            ...post, comments: post.comments.map(
                                (comment, j) => j === commentIndex
                                    ? { ...comment, viewer: commentViewer, comment_counts: commentCounts }
                                    : comment
                            )
                        }
                        : post
                )
            };
        }
        case 'FEED_COMMENT_VERDICT_FAILED': {
            const { postId, commentId } = action.payload
            const error = action.payload.error || 'Failed Loading Data'

            // extract post index
            let posts = state.posts || []
            let postIndex = _.findIndex(posts, { id: postId })
            let commentIndex

            if (postIndex !== -1) {
                // find the post first then find the comment
                let comments = posts[postIndex].comments || []
                commentIndex = _.findIndex(comments, { id: commentId })
            }

            // update post and comment item
            return {
                ...state,
                posts: state.posts.map(
                    (post, i) => i === postIndex
                        ? {
                            ...post, comments: post.comments.map(
                                (comment, j) => j === commentIndex
                                    ? { ...comment, isCommentVerdictLoading, error }
                                    : comment
                            )
                        }
                        : post
                )
            };
        }
        case 'FEED_COMMENT_IS_LOADING': {
            const isCommentLoading = action.payload.isLoading || false
            // always reset the state of error and success
            return {
                ...state, isCommentLoading, commentSuccess: undefined, commentError: undefined
            };
        }
        case 'FEED_COMMENT_SUCCESS': {
            const { postId, comment } = action.payload

            // update comment date
            comment.commentPosted = moment.unix(comment.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
            comment.commentPostedTimeAgo = moment(comment.commentPosted, "MMMM Do YYYY, h:mm:ss a").fromNow()

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            let postItems = (state.postItems || [])
            let postItemIndex = _.findIndex(postItems, { id: postId })

            let comments = []
            let postCounts

            if (index !== -1) {
                let updatedPost = posts[index]
                comments = updatedPost.comments || []

                // update comments
                comments.push(comment)

                // update post counts
                postCounts = updatedPost.post_counts || {}

                // compute total comments 
                let commentsCount = (postCounts.comments || 0)
                commentsCount = commentsCount + 1

                // update comments count
                postCounts.comments = commentsCount
            }

            return {
                ...state, commentSuccess: true, commentError: undefined,
                posts: state.posts.map(
                    (post, i) => i === index
                        ? { ...post, comments, post_counts: postCounts }
                        : post
                ),
                postItems: (state.postItems ?? []).map(
                    (post, i) => i === postItemIndex
                        ? { ...post, comments, post_counts: postCounts }
                        : post
                )
            }
        }
        case 'FEED_COMMENT_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, commentSuccess: undefined, commentError: error
            }
        }
        case 'FEED_POST_DELETE_IS_LOADING': {
            const { postId } = action.payload
            const isDeletePostLoading = action.payload.isLoading || false

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            // always reset the state of error and success
            return {
                ...state, isDeletePostLoading, deletePostSuccess: undefined, deletePostError: undefined,
                posts: state.posts.map(
                    (post, i) => i === index
                        ? { ...post, isDeletePostLoading }
                        : post
                )
            };
        }
        case 'FEED_POST_DELETE_SUCCESS': {
            const { postId } = action.payload

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            return {
                ...state, deletePostSuccess: true, deletePostError: undefined,
                posts: [
                    ...state.posts.slice(0, index),
                    ...state.posts.slice(index + 1)
                ]
            }
        }
        case 'FEED_POST_DELETE_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, deletePostSuccess: undefined, deletePostError: error
            }
        }
        case 'FEED_POST_FLAG_IS_LOADING': {
            const { postId } = action.payload
            const isFlagPostLoading = action.payload.isLoading || false

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            // always reset the state of error and success
            return {
                ...state, isFlagPostLoading, flagPostSuccess: undefined, flagPostError: undefined,
                posts: state.posts.map(
                    (post, i) => i === index
                        ? { ...post, isFlagPostLoading }
                        : post
                )
            };
        }
        case 'FEED_POST_FLAG_SUCCESS': {
            const { postId } = action.payload

            let posts = (state.posts || [])
            let index = _.findIndex(posts, { id: postId })

            return {
                ...state, flagPostSuccess: true, flagPostError: undefined,
                posts: [
                    ...state.posts.slice(0, index),
                    ...state.posts.slice(index + 1)
                ]
            }
        }
        case 'FEED_POST_FLAG_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, flagPostSuccess: undefined, flagPostError: error
            }
        }
        case 'CREATE_POST_IS_LOADING': {
            const isCreatePostLoading = action.payload.isLoading || false
            // always reset the state of error and success
            return {
                ...state, isCreatePostLoading, createPostSuccess: undefined, createPostError: undefined
            };
        }
        case 'CREATE_POST_SUCCESS': {
            const { post } = action.payload

            // modify post date
            post.datePosted = moment.unix(post.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
            post.datePostedTimeAgo = moment(post.datePosted, "MMMM Do YYYY, h:mm:ss a").fromNow()

            // set ui tags
            post.postTag1 = post.id + 1001
            post.postTag2 = post.id + 2001
            post.postTag3 = post.id + 3001

            return {
                ...state, createPostSuccess: true, createPostError: undefined,
                posts: [post, ...state.posts]
            }
        }
        case 'CREATE_POST_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, createPostSuccess: undefined, createPostError: error
            }
        }
        case 'CREATE_POST_RESET': {
            return { ...state, isCreatePostLoading: undefined, createPostSuccess: undefined, createPostError: undefined, createPostPreview: undefined, media: [] }
        }
        case 'CREATE_POST_PREVIEW_IS_LOADING': {
            const isCreatePreviewLoading = action.payload.isLoading || false
            // always reset the state of error and success
            return {
                ...state, isCreatePreviewLoading
            };
        }
        case 'CREATE_POST_PREVIEW_SUCCESS': {
            const { preview, postId } = action.payload

            // modify preview object
            // { description, images, media, provider, title, type, url }
            // { provider.name, provider.displayName, provider.faviconUrl, provider.url }

            // quick fix for giphy attachment that has no favicon_url
            if (preview.provider_name == 'GIPHY' && preview.favicon_url == undefined) {
                preview.favicon_url = 'https://giphy.com/static/img/favicon.png'
            }

            return {
                ...state, createPostPreview: {
                    postId,
                    description: preview.description || '',
                    images: preview.images || [],
                    media: preview.media || [],
                    title: preview.title || '',
                    type: preview.type || '',
                    url: preview.url || '',
                    provider: {
                        name: preview.provider_name,
                        displayName: preview.provider_display,
                        faviconUrl: preview.favicon_url,
                        url: preview.provider_url
                    }
                }
            }
        }
        case 'CREATE_POST_PREVIEW_FAILED': {
            return {
                ...state, createPostPreview: undefined
            }
        }
        case 'CREATE_POST_ADD_MEDIA': {
            const { mediaItem } = action.payload
            const updatedItem = `data:image/jpeg;base64,${mediaItem}`
            const oldMedia = state.media || []
            return {
                ...state, media: [...oldMedia, updatedItem]
            }
        }
        case 'CREATE_POST_REMOVE_MEDIA': {
            const { index } = action.payload
            return {
                ...state,
                media: [
                    ...state.media.slice(0, index),
                    ...state.media.slice(index + 1)
                ]
            }
        }
        case 'FEED_COMMENT_ADD_MEDIA': {
            const { postId, mediaItem } = action.payload
            const updatedItem = `data:image/jpeg;base64,${mediaItem}`
            const oldMedia = state.commentMedia?.items || []
            return {
                ...state, 
                commentMedia: {
                    postId,
                    items:  [...oldMedia, updatedItem], 
                }
            }
        }
        case 'FEED_COMMENT_REMOVE_MEDIA': {
            const { index } = action.payload
            return {
                ...state,
                commentMedia: {
                    ...state.commentMedia,
                    items: [
                        ...state.commentMedia?.items.slice(0, index),
                        ...state.commentMedia?.items.slice(index + 1)
                    ]
                }
            }
        }
        case 'FEED_COMMENT_RESET_MEDIA': {
            return {
                ...state,
                commentMedia:  {
                    items: [], 
                    postId: undefined
                }
            }
        }
        case 'FEED_POST_COMMENT_IS_LOADING': {
            const { postId } = action.payload
            const isLoading = action.payload.isLoading || false

            // extract post index
            let posts = state.posts || []
            let postIndex = _.findIndex(posts, { id: postId })

            // update post and comment item
            return {
                ...state,
                posts: state.posts.map(
                    (post, i) => i === postIndex
                        ? { ...post, isLoading }
                        : post
                )
            };
        }
        case 'FEED_POST_COMMENT_SUCCESS': {
            const { postId, comments } = action.payload

            // modify comments date
            comments.map(comment => {
                comment.commentPosted = moment.unix(comment.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                comment.commentPostedTimeAgo = moment(comment.commentPosted, "MMMM Do YYYY, h:mm:ss a").fromNow()
                return comment
            })

            // extract post index
            let posts = state.posts || []
            let postIndex = _.findIndex(posts, { id: postId })

            let postItems = state.postItems || []
            let postItemIndex = _.findIndex(postItems, { id: postId })

            // update post and comment item
            return {
                ...state,
                posts: state.posts.map(
                    (post, i) => i === postIndex
                        ? { ...post, comments: comments }
                        : post
                ),
                postItems: (state.postItems ?? []).map(
                    (post, i) => i === postItemIndex
                        ? { ...post, comments: comments }
                        : post
                )
            };
        }
        case 'FEED_POST_COMMENT_FAILED': {
            const { postId, error } = action.payload

            // extract post index
            let posts = state.posts || []
            let postIndex = _.findIndex(posts, { id: postId })

            // update post and comment item
            return {
                ...state,
                posts: state.posts.map(
                    (post, i) => i === postIndex
                        ? { ...post, error }
                        : post
                )
            };
        }
        case 'FEED_SET_GIF_URL': {
            const { url, postId } = action.payload
            return {
                ...state,
                gifAttachmentUrl: url,
                gifAttachmentPostId: postId
            }
        }
        case 'USER_REPORT_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state, reportIsLoading: isLoading, reportSuccess: undefined, reportError: undefined
            };
        }
        case 'USER_REPORT_SUCCESS': {
            return {
                ...state, reportSuccess: true, reportError: undefined
            };
        }
        case 'USER_REPORT_FAILED': {
            const { error } = action.payload
            return {
                ...state, reportSuccess: undefined, reportError: error
            };
        }
        case 'USER_BLOCK_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state, blockIsLoading: isLoading, blockSuccess: undefined, blockError: undefined
            };
        }
        case 'USER_BLOCK_SUCCESS': {
            return {
                ...state, blockSuccess: true, blockError: undefined
            };
        }
        case 'USER_BLOCK_FAILED': {
            const { error } = action.payload
            return {
                ...state, blockSuccess: undefined, blockError: error
            };
        }
        default: {
            return state
        }
    }
}