/*
 * Created by Justice on Wed Nov 04 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { withTheme, Menu, Divider } from 'react-native-paper'
import { styles } from './style'
import moreIcon from 'app/assets/moreIcon.png'
import blockIcon from 'app/assets/blockIcon.png'
import unregUser from 'app/assets/unregUser.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'
import PageLoader from 'app/features/shared/page-loader/components/index'

import { actBlockUser, actReportUser, actDeletePost, actFlagPost } from './../actions/index';

export class PostHeaderComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { isMenuVisible: false }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.error) {
            alert(nextProps.error);
        }

        return null
    }

    render() {
        const { post, currentUserId } = this.props
        const { colors, fonts } = this.props.theme
        const { isMenuVisible } = this.state;
        const isOwner = currentUserId == post.user?.id ?? false
        const isBlocked = post.viewer?.is_blocked ?? false
        const { isFlagPostLoading, isDeletePostLoading } = post
        const showMenuLoading = isFlagPostLoading == true || isDeletePostLoading == true
        const username = post.user?.username ?? "Guest"
        const nickname = post.user?.nickname ?? "Guest"
        const avatar = post.user?.avatar?.sm
        const userIsVerified = post.user?.show_verified_badge ?? false
        const userHasAvatar = avatar != undefined

        return (
            <View style={styles.postHeader}>
                <TouchableOpacity onPress={this.tapUserProfile} styles={styles.avatar}>
                    <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatar} />
                </TouchableOpacity>
                <View style={styles.personInfoCont}>
                    <TouchableOpacity onPress={this.tapUserProfile} style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.nicktxt, fontFamily: fonts.regular, color: colors.dark }} numberOfLines={1}>
                            {nickname}
                        </Text>
                        {userIsVerified &&
                            <Image source={verifiedIcon} style={styles.verifiedIcon} />
                        }
                    </TouchableOpacity>
                    <Text style={{ ...styles.nametxt, fontFamily: fonts.regular, color: colors.gray }}>
                        {`@${username}  ???  ${post.datePostedTimeAgo || ''}`}
                    </Text>
                </View>
                <Menu visible={isMenuVisible} onDismiss={this.tapPostOptions}
                    anchor={
                        <View>
                            {showMenuLoading == false &&
                                <TouchableOpacity onPress={this.tapPostOptions}>
                                    <Image source={moreIcon} />
                                </TouchableOpacity>
                            }
                            {showMenuLoading &&
                                <PageLoader margin={0} marginTop={0} />
                            }
                        </View>
                    }
                >
                    {isOwner == false &&
                        <React.Fragment>
                            <Menu.Item icon="flag" onPress={this.selectFlagMenu} title="Flag user" />
                            {isBlocked == false &&
                                <Menu.Item onPress={this.selectBlockMenu} title="Block user"
                                    icon={({ size, color }) => (
                                        <Image
                                            source={blockIcon}
                                            style={{ width: size, height: size, tintColor: color }}
                                        />
                                    )}
                                />
                            }
                            <Divider />
                            <Menu.Item icon="flag" onPress={this.selectFlagPostMenu} title="Flag post" />
                        </React.Fragment>
                    }
                    {isOwner == true &&
                        <Menu.Item icon="delete" onPress={this.selectDeleteMenu} title="Delete post" />
                    }
                </Menu>
            </View>
        )
    }

    tapUserProfile = () => {
        const { post } = this.props
        const userId = post.user?.id
        const userName = post.user?.username

        if (userId && userName) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }

    tapPostOptions = () => {
        this.setState({ isMenuVisible: !this.state.isMenuVisible })
    }

    selectDeleteMenu = () => {
        const { post } = this.props
        const { id, type, is_legacy } = post

        if (id != undefined && type != undefined && is_legacy != undefined) {
            this.props.doDeletePost(id, type, is_legacy)
        }

        this.tapPostOptions()
    }

    selectFlagPostMenu = () => {
        const { post } = this.props
        const { id, type, is_legacy } = post

        if (id != undefined && type != undefined && is_legacy != undefined) {
            this.props.doFlagPost(id, type, is_legacy)
        }

        this.tapPostOptions()
    }

    selectBlockMenu = () => {
        this.tapPostOptions()

        const { post, pageLocation } = this.props
        const userId = post.user.id

        if (userId) {
            this.props.doBlockUser(userId, pageLocation)
        }
    }

    selectFlagMenu = () => {
        this.tapPostOptions()

        const { post } = this.props
        const userId = post.user.id

        if (userId) {
            this.props.doReportUser(userId)
        }
    }
}

const mapStateToProps = (state) => {
    const _state = {
        pageLocation: state.root.currentPageLocation,
        blockIsLoading: state.feed.blockIsLoading,
        reportIsLoading: state.feed.reportIsLoading,
        currentUserId: state.profile.userId
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doReportUser: (userId) => dispatch(actReportUser(userId)),
        doBlockUser: (userId, pageLocation) => dispatch(actBlockUser(userId, pageLocation)),
        doDeletePost: (postId, postType, postIsLegacy) => dispatch(actDeletePost(postId, postType, postIsLegacy)),
        doFlagPost: (postId, postType, postIsLegacy) => dispatch(actFlagPost(postId, postType, postIsLegacy)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PostHeaderComponent))
