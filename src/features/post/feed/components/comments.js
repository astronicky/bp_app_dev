/*
 * Created by Justice on Wed Nov 04 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'

import { connect } from 'react-redux'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { styles } from './style'
import { withTheme } from 'react-native-paper'
import unregUser from 'app/assets/unregUser.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'

import likeIcon from 'app/assets/likeIcon.png'
import { actGiveCommentVerdict, actLoadPostComments } from '../actions/index'

export class CommentsComponent extends Component {

    state = { comment: "" };

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.error) {
            alert(nextProps.error)
        }

        if (nextProps.preview && nextProps.preview?.url && nextProps.post) {
            prevState.urls = [nextProps.preview.url]
        }

        return null;
    }

    render() {
        const { colors, fonts } = this.props.theme
        const { post } = this.props;
        const isBlocked = post.viewer?.is_blocked ?? false
        const comments = post.comments ?? []

        const commentsCount = (post.comments || []).length
        const totalCommentsCount = ((post.post_counts || {}).comments || 0)
        const hasMoreComments = totalCommentsCount > commentsCount

        return (
            <React.Fragment key={post.id}>
                {comments.map((comment, index) => this.renderComment(comment, index))}
                {hasMoreComments &&
                    <View style={styles.moreCommentsFlex}>
                        <TouchableOpacity disabled={isBlocked} onPress={this.tapLoadComments}>
                            <Text style={{ fontFamily: fonts.semiBold, color: colors.black }}>
                                More Comments
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </React.Fragment>
        )
    }

    renderComment = (comment, index) => {

        const { colors, fonts } = this.props.theme

        // check if user liked this comment
        const liked = ((comment.viewer || {}).liked_this || false)
        const isLoading = comment.isCommentVerdictLoading ?? false
        const commentUserId = comment.user?.id
        const commentUserName = comment.user?.username ?? "Guest"
        const commentNickName = comment.user?.nickname ?? "Guest"
        const avatar = comment.user?.avatar?.sm
        const userHasAvatar = avatar != undefined
        const likesCount = comment.comment_counts?.likes ?? ''
        const likeDesc = likesCount == 0 ? '' : likesCount
        const commentBody = _.isEmpty(comment.body) ? undefined : comment.body
        const hasPreviewProvider = comment.preview && comment.preview.provider
        const hasPreviewImages = comment.preview && comment.preview.images && comment.preview.images.length != 0
        const hasMedia = (comment.media ?? []).length != 0
        const userIsVerified = comment.user?.show_verified_badge ?? false

        return (
            <React.Fragment>
                <View style={styles.commentFlex} key={index}>
                    <TouchableOpacity style={styles.avatarComments} onPress={() => this.tapUserProfile(commentUserId, commentUserName)}>
                        <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatarComments} />
                    </TouchableOpacity>
                    <View style={styles.commentsCont}>
                        <TouchableOpacity style={{ ...styles.flex, marginBottom: 7 }} onPress={() => this.tapUserProfile(commentUserId, commentUserName)}>
                            <Text style={{ ...styles.commentNicktxt, color: colors.black, fontFamily: fonts.semiBold }} numberOfLines={1} ellipsizeMode='tail'>
                                {commentNickName + ' '}
                            </Text>
                            {userIsVerified &&
                                <Image source={verifiedIcon} style={styles.verifiedIconComment} />
                            }
                            <Text style={{ ...styles.commentNametxt, color: colors.gray, fontFamily: fonts.regular }}>
                                {` @${commentUserName} • ${comment.commentPostedTimeAgo || ''}`}
                            </Text>
                        </TouchableOpacity>
                        {commentBody &&
                            <Text numberOfLines={8} style={{ fontFamily: fonts.regular, marginBottom: 10 }}>
                                {commentBody}
                            </Text>
                        }
                        {comment.type == 'link' && comment.preview != undefined &&
                            <TouchableOpacity style={styles.previewBoxSmall} onPress={this.tapLinkPreview}>
                                {/* {hasPreviewProvider &&
                                    <View style={styles.previewHeaderSmall}>
                                        <Image source={{ uri: comment.preview.provider.faviconUrl }} style={styles.previewFavIcon} />
                                        <Text style={{ ...styles.previewHeaderLabel, fontFamily: fonts.regular }}>
                                            {comment.preview.provider.displayName}
                                        </Text>
                                    </View>
                                } */}
                                {hasPreviewImages &&
                                    <Image source={{ uri: comment.preview.images[0].url }} style={styles.previewContentSmall} />
                                }
                                <Text style={{ ...styles.previewLabelSmall, fontFamily: fonts.regular }}>
                                    {comment.preview.title}
                                </Text>
                            </TouchableOpacity>
                        }
                        {comment.type == 'photo' && hasMedia &&
                            <Image source={{ uri: comment.media[0]?.sm }} style={styles.previewContentSmall} />
                        }
                        <View style={styles.commentLikeCont}>
                            <TouchableOpacity style={styles.commentLikeBtnCont} disabled={isLoading} onPress={() => this.tapLikeComment(comment)}>
                                <Image source={likeIcon} style={styles.likeCommentIcon} />
                                <Text style={{ fontFamily: fonts.regular, color: colors.gray, marginLeft: 5, fontSize: 12 }}>
                                    {likeDesc}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </React.Fragment>
        )
    }

    tapUserProfile = (userId, userName) => {
        const { post } = this.props
        if (userId && userName && post.viewer?.is_blocked == false) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }

    tapLikeComment = (comment) => {
        const { post, pageLocation } = this.props

        // check if user liked this comment
        const liked = ((comment.viewer || {}).liked_this || false)
        const newVerdict = liked == true ? "unlike" : "like"
        const ownerId = post.user?.id

        if (post.id && comment.id && post.viewer?.is_blocked == false) {
            this.props.doGiveCommentVerdict(ownerId, post.id, comment.id, newVerdict, pageLocation)
        }
    }

    tapLoadComments = () => {
        const { post } = this.props
        if (post) {
            this.props.doLoadPostComments(post.id)
        }
    }
}

const mapStateToProps = (state, ownProps) => {

    const preview = ownProps.post?.id == state.feed.createPostPreview?.postId
        ? state.feed.createPostPreview
        : undefined

    const media = ownProps.post?.id == state.feed.commentMedia?.postId
        ? state.feed.commentMedia?.items || []
        : []

    const _state = {
        userPic: state.profile.avatar?.sm ?? undefined,
        isLoadingComment: state.feed.isCommentLoading,
        commentSuccess: state.feed.commentSuccess,
        preview,
        media,
        isLoadingPreview: state.feed.isCreatePreviewLoading,
        pageLocation: state.root.currentPageLocation,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doGiveCommentVerdict: (ownerId, postId, commentId, verdict, pageLocation) => dispatch(actGiveCommentVerdict(ownerId, postId, commentId, verdict, pageLocation)),
        doLoadPostComments: (postId) => dispatch(actLoadPostComments(postId))
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CommentsComponent))

