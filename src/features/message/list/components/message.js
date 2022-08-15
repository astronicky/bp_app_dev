/*
 * Created by Justice on Wed Dec 02 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { withTheme, Card } from 'react-native-paper'
import { styles } from './style'

import moreIcon from 'app/assets/moreIcon.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'

class MessageItemComponent extends Component {

    render() {
        const { thread } = this.props
        const threadId = thread?.thread_id ?? 0
        const { colors, fonts } = this.props.theme

        const roomName = thread.title ?? ''
        const isVerified = thread.recipientIsVerified
        const lastMessage = thread.lastMessage?.message ?? ''
        const timeAgo = thread.lastMessage?.createdTimeAgo ?? ''
        const bgColor = thread.read == false ? colors.neutral : "#ffffff"
        const avatarUrl = thread.lastMessage?.user?.avatar ?? ''

        return (
            <Card style={{ ...styles.cardCont, backgroundColor: bgColor }} key={threadId}>
                <TouchableOpacity style={styles.postHeader} onPress={() => this.tapThread(thread)} >
                    <View styles={styles.avatarCont}>
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                        {/* <View style={styles.onlineCont}>
                            <View style={{ ...styles.onlineIcon, backgroundColor: colors.success }} />
                        </View> */}
                    </View>
                    <View style={styles.personInfoCont}>
                        <View style={styles.nameCont}>
                            <Text style={{ ...styles.nicktxt, fontFamily: fonts.regular, color: colors.dark }} numberOfLines={1}>
                                {roomName + ' '}
                                {isVerified &&
                                    <Image source={verifiedIcon} style={styles.verifiedIcon} />
                                }
                            </Text>
                            <Text style={{ ...styles.nametxt, fontFamily: fonts.regular, color: colors.gray }}>
                                {`${timeAgo}`}
                            </Text>
                        </View>
                        <Text style={{ ...styles.msgtxt, fontFamily: fonts.regular, color: colors.dark }} numberOfLines={2}>
                            {lastMessage}
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Image source={moreIcon} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Card>
        )
    }

    tapThread = (thread) => {
        const title = thread.title ?? 'Conversation'
        this.props.navigation.navigate('MessageThread', { thread, title })
    }
}

const mapStateToProps = (state, ownProps) => {
    const _state = {

    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MessageItemComponent))