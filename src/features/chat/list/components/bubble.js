/*
 * Created by Justice on Sat Mar 20 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import verifiedIcon from 'app/assets/verifiedIcon.png'

export class ChatBubbleComponent extends Component {
    render() {
        const { wrapperStyle, textStyle, user, currentMessage, bubbleTimeAgo } = this.props
        const ownerId = user._id
        const userId = currentMessage.user?.id

        const titleStyle = textStyle.title ?? {}
        const subtitleStyle = textStyle.subtitle ?? {}

        const messageTextStyle = ownerId == userId
            ? textStyle.right
            : textStyle.left

        const messageWrapperStyle = ownerId == userId
            ? wrapperStyle.right
            : wrapperStyle.left

        const message = currentMessage.message ?? ''
        const username = ownerId == userId ? '' : currentMessage.user?.name ?? 'Guest'
        const nickname = ownerId == userId ? '' : currentMessage.user?.nickname ?? 'Guest'
        const date = bubbleTimeAgo ?? ''
        const subtitle = ownerId == userId ? date : `${username} • ${date}`
        const isVerified = currentMessage.user?.show_verified_badge ?? false

        return (
            <View style={{ ...messageWrapperStyle, maxWidth: '85%', height: '96%', borderRadius: 8, padding: 10, paddingTop: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={titleStyle} numberOfLines={1}>
                        {nickname + ' '} 
                        {isVerified && (ownerId != userId) &&
                            <Image source={verifiedIcon} style={{ width: 13, height: 16, marginTop: 5, marginLeft: 5, resizeMode: 'stretch' }} />
                        }
                        <Text style={subtitleStyle}>
                            {' ' + subtitle}
                        </Text>
                    </Text>
                </View>
                <Text style={{ ...messageTextStyle, margin: 10, marginLeft: 0, marginTop: 5 }}>
                    {message}
                </Text>
            </View>
        )
    }
}

export default ChatBubbleComponent
