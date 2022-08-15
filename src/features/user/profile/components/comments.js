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
import { withTheme, IconButton } from 'react-native-paper'

import likeIcon from 'app/assets/likeIcon.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'
import { actGiveCommentVerdict, actLoadPostComments } from '../actions/index'

export class CommentsComponent extends Component {

    state = { comment: "" };

    render() {
        const { colors, fonts } = this.props.theme
        const { post } = this.props;
        const isBlocked = post.viewer?.is_blocked ?? false

        const commentsCount = (post.comments || []).length
        const totalCommentsCount = ((post.post_counts || {}).comments || 0)
        const hasMoreComments = totalCommentsCount > commentsCount

        return (
            <React.Fragment>
                {post.comments.map((comment, index) => this.renderComment(comment, index))}
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
        const likesCount = comment.comment_counts?.likes ?? 0
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
                        <Image source={{ uri: avatar }} style={styles.avatarComments} />
                    </TouchableOpacity>
                    <View style={styles.commentsCont}>
                        <TouchableOpacity style={{ ...styles.flex, marginBottom: 7 }} onPress={() => this.tapUserProfile(commentUserId, commentUserName)}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ ...styles.commentNicktxt, color: colors.black, fontFamily: fonts.semiBold }} numberOfLines={1} ellipsizeMode='tail'>
                                    {commentNickName + ' '}
                                </Text>
                                {userIsVerified &&
                                    <Image source={verifiedIcon} style={styles.verifiedIconComment} />
                                }
                                <Text style={{ ...styles.commentNametxt, color: colors.gray, fontFamily: fonts.regular }}>
                                    {` @${commentUserName} • ${comment.commentPostedTimeAgo || ''}`}
                                </Text>
                            </View>
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

    renderMedia = (media, index) => {
        const { colors } = this.props.theme
        return (
            <View style={{ marginBottom: 10 }}>
                <Image source={{ uri: `${media}` }} style={styles.commentMedia} />
                <View style={styles.removeMediaIcon}>
                    <IconButton icon="close" size={15} color={colors.gray} style={{ backgroundColor: colors.black }} onPress={() => { this.tapRemoveMediaAt(index) }} />
                </View>
            </View>
        )
    }

    tapLikeComment = (comment) => {
        const { post, pageLocation } = this.props

        // check if user liked this comment
        const ownerId = post?.user?.id
        const postId = post?.id

        const liked = ((comment.viewer || {}).liked_this || false)
        const newVerdict = liked == true ? "unlike" : "like"

        if (postId && ownerId && comment.id) {
            this.props.doGiveCommentVerdict(ownerId, postId, comment.id, newVerdict, pageLocation)
        }
    }

    tapUserProfile = (userId, userName) => {
        const { ownerUserId } = this.props
        if (ownerUserId != userId) {
            if (userId && userName) {
                this.props.navigation.push('Profile', { userId, userName })
            }
        }
    }

    tapLoadComments = () => {
        const { post } = this.props
        const ownerId = post?.user?.id
        const postId = post?.id

        if (postId && ownerId) {
            this.props.doLoadPostComments(ownerId, postId)
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const ownerUserId = ownProps.route?.params?.userId ?? state.profile.userId

    const preview = ownProps.post?.id == state.profile.createPostPreview?.postId
        ? state.profile.createPostPreview
        : undefined

    const media = ownProps.post?.id == state.profile.commentMedia?.postId
        ? state.profile.commentMedia?.items || []
        : []

    const _state = {
        userPic: state.profile.avatar?.sm ?? undefined,
        ownerUserId,
        preview,
        media,
        isLoadingPreview: state.profile.isCreatePreviewLoading,
        pageLocation: state.root.currentPageLocation,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doGiveCommentVerdict: (ownerId, postId, commentId, verdict, pageLocation) => dispatch(actGiveCommentVerdict(ownerId, postId, commentId, verdict, pageLocation)),
        doLoadPostComments: (ownerId, postId) => dispatch(actLoadPostComments(ownerId, postId))
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CommentsComponent))
