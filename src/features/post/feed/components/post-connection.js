/*
 * Created by Justice on Tue Jun 15 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withTheme, Divider } from 'react-native-paper'

import { Text, View, TouchableOpacity, Image } from 'react-native'

import { styles } from './style'
import unregUser from 'app/assets/unregUser.png'

export class PostConnectionComponent extends Component {
    render() {
        const { post } = this.props
        const hasInteraction = post.initiator != undefined
        return (
            <React.Fragment>
                {hasInteraction == true && this.renderItem()}
                {hasInteraction == true &&
                    <Divider style={{ margin: 10, marginTop: 5, marginBottom: 5 }} />
                }
            </React.Fragment>
        )
    }

    renderItem = () => {
        const { colors, fonts } = this.props.theme
        const { post } = this.props
        const user = post.initiator?.user?.nickname ?? 'User'
        const action = post.initiator?.action ?? 'reacted'
        const interactionMsg = `${action} with this post.`

        const avatar = post.initiator?.user?.avatar?.sm
        const userHasAvatar = avatar != undefined
        
        return (
            <View style={styles.connectionContainer}>
                <TouchableOpacity onPress={this.tapUserProfile} style={{ marginRight: 10 }}>
                    <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.smallAvatar} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.tapUserProfile}>
                    <Text style={{ fontFamily: fonts.semiBold, color: colors.black }}>
                        {user}
                    </Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: fonts.regular, color: colors.gray }}>
                    {' '}{interactionMsg}
                </Text>
            </View>
        )
    }

    tapUserProfile = () => {
        const { post } = this.props
        const userId = post.initiator?.user?.id
        const userName = post.initiator?.user?.username

        if (userId && userName) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }
}

export default connect(null, null)(withTheme(PostConnectionComponent))