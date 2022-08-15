/*
 * Created by Justice on Mon Nov 16 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { Text, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { withTheme, Card } from 'react-native-paper'

import EmptySetView from 'app/features/shared/empty/components/index';
import PageLoader from 'app/features/shared/page-loader/components/index'

import { styles } from './style';
import { actLoadUserFollower, actLoadUserFollowing, actGiveUserVerdict } from '../actions/index';

import unregUser from 'app/assets/unregUser.png'
import msgBtn from 'app/assets/msg-btn.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'
import followBtn from 'app/assets/follow-btn.png'
import unfollowBtn from 'app/assets/unfollow-btn.png'

export class AudienceListComponent extends Component {

    componentDidMount() {
        const type = this.props.route.params?.type ?? 'follower'
        const userId = this.props.route.params?.userId

        if (type == 'follower') {
            this.props.doLoadUserFollower(0, userId)
        } else {
            this.props.doLoadUserFollowing(0, userId)
        }
    }

    render() {

        const { users, continuePagination, isLoading } = this.props
        const showEmptySet = isLoading == false && users.length == 0
        return (
            <React.Fragment>
                {showEmptySet &&
                    <ScrollView>
                        <EmptySetView title="No users found" />
                    </ScrollView>
                }
                {showEmptySet == false &&
                    <View style={styles.container}>
                        {isLoading &&
                            <React.Fragment>
                                <View style={styles.loaderCont}>
                                    <PageLoader type="large" />
                                </View>
                            </React.Fragment>
                        }
                        {isLoading == false &&
                            <FlatList data={users} keyboardShouldPersistTaps='always'
                                keyExtractor={(item, idx) => idx.toString()}
                                renderItem={(item, idx) => this.renderItem(item.item, idx)}
                                extraData={this.props}
                                onEndReachedThreshold={1}
                                onEndReached={this.paginateList}
                                ListFooterComponent={continuePagination
                                    ? <PageLoader />
                                    : null
                                }
                            />
                        }
                    </View>
                }
            </React.Fragment>
        )
    }

    renderItem = (user, index) => {
        const { colors, fonts } = this.props.theme
        const userIsVerified = user.show_verified_badge ?? false
        const userIsFollowing = user.viewer?.is_follower ?? false
        const isSelf = user.viewer?.self ?? false
        const userVerdictIsLoading = user.isUserVerdictLoading ?? false

        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"
        const avatar = user?.avatar?.md
        const userHasAvatar = avatar != undefined

        return (
            <Card style={{ marginBottom: 10, height: 90 }} key={user.id}>
                <TouchableOpacity style={styles.postHeader} onPress={() => this.tapUserProfile(user)} >
                    <View styles={styles.avatar}>
                        <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatar} />
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
                            {`@${username}`}
                        </Text>
                    </View>
                    <View style={styles.actionCont}>
                        {isSelf == false &&
                            <React.Fragment>
                                {userVerdictIsLoading == false &&
                                    <TouchableOpacity onPress={() => this.tapGiveVerdict(user)} disabled={userVerdictIsLoading}>
                                        <Image source={userIsFollowing ? unfollowBtn : followBtn} style={styles.verdictButton} />
                                    </TouchableOpacity>
                                }
                                {userVerdictIsLoading == true &&
                                    <View style={{ ...styles.verdictButton, paddingTop: 0, paddingRight: 0 }}>
                                        <PageLoader marginTop={15} />
                                    </View>
                                }
                                <TouchableOpacity onPress={() => this.tapMessage(user)} disabled={userVerdictIsLoading}>
                                    <Image source={msgBtn} style={styles.verdictButton} />
                                </TouchableOpacity>
                            </React.Fragment>
                        }

                    </View>
                </TouchableOpacity>
            </Card>
        )
    }

    paginateList = () => {
        // increment page
        const { continuePagination, offset } = this.props
        const userId = this.props.route.params?.userId

        // paginate now
        if (continuePagination) {
            const type = this.props.route.params?.type ?? 'follower'
            if (type == 'follower') {
                this.props.doLoadUserFollower(offset, userId)
            } else {
                this.props.doLoadUserFollowing(offset, userId)
            }
        }
    }

    tapUserProfile = (user) => {
        const userId = user?.id
        const userName = user?.username

        if (userId && userName) {
            this.props.navigation.push('Profile', { userId, userName })
        }
    }

    tapGiveVerdict = (user) => {
        const ownerId = this.props.route.params?.userId
        const userId = user.id
        const userIsFollowing = user.viewer?.is_follower ?? false
        const isSelf = user.viewer?.self ?? false
        const userVerdictIsLoading = user.isUserVerdictLoading ?? false
        const type = this.props.route.params?.type
        const { pageLocation } = this.props

        if (userVerdictIsLoading == false && isSelf == false && userId && ownerId && type) {
            const verdict = userIsFollowing ? "unfollow" : "follow"
            this.props.doGiveUserVerdict(ownerId, userId, verdict, type, pageLocation)
        }
    }

    tapMessage = (user) => {
        const { ownerUserId } = this.props
        const { id, nickname } = user

        if (id && ownerUserId && nickname) {
            const thread = { thread_id: `${id}-${ownerUserId}` }
            this.props.navigation.navigate('MessageThread', { thread, title: nickname, reloadThreadsAfterSend: true })
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    // NOTE: find the user in the state.audience array
    const userId = ownProps.route.params?.userId
    const userList = state.audience.users || []
    const userIndex = _.findIndex(userList, { id: userId })
    const index = userIndex != -1 ? userIndex : 0
    const type = ownProps.route.params?.type ?? 'follower'
    const audience = state.audience.users ? state.audience.users[index] : {}

    const users = type == 'follower'
        ? audience.followers ?? []
        : audience.following ?? []

    const offset = users.length
    const offsetEnd = audience.total ?? 0
    const isLoading = audience.isLoading ?? false
    const continuePagination = offset < offsetEnd

    const _state = {
        type,
        users,
        offset,
        continuePagination,
        isLoading,
        ownerUserId: state.profile.userId,
        pageLocation: state.root.currentPageLocation,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadUserFollower: (offset, userId) => dispatch(actLoadUserFollower(offset, userId)),
        doLoadUserFollowing: (offset, userId) => dispatch(actLoadUserFollowing(offset, userId)),
        doGiveUserVerdict: (ownerId, userId, verdict, mode, pageLocation) => dispatch(actGiveUserVerdict(ownerId, userId, verdict, mode, pageLocation)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AudienceListComponent))
