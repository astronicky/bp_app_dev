/*
 * Created by Justice on Mon Mar 15 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withTheme, Divider, Button } from 'react-native-paper'
import { ScrollView, Text, View, Image } from 'react-native'
import PageLoader from 'app/features/shared/page-loader/components/index'
import { actLoadUserData, actGiveUserVerdict } from '../../../user/profile/actions/index'
import { actMuteUserMessages } from './../actions/index'
import { styles } from './style'
import verifiedIcon from 'app/assets/verifiedIcon.png'

export class RoomInfoComponent extends Component {

    componentDidMount() {
        const user = this.props.route.params?.user ?? {}
        if (user._id != undefined && user.name != undefined) {
            this.props.doLoadUserData(user._id, user.name, false)
        }
    }

    render() {
        const { isLoading, user, isVerdictLoading } = this.props
        const { fonts, colors } = this.props.theme
        const _user = this.props.route.params?.user ?? {}
        const userIsFollowing = user?.viewer?.is_follower ?? false
        const userIsVerified = user?.show_verified_badge ?? false
        // icons name: volume-off/volume-high

        return (
            <ScrollView style={styles.infoCont}>
                <View style={styles.infoUserCont}>
                    <View style={styles.infoUserInfoColumn}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ ...styles.infoTitle, fontFamily: fonts.bold, color: colors.dark }}>
                                {_user.nickname}
                            </Text>
                            {userIsVerified &&
                                <Image source={verifiedIcon} style={styles.verifiedIcon} />
                            }
                        </View>
                        <Text style={{ ...styles.infoSubtitle, fontFamily: fonts.regular, color: colors.gray }}>
                            @{_user.name}
                        </Text>
                        {user != undefined &&
                            <React.Fragment>
                                <Text style={{ ...styles.infoSubtitle, fontFamily: fonts.regular, color: colors.gray }}>
                                    {'\n'}{user.counts?.followersDesc ?? ''}
                                    {(user.counts?.followers ?? 0) <= 1 ? ' follower' : ' followers'}
                                </Text>
                                <Text style={{ ...styles.infoSubtitle, fontFamily: fonts.regular, color: colors.gray }}>
                                    {user.location}
                                </Text>
                            </React.Fragment>
                        }
                    </View>
                    <View style={styles.infoUserPicColumn}>
                        <Image source={{ uri: _user.avatar }} style={styles.infoPic} />
                        <Button mode="outlined" color={colors.secondary} style={{ ...styles.infoProfileButton, borderColor: colors.secondary }} onPress={this.tapUserProfile}>
                            Profile
                        </Button>
                    </View>
                </View>
                <Divider />
                <View style={styles.infoActionCont}>
                    {isLoading == true && user == undefined &&
                        <PageLoader />
                    }
                    {isLoading == false && user != undefined &&
                        <View style={styles.infoButtonCont}>
                            <Button mode="outlined" icon="volume-off" color={colors.secondary} style={{ ...styles.infoActionButton, borderColor: colors.secondary }} onPress={this.tapUserMute}>
                                Mute
                            </Button>
                            <Button loading={isVerdictLoading} disabled={isVerdictLoading == true} mode="outlined" color={colors.secondary} style={{ ...styles.infoActionButton, borderColor: colors.secondary }} onPress={this.tapGiveVerdict}>
                                {userIsFollowing == true ? 'Unfollow' : 'Follow'}
                            </Button>
                            <Button mode="outlined" icon="email" color={colors.secondary} style={{ ...styles.infoActionButton, borderColor: colors.secondary }} onPress={this.tapUserMessage}>
                                Message
                            </Button>
                        </View>
                    }
                </View>
            </ScrollView>
        )
    }

    tapUserProfile = () => {
        const user = this.props.route.params?.user ?? {}
        if (user._id != undefined && user.name != undefined) {
            this.props.navigation.navigate('Profile', { userId: user._id, userName: user.name })
        }
    }

    tapUserMessage = () => {
        const user = this.props.route.params?.user ?? {}
        const { ownerUserId } = this.props

        if (user._id != undefined && user.nickname != undefined && ownerUserId != undefined) {
            const thread = { thread_id: `${user._id}-${ownerUserId}` }
            this.props.navigation.navigate('MessageThread', { thread, title: user.nickname, reloadThreadsAfterSend: true })
        }
    }

    tapGiveVerdict = () => {
        const { user, pageLocation } = this.props

        if (user != undefined) {
            const userIsFollowing = user.viewer?.is_follower ?? false
            const verdict = userIsFollowing ? 'unfollow' : 'follow'
            this.props.doGiveUserVerdict(user.id, verdict, pageLocation)
        }
    }

    tapUserMute = () => {
        const roomId = this.props.route.params?.roomId
        const { user } = this.props
        if (user != undefined && roomId != undefined) {
            this.props.doMuteUserMessages(roomId, user.id)
            this.props.navigation.goBack()
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const userId = ownProps.route.params?.user._id
    const users = state.profile.users || []

    let index = _.findIndex(users, { id: userId })
    let user

    if (userId && index != -1) {
        user = state.profile.users[index]
    }

    const _state = {
        user,
        pageLocation: state.root.currentPageLocation,
        ownerUserId: state.profile.userId,
        isVerdictLoading: state.profile.isUserVerdictLoading,
        isLoading: state.profile.otherUserIsLoading ?? false
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doMuteUserMessages: (roomId, userId) => dispatch(actMuteUserMessages(roomId, userId)),
        doLoadUserData: (uid, uname, loadCurrentUserData) => dispatch(actLoadUserData(uid, uname, loadCurrentUserData)),
        doGiveUserVerdict: (userId, verdict, pageLocation) => dispatch(actGiveUserVerdict(userId, verdict, pageLocation)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RoomInfoComponent))