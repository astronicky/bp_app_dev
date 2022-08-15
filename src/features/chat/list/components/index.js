/*
 * Created by Justice on Wed Jan 27 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, ScrollView, View } from 'react-native'
import { withTheme } from 'react-native-paper'

import EmptySetView from 'app/features/shared/empty/components/index'
import PageLoader from 'app/features/shared/page-loader/components/index'
import MobileAdsComponent from 'app/features/auth/root/components/ads'

import Echo from "laravel-echo";
import PusherNative from 'pusher-js/react-native';

import { actLoadChatRooms, actLoadRoomUpdate } from './../actions/index'
import RoomItemComponent from './room'
import { styles } from './style'

class ChatListComponent extends Component {

    constructor(props) {
        super(props); this.state = { echo: undefined }
        setTimeout(() => this.setupChatRoomObservers(), 50)
    }

    componentDidMount() {
        this.props.doLoadChatRooms(0)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chatRooms != this.props.chatRooms) {
            setTimeout(() => this.setupChatRoomEvents(), 50)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
                {this.renderAds()}
            </View>
        )
    }

    renderAds() {
        return (
            <View style={styles.adContainer}>
                <MobileAdsComponent />
            </View>
        )
    }

    renderContent() {
        const { continuePagination, chatRooms, isLoading } = this.props
        const showEmptySet = isLoading == false && chatRooms.length == 0

        return (
            <React.Fragment>
                {showEmptySet == true &&
                    <ScrollView>
                        <EmptySetView title="No chats found" />
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
                            <FlatList data={chatRooms} keyboardShouldPersistTaps='always'
                                keyExtractor={(item, idx) => idx.toString()}
                                renderItem={(item) => this.renderItem(item)}
                                extraData={this.props}
                                onEndReachedThreshold={1}
                                style={{ paddingTop: 10 }}
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

    renderItem = (item) => {
        const { roomChanges } = this.props
        return (
            <RoomItemComponent chatRoom={item.item} roomChanges={roomChanges} navigation={this.props.navigation} />
        )
    }

    paginateList = () => {
        // increment page
        const { continuePagination, offset } = this.props

        // paginate now
        if (continuePagination) {

        }
    }

    setupChatRoomObservers = () => {
        const { userToken, userId, pusherConfig } = this.props
        if (userToken && userId && pusherConfig) {
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
            this.setState({ echo: echo })
        }
    }

    setupChatRoomEvents = () => {
        const { echo } = this.state
        const { chatRooms, pusherEventName } = this.props
        const roomIds = chatRooms.map(item => item.id);

        if (echo != undefined && roomIds.length != 0) {
            roomIds.map(roomId => {
                echo.leave(roomId)
                echo.channel(roomId)
                    .listen(pusherEventName, message => {
                        this.props.doLoadRoomUpdate(roomId)
                    });
            })
        }
    }
}

const mapStateToProps = (state) => {
    const chatRooms = state.chatRoom.chatRooms ?? []
    const offset = chatRooms.length
    const offsetEnd = state.chatRoom.total
    const continuePagination = offset < offsetEnd

    const _state = {
        chatRooms,
        offset,
        continuePagination,
        isLoading: state.chatRoom.isLoading,
        userToken: state.chatRoom.userToken,
        userId: state.profile.userId,
        pusherConfig: state.chatRoom.pusherConfig,
        pusherEventName: state.chatRoom.pusherEventName,
        roomChanges: state.chatRoom.roomChanges
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadChatRooms: (offset) => dispatch(actLoadChatRooms(offset)),
        doLoadRoomUpdate: (roomId) => dispatch(actLoadRoomUpdate(roomId)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ChatListComponent))
