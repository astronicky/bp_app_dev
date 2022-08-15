/*
 * Created by Justice on Fri Jun 12 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'

import { connect } from 'react-redux'
import { Text, View, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { styles } from './style'
import { withTheme, IconButton, Divider } from 'react-native-paper'
import ImagePicker from 'react-native-image-picker'

import sendIcon from 'app/assets/send.png'
import unregUser from 'app/assets/unregUser.png'
import gifIcon from 'app/assets/insert-gif.png'
import imgIcon from 'app/assets/insert-img.png'

import likeIcon from 'app/assets/likeIcon.png'
import { actGivePostTextComment, actRemoveCommentPreview, actGivePostLinkComment, actGivePostMediaComment, actAddCommentMedia, actRemoveCommentMedia } from '../actions/index'

export class CommentNewComponent extends Component {

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
        const { post, userPic, preview, media } = this.props;
        const { comment } = this.state;
        const isBlocked = post.viewer?.is_blocked ?? false
        const isLegacy = post.is_legacy == 0 ? false : true
        const userHasPic = userPic != undefined
        const hasPreview = preview != undefined
        const hasMedia = media.length != 0
        const hasPreviewImages = preview && preview.images && preview.images.length != 0

        return (
            <React.Fragment key={post.id}>
                <Divider style={{ margin: 10, marginBottom: 5, marginTop: 5 }}/>
                {/* <View key={post.postTag2} style={{ ...styles.bottomSeparatorLine, backgroundColor: colors.gray }} /> */}
                {isBlocked == true &&
                    <React.Fragment>
                        <View style={styles.blockedBanner}>
                            <IconButton icon="block-helper" color={colors.danger} size={12} style={styles.legacyIcon} />
                            <Text style={{ ...styles.blockText, fontFamily: fonts.regular, color: colors.gray }} numberOfLines={2}>
                                You cannot comment on this post. User has blocked you.
                            </Text>
                        </View>
                    </React.Fragment>
                }
                {isLegacy == true &&
                    <View style={styles.legacyBanner}>
                        <IconButton icon="block-helper" color={colors.warning} size={15} style={styles.legacyIcon} />
                        <Text style={{ ...styles.legacyText, fontFamily: fonts.regular, color: colors.gray }} numberOfLines={2}>
                            This is a legacy post. Comments and likes are locked.
                        </Text>
                    </View>
                }
                {isLegacy == false && isBlocked == false &&
                    <View style={styles.inputCont}>
                        <View style={styles.picBox}>
                            {userHasPic == false &&
                                <Image source={unregUser} style={styles.avatarComments} />
                            }
                            {userHasPic &&
                                <Image source={{ uri: userPic }} style={styles.avatarComments} />
                            }
                        </View>
                        <View style={styles.inputBox}>
                            <TextInput
                                editable={isBlocked == false || isLegacy == false}
                                style={{ ...styles.input, fontFamily: fonts.regular }}
                                onChangeText={(text) => {
                                    this.storeText(text)
                                }}
                                value={comment}
                                placeholderTextColor={colors.gray}
                                placeholder="Say something..."
                            />
                            <View style={{ width: 80, height: 40, flexDirection: 'row' }}>
                                <TouchableOpacity disabled={isBlocked == true && isLegacy == true} onPress={this.tapGifIcon}>
                                    <Image source={gifIcon} style={styles.commentIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity disabled={isBlocked == true && isLegacy == true} onPress={this.tapImageImport}>
                                    <Image source={imgIcon} style={styles.commentIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ ...styles.sendBox, borderColor: colors.gray }}>
                            <TouchableOpacity disabled={isBlocked == true && isLegacy == true} onPress={this.sendComment} style={styles.sendButton}>
                                <Image source={sendIcon} style={{ ...styles.send, tintColor: colors.gray }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                { /* Render link preview */}
                {hasPreview &&
                    <View style={styles.previewAttachBox}>
                        <TouchableOpacity style={styles.previewBoxSmall}>
                            {/* {hasPreviewProvider &&
                                    <View style={styles.previewHeaderSmall}>
                                        <Image source={{ uri: comment.preview.provider.faviconUrl }} style={styles.previewFavIcon} />
                                        <Text style={{ ...styles.previewHeaderLabel, fontFamily: fonts.regular }}>
                                            {comment.preview.provider.displayName}
                                        </Text>
                                    </View>
                                } */}
                            {hasPreviewImages &&
                                <Image source={{ uri: preview.images[0].url }} style={styles.previewContentSmall} />
                            }
                            <Text style={{ ...styles.previewLabelSmall, fontFamily: fonts.regular }}>
                                {preview.title}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.removePreviewIcon}>
                            <IconButton icon="close"
                                size={15}
                                color={colors.gray}
                                style={{ backgroundColor: colors.black }}
                                onPress={this.tapRemovePreview} />
                        </View>
                    </View>
                }
                { /* Render media attachments */}
                { hasMedia && media.map((item, index) => this.renderMedia(item, index))}
            </React.Fragment>
        )
    }

    tapGifIcon = () => {
        const { post } = this.props
        if (post.viewer?.is_blocked == false) {
            this.props.navigation.navigate('FeedGifSearchComponent', { postId: post.id })
        }
    }

    sendComment = () => {
        const { isLoading, preview, post, media, pageLocation } = this.props
        const { comment, urls } = this.state

        // immediately dismiss the keyboard
        Keyboard.dismiss()

        if (isLoading != true && post != undefined && post.viewer?.is_blocked == false) {
            // create a text post
            if (preview != undefined) {
                this.props.doGivePostLinkComment(post.id, comment, preview, urls, pageLocation)
            } else if (media.length != 0) {
                this.props.doGivePostMediaComment(post.id, comment, media, pageLocation)
            } else {
                if (_.isEmpty(comment) == false) {
                    this.props.doGivePostTextComment(post.id, comment, pageLocation)
                }
            }
        }

        // reset the comment field
        this.setState({ comment: "", urls: undefined })
        // remove any preview
        this.props.doRemoveCommentPreview()
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

    storeText = (text) => {
        this.setState({ comment: text })
    }

    tapRemovePreview = () => {
        this.props.doRemoveCommentPreview()
    }

    tapImageImport = () => {
        const { post } = this.props
        if (post.id && post.viewer?.is_blocked == false) {
            const opts = { includeBase64: true, mediaType: 'photo', maxWidth: 500, maxHeight: 500 }
            ImagePicker.launchImageLibrary(opts, (response) => {
                if (response.data != undefined) {
                    this.props.doAddCommentMedia(post.id, response.data)
                }
            })
        }
    }

    tapRemoveMediaAt = (index) => {
        const { post } = this.props
        if (index != undefined && post.id) {
            this.props.doRemoveCommentMedia(index)
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
        doGivePostTextComment: (postId, comment, pageLocation) => dispatch(actGivePostTextComment(postId, comment, pageLocation)),
        doGivePostLinkComment: (postId, comment, preview, urls, pageLocation) => dispatch(actGivePostLinkComment(postId, comment, preview, urls, pageLocation)),
        doGivePostMediaComment: (postId, comment, images, pageLocation) => dispatch(actGivePostMediaComment(postId, comment, images, pageLocation)),
        doAddCommentMedia: (postId, mediaItem) => dispatch(actAddCommentMedia(postId, mediaItem)),
        doRemoveCommentPreview: () => dispatch(actRemoveCommentPreview()),
        doRemoveCommentMedia: (index) => dispatch(actRemoveCommentMedia(index))
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CommentNewComponent))
