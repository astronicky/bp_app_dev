/*
 * Created by Justice on Wed Nov 11 2020
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

export default function profile(state = browserDefaults, action) {
    switch (action.type) {
        case 'PROFILE_SET_USER': {
            const { user } = action.payload
            return { ...state, userId: user.id, userName: user.username, avatar: user.avatar ?? {} };
        }
        case 'PROFILE_SET_USER_TOKEN': {
            const { token } = action.payload;
            return { ...state, userToken: token };
        }
        case 'PROFILE_OTHER_USER_IS_LOADING': {
            const isLoading = action.payload.otherUserIsLoading || false;
            // always reset the state of error and success
            return {
                ...state, otherUserIsLoading: isLoading, otherUser: undefined
            };
        }
        case 'PROFILE_OTHER_USER_SET_DATA': {
            const { newUser } = action.payload
            let index = _.findIndex((state.users || []), { id: newUser.id });

            if (newUser.counts) {
                const followers = newUser.counts.followers
                const following = newUser.counts.following
                const posts = newUser.counts.posts

                if (followers != undefined) {
                    newUser.counts.followersDesc = followers > 0 ? abbreviateNumber(followers) : 0
                }

                if (following != undefined) {
                    newUser.counts.followingDesc = followers > 0 ? abbreviateNumber(following) : 0
                }

                if (posts != undefined) {
                    newUser.counts.postsDesc = followers > 0 ? abbreviateNumber(posts) : 0
                }
            }

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state, users: [...state.users || [], newUser]
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? newUser
                        : user
                )
            }
        }
        case 'PROFILE_OTHER_UPDATE_USER_SET_DATA': {
            const { userData } = action.payload
            let index = _.findIndex((state.users || []), { id: userData.id });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? {...user, ...userData}
                        : user
                )
            }
        }
        case 'PROFILE_OTHER_USER_IS_RELOADING': {
            const isReloading = action.payload.isReloading || false;
            // always reset the state of error and success
            return {
                ...state, otherUserIsReloading: isReloading
            };
        }
        case 'PROFILE_COVER_PIC_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, coverPicIsLoading: isLoading }
                        : user
                )
            }
        }
        case 'PROFILE_COVER_PIC_SET_SUCCESS': {
            const { cover } = action.payload
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, ...cover }
                        : user
                )
            }
        }
        case 'PROFILE_COVER_PIC_FAILED': {
            const { error } = action.payload
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, coverPicError: error }
                        : user
                )
            }
        }
        case 'PROFILE_AVATAR_PIC_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, avatarPicIsLoading: isLoading }
                        : user
                )
            }
        }
        case 'PROFILE_AVATAR_PIC_SET_SUCCESS': {
            const { avatar } = action.payload
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, ...avatar }
                        : user
                )
            }
        }
        case 'PROFILE_AVATAR_PIC_FAILED': {
            const { error } = action.payload
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, avatarPicError: error }
                        : user
                )
            }
        }
        case 'PROFILE_BIO_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, bioIsLoading: isLoading }
                        : user
                )
            }
        }
        case 'PROFILE_BIO_SUCCESS': {
            const { bio } = action.payload
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, ...bio, bioSuccess: true }
                        : user
                )
            }
        }
        case 'PROFILE_BIO_FAILED': {
            const { error } = action.payload
            const userId = state.userId ?? 0

            let index = _.findIndex((state.users || []), { id: userId });

            // if not found, add the item
            if (index == -1) {
                return {
                    ...state
                }
            } 

            // otherwise replace it
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, bioSuccess: false, bioError: error }
                        : user
                )
            }
        }
        case 'PROFILE_OTHER_USER_FAILED': {
            const error = action.payload.otherUserError || 'Failed Loading Data'
            return {
                ...state, otherUserIsLoading: false, otherUser: undefined, otherUserError: error
            }
        } 
        case 'PROFILE_POSTS_IS_LOADING': {
            const { userId } = action.payload
            const isLoading = action.payload.isLoading || false;

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, postIsLoading: isLoading }
                        : user
                )
            }
        }
        case 'PROFILE_POSTS_SET_DATA': {
            const { userId, posts, total } = action.payload
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

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, posts: [...user.posts || [], ...posts], totalPostsCount: total, postSuccess: true }
                        : user
                )
            }
        }
        case 'PROFILE_POSTS_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            const { userId } = action.payload

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, postSuccess: false, postError: error }
                        : user
                )
            }
        } 
        case 'PROFILE_POSTS_RESET': {
            const { userId } = action.payload

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, posts: [], totalPostsCount: 0 }
                        : user
                )
            }
        }
        case 'PROFILE_MEDIA_IS_LOADING': {
            const { userId } = action.payload
            const isLoading = action.payload.isLoading || false;

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, mediaIsLoading: isLoading }
                        : user
                )
            }
        }
        case 'PROFILE_MEDIA_SET_DATA': {
            const { userId, posts, total } = action.payload
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

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, media: [...user.media || [], ...posts], totalMediaCount: total, mediaSuccess: true }
                        : user
                )
            }
        }
        case 'PROFILE_MEDIA_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            const { userId } = action.payload

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, mediaSuccess: false, mediaError: error }
                        : user
                )
            }
        } 
        case 'PROFILE_MEDIA_RESET': {
            const { userId } = action.payload

            let index = _.findIndex((state.users || []), { id: userId });

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === index 
                        ? { ...user, media: [], totalMediaCount: 0 }
                        : user
                )
            }
        }
        case 'PROFILE_VERDICT_IS_LOADING': {
            const { ownerId, postId } = action.payload
            const isLoading = action.payload.isLoading || false;

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, isVerdictLoading: isLoading }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_VERDICT_SUCCESS': {
            const { ownerId, postId, verdict } = action.payload
            const liked = verdict == 'like'

            // locate user, post 
            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex, postViewer, postCounts

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })

                if (postIndex != -1) {
                    let updatedPost = posts[postIndex]
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
                }
            }

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, viewer: postViewer, post_counts: postCounts }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_VERDICT_FAILED': {
            const { ownerId, postId } = action.payload
            const error = action.payload.error || 'Failed Loading Data'

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, verdictSuccess: false, verdictError: error }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_COMMENT_IS_LOADING': {
            const { ownerId, postId } = action.payload
            const isLoading = action.payload.isLoading || false;

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, commentIsLoading: isLoading }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_COMMENT_SUCCESS': {
            const { ownerId, postId, comment } = action.payload

            // update comment date
            comment.commentPosted = moment.unix(comment.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
            comment.commentPostedTimeAgo = moment(comment.commentPosted, "MMMM Do YYYY, h:mm:ss a").fromNow()

            // locate user, post and comment
            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex, postCounts
            let comments = []

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })

                if (postIndex != -1) {
                    let updatedPost = posts[postIndex]
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
            }

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, comments, post_counts: postCounts }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_COMMENT_FAILED': {
            const { ownerId, postId } = action.payload
            const error = action.payload.error || 'Failed Loading Data'

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, commentSuccess: false, commentFailed: error }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_USER_VERDICT_IS_LOADING': {
            const { userId } = action.payload
            const isUserVerdictLoading = action.payload.isLoading || false

            let users = (state.users || [])
            let index = _.findIndex(users, { id: userId })

            // always reset the state of error and success
            return {
                ...state, isUserVerdictLoading, userVerdictSuccess: undefined,
                users: state.users.map(
                    (user, i) => i === index 
                        ? {...user, isUserVerdictLoading }
                        : user
                )
            };
        }
        case 'PROFILE_USER_VERDICT_SUCCESS': {
            const { userId, verdict } = action.payload

            const followed = verdict == 'follow'

            let users = (state.users || [])
            let index = _.findIndex(users, { id: userId })

            let userViewer, userCounts
            
            if (index !== -1) {
                let updatedUser = users[index]
                userViewer = updatedUser.viewer || {}
                userCounts = updatedUser.counts || {}

                // update is user followed by the viewer
                userViewer.is_follower = followed

                // compute total following count
                let followersCount = (userCounts.followers || 0)
                if (followed) {
                    followersCount = followersCount + 1
                } else {
                    followersCount = followersCount - 1
                }

                // update likes count
                userCounts.followers = followersCount 
                userCounts.followersDesc = abbreviateNumber(followersCount)
            }

            return {
                ...state, userVerdictSuccess: true, userVerdictError: undefined,
                users: state.users.map(
                    (user, i) => i === index 
                        ? {...user, viewer: userViewer, counts: userCounts }
                        : user
                )
            }
        }
        case 'PROFILE_USER_VERDICT_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state, userVerdictSuccess: undefined, userVerdictError: error
            }
        }
        case 'PROFILE_COMMENT_VERDICT_IS_LOADING': {
            const { ownerId, postId, commentId } = action.payload
            const isLoading = action.payload.isLoading || false;

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex, commentIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
                
                if (postIndex != -1) {
                    const comments = posts[postIndex].comments || []
                    commentIndex = _.findIndex(comments, { id: commentId })
                }
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? {
                                        ...post,
                                        comments: post.comments.map(
                                            (comment, k) => k == commentIndex
                                                ? { ...comment, isCommentVerdictLoading: isLoading }
                                                : comment
                                        )
                                    }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_COMMENT_VERDICT_SUCCESS': {
            const { ownerId, postId, commentId, verdict } = action.payload
            const liked = verdict == 'like'

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex, commentIndex, commentViewer, commentCounts

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
                
                if (postIndex != -1) {
                    const comments = posts[postIndex].comments || []
                    commentIndex = _.findIndex(comments, { id: commentId })

                    if (commentIndex != -1) {
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
            }

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? {
                                        ...post,
                                        comments: post.comments.map(
                                            (comment, k) => k == commentIndex
                                                ? { ...comment, viewer: commentViewer, comment_counts: commentCounts }
                                                : comment
                                        )
                                    }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_COMMENT_VERDICT_FAILED': {
            const { ownerId, postId, commentId } = action.payload
            const error = action.payload.error || 'Failed Loading Data'

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex, commentIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
                
                if (postIndex != -1) {
                    const comments = posts[postIndex].comments || []
                    commentIndex = _.findIndex(comments, { id: commentId })
                }
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? {
                                        ...post,
                                        comments: post.comments.map(
                                            (comment, k) => k == commentIndex
                                                ? { ...comment, commentVerdictSucces: false, commentVerdictError: error }
                                                : comment
                                        )
                                    }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_LIST_COMMENT_IS_LOADING': {
            const { ownerId, postId } = action.payload
            const isLoading = action.payload.isLoading || false;

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, commentListIsLoading: isLoading }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_LIST_COMMENT_SUCCESS': {
            const { ownerId, postId, comments } = action.payload

            // modify comments date
            comments.map(comment => {
                comment.commentPosted = moment.unix(comment.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a")
                comment.commentPostedTimeAgo = moment(comment.commentPosted, "MMMM Do YYYY, h:mm:ss a").fromNow()
                return comment
            })

            // locate user, post and comment
            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }

            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, comments }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_LIST_COMMENT_FAILED': {
            const { ownerId, postId } = action.payload
            const error = action.payload.error || 'Failed Loading Data'

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, commentListSuccess: false, commentListFailed: error }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_COMMENT_ADD_MEDIA': {
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
        case 'PROFILE_COMMENT_REMOVE_MEDIA': {
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
        case 'PROFILE_COMMENT_RESET_MEDIA': {
            return {
                ...state,
                commentMedia:  {
                    items: [], 
                    postId: undefined
                }
            }
        }
        case 'PROFILE_PREVIEW_IS_LOADING': {
            const isCreatePreviewLoading = action.payload.isLoading || false
            // always reset the state of error and success
            return {
                ...state, isCreatePreviewLoading
            };
        }
        case 'PROFILE_PREVIEW_SUCCESS': {
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
        case 'PROFILE_PREVIEW_FAILED': {
            return {
                ...state, createPostPreview: undefined
            }
        }
        case 'PROFILE_SET_GIF_URL': {
            const { url, postId } = action.payload
            return {
                ...state,
                gifAttachmentUrl: url,
                gifAttachmentPostId: postId
            }
        }
        case 'PROFILE_POST_DELETE_IS_LOADING': {
            const { postId, ownerId } = action.payload
            const isDeletePostLoading = action.payload.isLoading || false

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                deletePostSuccess: undefined, deletePostError: undefined,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, isDeletePostLoading }
                                    : post
                            )
                        }
                        : user
                )
            }
        }
        case 'PROFILE_POST_DELETE_SUCCESS': {
            const { postId, ownerId } = action.payload

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                deletePostSuccess: true, deletePostError: undefined,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: [
                                ...user.posts.slice(0, postIndex),
                                ...user.posts.slice(postIndex + 1)
                            ],
                            totalPostsCount: postIndex != -1 ? user.totalPostsCount - 1 : user.totalPostsCount
                        }
                        : user
                )
            }
        }
        case 'PROFILE_POST_DELETE_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state,
                deletePostSuccess: undefined, deletePostError: error
            }
        }
        case 'PROFILE_POST_FLAG_IS_LOADING': {
            const { postId, ownerId } = action.payload
            const isFlagPostLoading = action.payload.isLoading || false

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                flagPostSuccess: undefined, flagPostError: undefined,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: user.posts.map((post, j) =>
                                j == postIndex
                                    ? { ...post, isFlagPostLoading }
                                    : post
                            ),
                        }
                        : user
                )
            }
        }
        case 'PROFILE_POST_FLAG_SUCCESS': {
            const { postId, ownerId } = action.payload

            const userIndex = _.findIndex((state.users || []), { id: ownerId });
            let postIndex

            if (userIndex != -1) {
                const posts = state.users[userIndex].posts || []
                postIndex = _.findIndex(posts, { id: postId })
            }
           
            return {
                ...state,
                flagPostSuccess: true, flagPostError: undefined,
                users: (state.users || []).map(
                    (user, i) => i === userIndex
                        ? {
                            ...user,
                            posts: [
                                ...user.posts.slice(0, postIndex),
                                ...user.posts.slice(postIndex + 1)
                            ],
                            totalPostsCount: postIndex != -1 ? user.totalPostsCount - 1 : user.totalPostsCount
                        }
                        : user
                )
            }
        }
        case 'PROFILE_POST_FLAG_FAILED': {
            const error = action.payload.error || 'Failed Loading Data'
            return {
                ...state,
                flagPostSuccess: undefined, flagPostError: error
            }
        }
        case 'PROFILE_USER_BLOCK_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state, blockIsLoading: isLoading, blockSuccess: undefined, blockError: undefined
            };
        }
        case 'PROFILE_USER_BLOCK_SUCCESS': {
            return {
                ...state, blockSuccess: true, blockError: undefined
            };
        }
        case 'PROFILE_USER_BLOCK_FAILED': {
            const { error } = action.payload
            return {
                ...state, blockSuccess: undefined, blockError: error
            };
        }
        case 'PROFILE_USER_REPORT_IS_LOADING': {
            const isLoading = action.payload.isLoading || false;
            return {
                ...state, reportIsLoading: isLoading, reportSuccess: undefined, reportError: undefined
            };
        }
        case 'PROFILE_USER_REPORT_SUCCESS': {
            return {
                ...state, reportSuccess: true, reportError: undefined
            };
        }
        case 'PROFILE_USER_REPORT_FAILED': {
            const { error } = action.payload
            return {
                ...state, reportSuccess: undefined, reportError: error
            };
        }
        default: {
            return state;
        }
    }
}
