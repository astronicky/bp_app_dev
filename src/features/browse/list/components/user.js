/*
 * Created by Justice on Tue Dec 01 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { withTheme, Card, Menu } from 'react-native-paper'
import { styles } from './style'

import moreIcon from 'app/assets/moreIcon.png'
import blockIcon from 'app/assets/blockIcon.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'
import PageLoader from 'app/features/shared/page-loader/components/index'

import { actGiveUserVerdict, actBlockUser, actReportUser } from './../actions/index'

class UserItemComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { isMenuVisible: false }
    }

    render() {
        const { user } = this.props
        const { isMenuVisible } = this.state
        const userId = user?.id ?? 0
        const { colors, fonts } = this.props.theme
        const userIsVerified = user?.show_verified_badge ?? false
        const avatarUri = user?.avatar?.sm ?? ''
        const isLoading = user?.isVerdictLoading ?? false
        const isFollowing = user?.viewer?.is_follower ?? false
        const isSelf = user?.viewer?.self ?? false
        const followAction = isFollowing ? 'Unfollow' : 'Follow'
        const presenseColor = user.isOnline ? colors.success : colors.gray
        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"

        return (
            <Card style={{ marginBottom: 5, height: 140 }} key={userId}>
                <TouchableOpacity style={styles.postHeader} onPress={this.tapUserProfile} >
                    <View style={styles.avatarCont}>
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                        <View style={styles.onlineCont}>
                            <View style={{ ...styles.onlineIcon, backgroundColor: presenseColor }} />
                        </View>
                    </View>
                    <View style={styles.personInfoCont}>
                        <View style={styles.nameCont}>
                            <Text style={{ ...styles.nicktxt, fontFamily: fonts.regular, color: colors.dark }}>
                                {nickname}
                            </Text>
                            {userIsVerified &&
                                <Image source={verifiedIcon} style={styles.verifiedIcon} />
                            }
                        </View>
                        <Text style={{ ...styles.nametxt, fontFamily: fonts.regular, color: colors.gray }}>
                            @{username}
                        </Text>
                        <Text style={{ ...styles.nametxt, fontFamily: fonts.regular, color: colors.gray }}>
                            {user.followersDesc} • {user.location ?? ''}
                        </Text>
                    </View>
                    <Menu visible={isMenuVisible} onDismiss={this.tapUserOptions}
                        anchor={
                            <View style={styles.moreIconCont}>
                                <TouchableOpacity onPress={this.tapUserOptions} style={styles.moreIconCont}>
                                    <Image source={moreIcon} />
                                </TouchableOpacity>
                            </View>
                        }
                    >
                        <Menu.Item icon="flag" onPress={this.selectFlagMenu} title="Report" />
                        <Menu.Item onPress={this.selectBlockMenu} title="Block"
                            icon={({ size, color }) => (
                                <Image
                                    source={blockIcon}
                                    style={{ width: size, height: size, tintColor: color }}
                                />
                            )}
                        />
                    </Menu>
                </TouchableOpacity>
                {isLoading == true &&
                    <PageLoader marginTop={10} />
                }
                {isLoading == false &&
                    <React.Fragment>
                        <TouchableOpacity disabled={isSelf} style={{ ...styles.followBtn, borderTopColor: colors.gray }}
                            onPress={() => this.tapUserVerdict(isFollowing)}>
                            <Text style={{ ...styles.bigBtnText, fontFamily: fonts.regular, color: colors.secondary }}>
                                {followAction}
                            </Text>
                        </TouchableOpacity>
                    </React.Fragment>
                }
            </Card>
        )
    }

    tapUserProfile = () => {
        const { user } = this.props
        const userId = user?.id ?? 0
        const userName = user?.username

        if (userId && userName) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }

    tapUserVerdict = (isFollowing) => {
        const { user, pageLocation } = this.props
        const userId = user?.id ?? 0
        const verdict = isFollowing ? 'unfollow' : 'follow'

        if (userId) {
            this.props.doGiveUserVerdict(userId, verdict, pageLocation)
        }
    }

    tapUserOptions = () => {
        this.setState({ isMenuVisible: !this.state.isMenuVisible })
    }

    selectBlockMenu = () => {
        this.tapUserOptions()

        const { user, pageLocation } = this.props
        const userId = user?.id ?? 0

        if (userId) {
            this.props.doBlockUser(userId, pageLocation)
        }
    }

    selectFlagMenu = () => {
        this.tapUserOptions()

        const { user } = this.props
        const userId = user?.id ?? 0

        if (userId) {
            this.props.doReportUser(userId)
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const _state = {
        pageLocation: state.root.currentPageLocation
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doGiveUserVerdict: (userId, verdict, pageLocation) => dispatch(actGiveUserVerdict(userId, verdict, pageLocation)),
        doReportUser: (userId) => dispatch(actReportUser(userId)),
        doBlockUser: (userId, pageLocation) => dispatch(actBlockUser(userId, pageLocation)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(UserItemComponent))