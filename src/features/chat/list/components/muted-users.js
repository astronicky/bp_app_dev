/*
 * Created by Justice on Tue Mar 16 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { FlatList, Text, View, Image } from 'react-native'
import { withTheme, IconButton } from 'react-native-paper'
import { styles } from './style'
import unregUser from 'app/assets/unregUser.png'

import { actUnmuteUserMessages } from './../actions/index';

export class MutedUsersListComponent extends Component {

    render() {
        const { mutedUsers } = this.props
        return (
            <FlatList data={mutedUsers} keyboardShouldPersistTaps='always'
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={(item, idx) => this.renderItem(item.item, idx)}
                extraData={this.props}
            />
        )
    }

    renderItem = (user, index) => {
        const { colors, fonts } = this.props.theme
        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"
        const avatar = user?.avatar?.md
        const userHasAvatar = avatar != undefined

        return (
            <View style={styles.mutedUserCont} key={user.id}>
                <View style={styles.mutedPicCont}>
                    <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.mutedPic} />
                </View>
                <View style={styles.mutedInfoCont}>
                    <Text style={{ ...styles.infoTitle, fontFamily: fonts.bold, color: colors.dark }}>
                        {nickname}
                    </Text>
                    <Text style={{ ...styles.infoSubtitle, fontFamily: fonts.regular, color: colors.gray }}>
                        @{username}
                    </Text>
                </View>
                <View style={styles.mutedActionCont}>
                    <IconButton icon="volume-high" size={30} color={colors.secondary} style={styles.mutedActionButton} onPress={() => this.tapUnmute(user)} />
                </View>
            </View>
        )
    }

    tapUnmute = (user) => {
        const roomId = this.props.route.params?.roomId
        if (user.id != undefined && roomId != undefined) {
            this.props.doUnmuteUserMessages(roomId, user.id)
            this.props.navigation.goBack()
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const roomId = ownProps.route.params?.roomId

    const msgs = state.chatRoom.messages || []
    const users = state.profile.users || []

    let mutedUsers = []
    let index = _.findIndex(msgs, { roomId: roomId })

    // find the messages in the state
    if (roomId && index != -1) {
        const message = state.chatRoom.messages[index]
        const mutedUserIds = message.mutedUsers ?? []
        mutedUserIds.forEach(userId => {
            let userIndex = _.findIndex(users, { id: userId })
            if (userIndex != -1) {
                let user = users[userIndex]
                mutedUsers.push(user)
            }
        })
    }

    const _state = {
        mutedUsers
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doUnmuteUserMessages: (roomId, userId) => dispatch(actUnmuteUserMessages(roomId, userId)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MutedUsersListComponent))