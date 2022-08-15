/*
 * Created by Justice on Wed Nov 04 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableOpacity, Linking, Alert, Modal } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import FBCollage from 'react-native-fb-collage';
import { styles } from './style'
import { withTheme, Divider } from 'react-native-paper'
import ViewMoreText from 'react-native-view-more-text'
import _ from 'lodash'

export class PostPreviewComponent extends Component {

    state = { showImagePreview: false, imageUrls: [], imageIndex: 0 };

    render() {

        const { colors, fonts } = this.props.theme
        const { post } = this.props;
        const hasPreviewProvider = post.preview && post.preview.provider
        const hasPreviewImages = post.preview && post.preview.images && post.preview.images.length != 0
        const hasEmptyBody = _.isEmpty(post.body || '')
        const message = post.messageContents ?? post.body
        const { showImagePreview, imageUrls, imageIndex } = this.state
        const images = (post.media ?? []).map(item => item.sm ?? '')

        return (
            <React.Fragment>

                {/* Text Post */}
                {hasEmptyBody == false &&
                    <ViewMoreText
                        numberOfLines={5}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        textStyle={{ ...styles.mainText, fontFamily: fonts.regular }}
                    >
                        <Text>
                            {message}
                        </Text>
                    </ViewMoreText>
                }

                {/* Image Post */}
                {post.type == 'photo' && post.media.length == 1 &&
                    <TouchableOpacity onPress={() => this.tapOpenImagePreview(0)}>
                        <Image source={{ uri: post.media[0].sm }} style={styles.postImg} />
                    </TouchableOpacity>
                }

                {/* Image Post */}
                {post.type == 'photo' && post.media.length != 0 && post.media.length > 1 &&
                    <View style={styles.postImgSmall}>
                        <FBCollage style={{ width: '100%', height: 200, backgroundColor: colors.background, borderRadius: 5 }}
                            spacing={8}
                            borderRadius={5}
                            images={images}
                            imageOnPress={(index, images) => this.tapOpenImagePreview(index)}
                        />
                    </View>
                }

                <Modal visible={showImagePreview} transparent={true} onRequestClose={this.tapCloseImagePreview}>
                    <ImageViewer imageUrls={imageUrls} index={imageIndex} onSwipeDown={this.tapCloseImagePreview} enableSwipeDown={true} />
                </Modal>

                {/* Link Post */}
                {post.type == 'link' && post.preview != undefined &&
                    <TouchableOpacity style={styles.previewBox} onPress={this.tapLinkPreview}>
                        {hasPreviewProvider &&
                            <View style={styles.previewHeader}>
                                <Image source={{ uri: post.preview.provider.faviconUrl }} style={styles.previewFavIcon} />
                                <Text style={{ ...styles.previewHeaderLabel, fontFamily: fonts.regular }}>
                                    {post.preview.provider.displayName}
                                </Text>
                            </View>
                        }
                        {hasPreviewImages &&
                            <Image source={{ uri: post.preview.images[0].url }} style={styles.previewContent} />
                        }
                        <Text style={{ ...styles.previewLabel, fontFamily: fonts.regular }}>
                            {post.preview.title}
                        </Text>
                    </TouchableOpacity>
                }
                {/* <View key={post.postTag1} style={{ ...styles.topSeparatorLine, backgroundColor: colors.gray }} /> */}
                <Divider style={{ margin: 10, marginBottom: 5, marginTop: 5 }}/>
            </React.Fragment>
        )
    }

    renderViewMore = (onPress) => {
        const { colors, fonts } = this.props.theme
        return (
            <Text onPress={onPress} style={{ ...styles.viewMoreTextCont, fontFamily: fonts.semiBold, color: colors.secondary }}>
                View more
            </Text>
        )
    }

    renderViewLess = (onPress) => {
        const { colors, fonts } = this.props.theme
        return (
            <Text onPress={onPress} style={{ ...styles.viewMoreTextCont, fontFamily: fonts.semiBold, color: colors.secondary }}>
                View less
            </Text>
        )
    }

    tapLinkPreview = async () => {
        const { post, browserProps } = this.props
        const { preview } = post

        if (preview.url) {
            try {
                const url = preview.url
                if (await InAppBrowser.isAvailable()) {
                    await InAppBrowser.open(url, browserProps)
                } else {
                    Linking.openURL(url)
                }
            } catch (error) {
                Alert.alert(error.message)
            }
        }
    }

    tapOpenImagePreview = (index = 0) => {
        const { post } = this.props;
        const images = post.media.map(item => {
            item.url = item.md
            return item
        })

        this.setState({ showImagePreview: true, imageUrls: images, imageIndex: index })
    }

    tapCloseImagePreview = () => {
        this.setState({ showImagePreview: false, imageUrls: [], imageIndex: 0 })
    }
}

const mapStateToProps = (state) => {
    const _state = {
        browserProps: state.feed.browserProps || {}
    };

    return _state;
};


export default connect(mapStateToProps, null)(withTheme(PostPreviewComponent))
