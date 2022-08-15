/*
 * Created by Justice on Wed Dec 02 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { Alert, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat'
import { withTheme } from 'react-native-paper'
import { styles } from './style'
import PageLoader from 'app/features/shared/page-loader/components/index'
import MessageBubbleComponent from './bubble'

import Echo from "laravel-echo";
import PusherNative from 'pusher-js/react-native';

import { actLoadThreadMessages, actSendThreadMessage, actSuccessSendMessage, actLoadMessageThreads, actMarkMessageThreadAsRead, actDeleteThreadCancel, actDeleteMessageThread } from './../actions/index';

class MessageThreadComponent extends Component {

    constructor(props) {
        super(props)
        this.state = { threadsReloaded: false }
    }

    componentDidMount() {
        const threadId = this.props.route.params?.thread?.thread_id
        if (threadId) {
            this.props.doLoadThreadMessages(threadId, 0)
            this.props.doMarkMessageThreadAsRead(threadId)
        }

        setTimeout(() => { this.setupMessageThreadEvents() }, 100)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.showDeleteConfirmation != this.props.showDeleteConfirmation) {
            const { showDeleteConfirmation, deleteTitle, deleteMessage, deleteThreadId } = this.props
            if (showDeleteConfirmation == true && deleteThreadId) {
                Alert.alert(
                    deleteTitle, deleteMessage,
                    [
                        { text: 'Confirm', onPress: () => { this.props.doDeleteMessageThread(deleteThreadId) } },
                        { text: 'Cancel', onPress: () => { this.props.doDeleteThreadCancel() } },
                    ]
                );
            }
        }

        if (prevProps.deleteSuccess != this.props.deleteSuccess) {
            if (this.props.deleteSuccess == true) {
                this.props.navigation.goBack()
            }
        }
    }

    componentWillUnmount() {
        const { echo } = this.state
        const threadId = this.props.route.params?.thread?.thread_id

        if (threadId && echo) {
            echo.leave(threadId)
            this.setState({ echo: null })
        }
    }

    render() {
        const { userId, messages, continuePagination, deleteIsLoading } = this.props

        return (
            <React.Fragment>
                {deleteIsLoading == true && <PageLoader />}
                {deleteIsLoading == false &&
                    <GiftedChat
                        inverted={false}
                        showAvatarForEveryMessage={true}
                        showUserAvatar={true}
                        loadEarlier={continuePagination}
                        messagesContainerStyle={{ backgroundColor: 'white' }}
                        messages={messages}
                        renderBubble={this.renderBubble}
                        renderSend={this.renderSend}
                        onPressAvatar={(user) => this.tapUser(user)}
                        onLoadEarlier={() => this.paginate()}
                        onSend={messages => this.onSend(messages)}
                        user={{ _id: userId }}
                    />
                }
            </React.Fragment>
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
        const bubbleDate = moment.unix(props.currentMessage?.created_gmt_ts).format("MMMM Do YYYY, h:mm:ss a");
        const bubbleTimeAgo = moment(bubbleDate, "MMMM Do YYYY, h:mm:ss a").fromNow();

        return (
            <MessageBubbleComponent
                {...props}
                bubbleTimeAgo={bubbleTimeAgo}
                textStyle={{
                    title: {
                        color: colors.dark,
                        fontFamily: fonts.bold,
                        fontSize: 16
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

    setupMessageThreadEvents = () => {
        const { userToken, userId } = this.props
        const { pusherConfig, pusherEventName } = this.props
        const threadId = this.props.route.params?.thread?.thread_id

        if (threadId && userToken && userId && pusherConfig && pusherEventName) {
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

            echo.private(threadId)
                .listen(pusherEventName, message => {
                    if (message.message && message.user) {
                        this.props.doSuccessSendMessage(threadId, message);
                    }
                });
        }
    }

    onSend = (message) => {
        const { pageLocation } = this.props
        const reloadThreadsAfterSend = this.props.route.params?.reloadThreadsAfterSend ?? false
        const { threadsReloaded } = this.state

        const text = message[0].text
        const threadId = this.props.route.params?.thread?.thread_id
        const recipientIds = ((this.props.route.params?.thread?.recipients) ?? []).map(item => item.id)

        if (_.isEmpty(text) == false && threadId) {
            this.props.doSendThreadMessage(threadId, recipientIds, text, pageLocation);
        }

        // reload threads (to reload first time convo in the bg)
        if (reloadThreadsAfterSend == true && threadsReloaded == false) {
            this.setState({ threadsReloaded: true })
            this.props.doLoadMessageThreads(0)
        }
    }

    tapUser = (user) => {
        const ownerId = this.props.userId
        const userId = user?.id ?? 0
        const userName = user?.username

        if (userId && userName && ownerId && ownerId != userId) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }

    paginate = () => {
        const { continuePagination, offset, isLoadingMessages } = this.props
        const threadId = this.props.route.params?.thread?.thread_id

        if (continuePagination && isLoadingMessages == false) {
            this.props.doLoadThreadMessages(threadId, offset)
        }
    }
}

const mapStateToProps = (state, ownProps) => {

    const threadId = ownProps.route.params?.thread?.thread_id

    const msgs = state.messaging.dms || []
    let messages = []
    let offset = 0
    let offsetEnd = 0
    let continuePagination = false
    let index = _.findIndex(msgs, { threadId: threadId })

    // find the messages in the state
    if (threadId && index != -1) {
        const dm = state.messaging.dms[index]
        messages = dm.messages
        // for pagination
        offset = messages.length
        offsetEnd = dm.messagesTotalCount ?? 0
        continuePagination = offset < offsetEnd
    }

    const _state = {
        messages, continuePagination, offset, offsetEnd,
        pusherConfig: state.messaging.pusherConfig,
        pusherEventName: state.messaging.pusherEventName,
        userToken: state.messaging.userToken,
        userId: state.profile.userId,
        showDeleteConfirmation: state.messaging.showDeleteConfirmation ?? false,
        deleteIsLoading: state.messaging.deleteThreadIsLoading ?? false,
        deleteSuccess: state.messaging.deleteThreadSuccess,
        deleteThreadId: state.messaging.deleteThreadId,
        deleteTitle: state.messaging.deleteTitle,
        deleteMessage: state.messaging.deleteMessage,
        isLoadingMessages: state.messaging.isLoading,
        pageLocation: state.root.currentPageLocation
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadThreadMessages: (threadId, offset) => dispatch(actLoadThreadMessages(threadId, offset)),
        doSendThreadMessage: (threadId, recipientIds, message, pageLocation) => dispatch(actSendThreadMessage(threadId, recipientIds, message, pageLocation)),
        doSuccessSendMessage: (threadId, message) => dispatch(actSuccessSendMessage(threadId, message)),
        doLoadMessageThreads: (offset) => dispatch(actLoadMessageThreads(offset)),
        doMarkMessageThreadAsRead: (threadId) => dispatch(actMarkMessageThreadAsRead(threadId)),
        doDeleteMessageThread: (threadId) => dispatch(actDeleteMessageThread(threadId)),
        doDeleteThreadCancel: () => dispatch(actDeleteThreadCancel()),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MessageThreadComponent))
