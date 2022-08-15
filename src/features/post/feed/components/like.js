/*
 * Created by Justice on Wed Nov 04 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { styles } from './style'
import { withTheme } from 'react-native-paper'
import { actGivePostVerdict } from '../actions/index'

import likeIcon from 'app/assets/likeIcon.png'
import likedIcon from 'app/assets/likedIcon.png'
import commentIcon from 'app/assets/commentIcon.png'

export class LikeComponent extends Component {

    render() {
        const { colors, fonts } = this.props.theme
        const { post } = this.props

        // check if user liked this post
        const liked = ((post.viewer || {}).liked_this || false)
        const commentsCount = (post.comments || []).length
        const totalCommentsCount = ((post.post_counts || {}).comments || 0)
        const hasMoreComments = totalCommentsCount > commentsCount

        // check if verdict is still loading
        const isVerdictLoading = post.isVerdictLoading
        const isBlocked = post.viewer?.is_blocked ?? false
        const isLegacy = post.is_legacy == 0 ? false : true

        return (
            <View style={styles.commentsHeader}>
                <View style={styles.flex} />
                <View style={styles.flex}>
                    <TouchableOpacity disabled={true}>
                        <View style={{ ...styles.likeButton, backgroundColor: 'transparent' }}>
                            <Image source={commentIcon} style={styles.commentCountIcon} />
                            <Text style={{ ...styles.likesCount, color: colors.darkGray, fontFamily: fonts.semiBold }}>
                                {post.post_counts.comments}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.likeSeparator}/>
                    <TouchableOpacity disabled={isVerdictLoading == true || isBlocked == true || isLegacy == true} onPress={this.tapGiveVerdict}>
                        <View style={{ ...styles.likeButton, backgroundColor: liked ? colors.secondary : 'transparent' }}>
                            <Image source={liked ? likedIcon : likeIcon} style={styles.likeIcon} />
                            <Text style={{ ...styles.likesCount, color: liked ? 'white' : colors.darkGray, fontFamily: fonts.semiBold }}>
                                {post.post_counts.likesDesc}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    tapGiveVerdict = () => {
        const { post, pageLocation } = this.props
        const ownerId = post.user?.id
        const liked = ((post.viewer || {}).liked_this || false)
        const newVerdict = liked == true ? "unlike" : "like"

        if (post) {
            this.props.doGivePostVerdict(ownerId, post.id, newVerdict, pageLocation)
        }
    }
}

const mapStateToProps = (state) => {
    const _state = {
        pageLocation: state.root.currentPageLocation,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doGivePostVerdict: (ownerId, postId, verdict, postLocation) => dispatch(actGivePostVerdict(ownerId, postId, verdict, postLocation)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LikeComponent))
