/*
 * Created by Justice on Thu Jan 28 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Image, Keyboard } from 'react-native'
import { WebView } from 'react-native-webview'
import { GiftedChat } from 'react-native-gifted-chat'
import { withTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChatBubbleComponent from './bubble'
import { styles } from './style'

import Echo from "laravel-echo";
import PusherNative from 'pusher-js/react-native';

import commentIcon from 'app/assets/commentIcon.png'
import groupIcon from 'app/assets/stat3.png'

import { actLoadChatMessages, actSendChatMessage, actSuccessSendMessage, actLeaveChatRoom, actJoinChatRoom, actLoadChatRoomInfo } from './../actions/index';

class ChatThreadComponent extends Component {

    constructor(props) {
        super(props)
        this.listView = React.createRef();
        this.state = { isKeyboadVisible: false }
    }

    componentDidMount() {
        const roomId = this.props.route.params?.roomId
        const roomType = this.props.route.params?.chatRoom?.type
        const chatInfo = this.props.chatInfo

        if (roomId) {
            this.props.doJoinChatRoom(roomId)
            this.props.doLoadChatMessages(roomId, 0)
        }

        if (roomId && roomType && roomType == 'ama') {
            this.props.doLoadChatRoomInfo(roomId)
        }

        setTimeout(() => { this.setupChatRoomEvents() }, 100)

        // set keyboard observers
        if (chatInfo != undefined) {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
                this.setState({
                    isKeyboadVisible: true
                });
            })
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                this.setState({
                    isKeyboadVisible: false
                });
            })
        }
    }

    componentWillUnmount() {
        const { echo } = this.state
        const roomId = this.props.route.params?.roomId

        if (roomId && echo) {
            echo.leave(roomId)
            this.props.doLeaveChatRoom(roomId)
            this.setState({ echo: null })
        }

        // remove keyboard observers
        this.keyboardDidShowListener?.remove();
        this.keyboardDidHideListener?.remove();
    }

    render() {
        const { userId, messages, continuePagination, chatInfo } = this.props
        const { isKeyboadVisible } = this.state

        return (
            <React.Fragment>
                {chatInfo != undefined && isKeyboadVisible == false &&
                    this.renderBanner()
                }
                {chatInfo != undefined && isKeyboadVisible == false &&
                    this.renderBannerFooter()
                }
                {chatInfo != undefined && isKeyboadVisible == true &&
                    this.renderHeader()
                }
                {chatInfo == undefined &&
                    this.renderHeader()
                }
                <GiftedChat
                    inverted={false}
                    showAvatarForEveryMessage={true}
                    showUserAvatar={true}
                    loadEarlier={continuePagination}
                    ref={ref => this.listView = ref}
                    messagesContainerStyle={{ backgroundColor: 'white' }}
                    messages={messages}
                    renderBubble={this.renderBubble}
                    renderSend={this.renderSend}
                    onPressAvatar={(user) => this.tapUser(user)}
                    onLoadEarlier={() => this.paginate()}
                    onSend={messages => this.onSend(messages)}
                    user={{ _id: userId }}
                />
            </React.Fragment>
        )
    }

    renderBanner = () => {
        const { chatInfo } = this.props
        return (
            <View style={styles.cardInfoCont}>
                <WebView source={{ html: chatInfo.embed }} scalesPageToFit={false} useWebKit={false} bounces={false} scrollEnabled={false} />
            </View>
        )
    }

    renderBannerFooter = () => {
        const { chatInfo } = this.props
        const chatRoom = this.props.route.params?.chatRoom ?? {}
        const totalDesc = chatRoom.totalDesc ?? chatRoom.total
        const { colors, fonts } = this.props.theme
        const { mutedUsers } = this.props

        return (
            <View style={{ ...styles.cardTouchCont, backgroundColor: colors.background }} onPress={this.tapRoom}>
                <View style={styles.cardInfoRow}>
                    <Text style={{ fontFamily: fonts.bold, color: colors.dark, ...styles.roomTitle }} numberOfLines={2}>
                        {chatInfo.title}
                    </Text>
                    <Text style={{ fontFamily: fonts.regular, color: colors.dark, ...styles.roomSubtitle }} numberOfLines={3}>
                        {chatInfo.description}
                    </Text>
                </View>
                <View style={styles.cardActionRow}>
                    <TouchableOpacity style={styles.cardActionRowButton} disabled={mutedUsers.length == 0} onPress={this.tapMutedUsers}>
                        <Icon name="volume-off" style={styles.groupIcon} size={20} color={colors.gray} />
                        <Text style={{ fontFamily: fonts.regular, color: colors.dark, ...styles.countTitle }}>
                            {mutedUsers.length}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderHeader = () => {
        const chatRoom = this.props.route.params?.chatRoom ?? {}
        const totalDesc = chatRoom.totalDesc ?? chatRoom.total
        const { colors, fonts } = this.props.theme
        const { mutedUsers } = this.props

        return (
            <View style={{ ...styles.cardTouchCont, backgroundColor: colors.background }} onPress={this.tapRoom}>
                <View style={styles.cardInfoFirstRow}>
                    <Image source={commentIcon} style={styles.commentIcon} />
                </View>
                <View style={styles.cardInfoSecondRow}>
                    <Text style={{ fontFamily: fonts.bold, color: colors.dark, ...styles.roomTitle }} numberOfLines={1}>
                        {chatRoom.name}
                    </Text>
                </View>
                <View style={styles.cardInfoThirdRow}>
                    <TouchableOpacity style={styles.cardButtonCont} disabled={mutedUsers.length == 0} onPress={this.tapMutedUsers}>
                        <Icon name="volume-off" style={styles.groupIcon} size={20} color={colors.gray} />
                        <Text style={{ fontFamily: fonts.regular, color: colors.dark, ...styles.countTitle }}>
                            {mutedUsers.length}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardButtonCont}>
                        <Image source={groupIcon} style={styles.groupIcon} />
                        <Text style={{ fontFamily: fonts.regular, color: colors.dark, ...styles.countTitle }}>
                            {totalDesc}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderSend = (props) => {
        const { text, onSend, user, messageIdGenerator } = props
        const { colors, fonts } = this.props.theme
        const isEmptyText = _.isEmpty(text)
        const bgColor = isEmptyText ? colors.gray : colors.secondary
        return (
            <TouchableOpacity disabled={isEmptyText} style={{ backgroundColor: bgColor, ...styles.sendButton }}
                onPress={() => {
                    if (text && onSend) {
                        onSend({ text: text.trim(), user: user, _id: messageIdGenerator() }, true);
                    }
                }}>
                <Text style={{ font: fonts.semiBold, ...styles.sendButtonTitle }}>
                    Send
                </Text>
            </TouchableOpacity>
        )
    }

    renderBubble = (props) => {
        const { colors, fonts } = this.props.theme

        return (
            <ChatBubbleComponent
                {...props}
                bubbleTimeAgo={props.currentMessage?.timeAgo ?? ''}
                textStyle={{
                    title: {
                        color: colors.dark,
                        fontFamily: fonts.bold,
                        fontSize: 16,
                        flexDirection: 'row'
                    },
                    subtitle: {
                        color: colors.gray,
                        fontFamily: fonts.regular,
                        fontSize: 14
                    },
                    left: {
                        color: colors.dark,
                        fontFamily: fonts.regular,
                        fontSize: 15
                    },
                    right: {
                        color: 'white',
                        fontFamily: fonts.regular,
                        fontSize: 15
                    }
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: colors.bubble,
                    },
                    right: {
                        backgroundColor: colors.secondary
                    },
                }}
            />
        );
    }

    setupChatRoomEvents = () => {
        const { userToken, userId } = this.props
        const { pusherConfig, pusherEventName } = this.props
        const roomId = this.props.route.params?.roomId

        if (roomId && userToken && userId && pusherConfig && pusherEventName) {
            const options = {
                ...pusherConfig,
                auth: {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + userToken
                    }
                }
            }

            const PusherClient = new PusherNative(options.key, options);
            const echo = new Echo({ client: PusherClient, ...options });
            this.setState({ echo })

            echo.channel(roomId)
                .listen(pusherEventName, message => {
                    if (message.message && message.user) {
                        this.props.doSuccessSendMessage(roomId, message);
                    }
                });

            // // global observer
            // PusherClient.channel(roomId).bind_global(event => {
            //     console.log('GLOBAL EVENT', event);
            // });
        }
    }

    onSend = (message) => {
        const text = message[0].text
        const roomId = this.props.route.params?.roomId
        const { pageLocation } = this.props

        if (_.isEmpty(text) == false && roomId) {
            this.props.doSendChatMessage(roomId, text, pageLocation);
        }
    }

    tapUser = (user) => {
        const { userId } = this.props
        const roomId = this.props.route.params?.roomId

        if (user._id != userId && roomId != undefined) {
            this.props.navigation.navigate('RoomInfoComponent', { user, roomId })
        }
    }

    tapMutedUsers = () => {
        const roomId = this.props.route.params?.roomId
        this.props.navigation.navigate('MutedUsersListComponent', { roomId })
    }

    paginate = () => {
        const { continuePagination, offset, isLoadingMessages } = this.props
        const roomId = this.props.route.params?.roomId

        if (continuePagination && isLoadingMessages == false) {
            this.props.doLoadChatMessages(roomId, offset)
        }
    }
}

const mapStateToProps = (state, ownProps) => {

    const roomId = ownProps.route.params?.roomId

    const msgs = state.chatRoom.messages || []
    let messages = []
    let isLoadingInfo = false
    let chatInfo
    let mutedUsers = []
    let offset = 0
    let offsetEnd = 0
    let continuePagination = false
    let index = _.findIndex(msgs, { roomId: roomId })

    // find the messages in the state
    if (roomId && index != -1) {
        const message = state.chatRoom.messages[index]
        chatInfo = message?.info
        isLoadingInfo = message.isLoadingInfo
        messages = (message.messages ?? []).filter(msg => {
            return msg.isHidden == false || msg.isHidden == undefined
        })
        mutedUsers = message.mutedUsers ?? []
        // for pagination
        offset = messages.length
        offsetEnd = message.messagesTotalCount ?? 0
        continuePagination = offset < offsetEnd
    }

    const _state = {
        messages, mutedUsers, continuePagination,
        offset, offsetEnd, isLoadingInfo, chatInfo,
        pusherConfig: state.chatRoom.pusherConfig,
        pusherEventName: state.chatRoom.pusherEventName,
        userToken: state.chatRoom.userToken,
        userId: state.profile.userId,
        isLoadingMessages: state.chatRoom.isLoadingMessages,
        pageLocation: state.root.currentPageLocation
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadChatMessages: (roomId, offset) => dispatch(actLoadChatMessages(roomId, offset)),
        doSendChatMessage: (roomId, message, pageLocation) => dispatch(actSendChatMessage(roomId, message, pageLocation)),
        doSuccessSendMessage: (roomId, message) => dispatch(actSuccessSendMessage(roomId, message)),
        doLeaveChatRoom: (roomId) => dispatch(actLeaveChatRoom(roomId)),
        doJoinChatRoom: (roomId) => dispatch(actJoinChatRoom(roomId)),
        doLoadChatRoomInfo: (roomId) => dispatch(actLoadChatRoomInfo(roomId))
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ChatThreadComponent))
