/*
 * Created by Justice on Thu Nov 05 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, TextInput, Keyboard, TouchableOpacity } from 'react-native'
import { styles } from './style'
import { Button, IconButton, Title } from 'react-native-paper'
import { withTheme } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker'
import _ from 'lodash'

import PageLoader from 'app/features/shared/page-loader/components/index'
import MobileAdsComponent from 'app/features/auth/root/components/ads'

import gifIcon from 'app/assets/insert-gif.png'
import imgIcon from 'app/assets/insert-img.png'

import {
    actCreateTextPost, actCreateLinkPost,
    actCreateLinkPreview, actCreateMediaPost,
    actCancelCreatePost, actAddPostMedia,
    actRemovePostMedia, actRemoveCreatePostPreview
} from '../actions/index'

export class PostCreateComponent extends Component {
    state = { message: "", urls: [] };

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.error) {
            alert(nextProps.error)
        }

        // if successful login, navigate to root component again
        if (nextProps.createPostSuccess) {
            nextProps.navigation.navigate('Home')
            prevState.message = ""
        }

        // If successfully attached a GIF, query it's preview immediately
        if (nextProps.gifAttachmentUrl) {
            const { preview, isLoadingPreview } = nextProps
            if (preview == undefined && isLoadingPreview != true) {
                prevState.urls = [nextProps.gifAttachmentUrl]
                nextProps.doCreateLinkPreview(nextProps.gifAttachmentUrl)
            }
        }

        return null;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
                {this.renderAds()}
            </View>
        )
    }

    renderAds() {
        return (
            <View style={styles.adContainer}>
                <MobileAdsComponent />
            </View>
        )
    }

    renderContent() {
        const { preview, isLoading } = this.props
        const { colors, fonts } = this.props.theme
        const { message } = this.state
        const { media, isLoadingPreview } = this.props

        const hasPreviewProvider = preview != undefined && preview.provider != undefined
        const hasPreviewImages = preview != undefined && preview.images != undefined && preview.images.length != 0
        const disablePosting = _.isEmpty(message) && media.length == 0 && preview == undefined

        return (
            <ScrollView keyboardShouldPersistTaps='always' style={styles.container} keyboardDismissMode='on-drag'>
                <View style={styles.postTitleCont}>
                    <View style={styles.postLeftRowCont}>
                        <Title style={styles.postTitleLabel}>
                            New post
                        </Title>
                    </View>
                    <View style={styles.postRightRowCont}>
                        {/* <IconButton
                            size={30}
                            color={colors.gray}
                            icon="close"
                            onPress={this.tapCancelPost}
                        /> */}
                    </View>
                </View>
                <View style={{ ...styles.postCont, backgroundColor: colors.background }}>
                    <View style={styles.inputCont}>
                        <TextInput
                            multiline={true}
                            style={{ ...styles.input, fontFamily: fonts.regular }}
                            onChangeText={(text) => this.storeText(text)}
                            value={message}
                            placeholder="What's up?"
                        />
                    </View>
                </View>
                <View style={styles.postButtonCont}>
                    <View style={styles.postLeftRowCont}>
                        <IconButton
                            size={30}
                            color={colors.gray}
                            icon={gifIcon}
                            disabled={hasPreviewImages}
                            onPress={this.tapGifIcon}
                        />
                        <IconButton size={30}
                            color={colors.gray}
                            icon={imgIcon}
                            disabled={hasPreviewImages}
                            onPress={this.tapImageImport}
                        />
                    </View>
                    <View style={styles.postRightRowCont}>
                        <Button color={colors.secondary} disabled={disablePosting} loading={isLoading} mode="contained" style={styles.postButton} onPress={this.createPost}>
                            POST
                        </Button>
                    </View>
                </View>
                {preview &&
                    <View>
                        <TouchableOpacity style={styles.previewBox} onPress={this.tapLinkPreview}>
                            {hasPreviewProvider &&
                                <View style={styles.previewHeader}>
                                    <Image source={{ uri: preview.provider.faviconUrl }} style={styles.previewFavIcon} />
                                    <Text style={{ ...styles.previewHeaderLabel, fontFamily: fonts.regular }}>
                                        {preview.provider.displayName}
                                    </Text>
                                </View>
                            }
                            {hasPreviewImages &&
                                <Image source={{ uri: preview.images[0].url }} style={styles.previewContent} />
                            }
                            <Text style={styles.previewLabel}>
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
                {isLoadingPreview &&
                    <PageLoader type="large" />
                }
                <View>
                    {media.map((item, index) => (
                        <View>
                            <Image source={{ uri: `${item}` }} style={styles.postImg} />
                            <View style={styles.removeMediaIcon}>
                                <IconButton icon="close" size={15} color={colors.gray} style={{ backgroundColor: colors.black }} onPress={() => { this.tapRemoveMediaAt(index) }} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    }

    storeText = (text) => {
        const urls = text.match(/(https?:\/\/[^\s]+)/g) || [];
        this.setState({ message: text, urls: urls })
        setTimeout(() => { this.queryPreview() }, 500)
    }

    queryPreview = () => {
        // check if has no preview yet
        const { preview, isLoadingPreview } = this.props
        const { urls } = this.state
        const url = urls[0]

        if (preview == undefined && isLoadingPreview != true && url != undefined) {
            this.props.doCreateLinkPreview(url)
        }
    }

    createPost = () => {
        const { isLoading, preview, media } = this.props
        const { message, urls } = this.state

        // immediately dismiss the keyboard
        Keyboard.dismiss()

        if (isLoading != true) {
            // create a text post
            if (preview != undefined) {
                this.props.doCreateLinkPost(message, preview, urls)
            } else if (media.length != 0) {
                this.props.doCreateMediaPost(message, media)
            } else {
                this.props.doCreateTextPost(message)
            }
        }
    }

    tapCancelPost = () => {
        this.props.navigation.pop()
        this.props.doCancelCreatePost()
    }

    tapLinkPreview = () => {

    }

    tapImageImport = () => {
        const opts = { includeBase64: true, mediaType: 'photo', maxWidth: 500, maxHeight: 500 }
        ImagePicker.launchImageLibrary(opts, (response) => {
            if (response.data != undefined) {
                this.props.doAddPostMedia(response.data)
            }
        })
    }

    tapRemoveMediaAt = (index) => {
        if (index != undefined) {
            this.props.doRemovePostMedia(index)
        }
    }

    tapRemovePreview = () => {
        this.props.doRemoveCreatePostPreview()
    }

    tapGifIcon = () => {
        this.props.navigation.navigate('FeedGifSearchComponent')
    }
}

const mapStateToProps = (state) => {
    const _state = {
        createPostSuccess: state.feed.createPostSuccess,
        createPostError: state.feed.createPostError,
        posts: state.feed.posts,
        isLoading: state.feed.isCreatePostLoading,
        preview: state.feed.createPostPreview,
        isLoadingPreview: state.feed.isCreatePreviewLoading,
        media: state.feed.media || [],
        gifAttachmentUrl: state.feed.gifAttachmentUrl,
    };

    return _state;
};


const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doCreateTextPost: (message) => dispatch(actCreateTextPost(message)),
        doCreateMediaPost: (message, images) => dispatch(actCreateMediaPost(message, images)),
        doCreateLinkPost: (message, preview, urls) => dispatch(actCreateLinkPost(message, preview, urls)),
        doCreateLinkPreview: (url) => dispatch(actCreateLinkPreview(url)),
        doCancelCreatePost: () => dispatch(actCancelCreatePost()),
        doAddPostMedia: (item) => dispatch(actAddPostMedia(item)),
        doRemovePostMedia: (index) => dispatch(actRemovePostMedia(index)),
        doRemoveCreatePostPreview: () => dispatch(actRemoveCreatePostPreview())
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PostCreateComponent))
