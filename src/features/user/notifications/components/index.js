/*
 * Created by Justice on Sat Jan 9 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { Text, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { withTheme, Card, Menu } from 'react-native-paper'

import EmptySetView from 'app/features/shared/empty/components/index';
import PageLoader from 'app/features/shared/page-loader/components/index'

import { styles } from './style';
import moreIcon from 'app/assets/moreIcon.png'
import { actLoadNotifications, actReadNotification, actShowNotificationMenu, actDeletedNotification, actReadAllNotifications } from '../actions/index';

export class NotificationsListComponent extends Component {
    
    constructor(props) {
        super(props)
        this.props.navigation.setOptions({
            headerRight: () => this.renderRightButton()
        })
    }

    componentDidMount() {
        this.props.doLoadNotifications(0)
    }

    renderRightButton = () => {
        const { colors, fonts } = this.props.theme
        return (
            <TouchableOpacity 
                style={{ marginRight: 15 }} 
                onPress={() => this.props.doReadAllNotifications()}
            >
                <Text style={{ fontSize: 15, color: colors.secondary, fontFamily: fonts.semiBold }}>
                    Read All
                </Text>
            </TouchableOpacity>
        )
    }

    render() {

        const { notifications, continuePagination, isLoading } = this.props
        const showEmptySet = isLoading == false && notifications.length == 0

        return (
            <React.Fragment>
                {showEmptySet &&
                    <ScrollView>
                        <EmptySetView icon="bell" title="No notifications found" />
                    </ScrollView>
                }
                {showEmptySet == false &&
                    <View style={styles.container}>
                        {isLoading == true &&
                            <React.Fragment>
                                <View style={styles.loaderCont}>
                                    <PageLoader type="large" />
                                </View>
                            </React.Fragment>
                        }
                        {isLoading == false &&
                            <FlatList data={notifications} keyboardShouldPersistTaps='always'
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

    renderItem = (notification, index) => {
        const { colors, fonts } = this.props.theme
        const showMenu = notification.showMenu ?? false
        const userId = notification.user?.id
        const username = notification.user?.username ?? 'user'
        const avatar = notification.user?.avatar?.sm ?? ''
        const notifDate = notification.notifTimeAgo ?? ''
        const bgColor = notification.unread == true ? colors.neutral : "#ffffff"

        return (
            <Card style={{ height: 60 }} key={notification.id}>
                <TouchableOpacity style={{ ...styles.postHeader, backgroundColor: bgColor, }} onPress={() => this.tapNotification(notification)}>
                    <View style={styles.picCont}>
                        <View styles={styles.avatar}>
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        </View>
                    </View>
                    <View style={styles.dataColumn}>
                        <View style={styles.infoCont}>
                            <TouchableOpacity onPress={() => { this.tapUserProfile(userId, username) }}>
                                <Text style={{ fontFamily: fonts.regular, color: colors.secondary }}>
                                    {`@${username}`}
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ fontFamily: fonts.regular, color: colors.dark }}>
                                {notification.message ?? ''}
                            </Text>
                        </View>
                        <Text style={{ ...styles.dateLabel, color: colors.gray }}>
                            {notifDate}
                        </Text>
                    </View>
                    <View style={styles.moreColumn}>
                        <Menu visible={showMenu} onDismiss={() => this.tapOptions(notification.id)}
                            anchor={
                                <View style={styles.moreIconCont}>
                                    <TouchableOpacity onPress={() => this.tapOptions(notification.id)} style={styles.moreIconCont}>
                                        <Image source={moreIcon} />
                                    </TouchableOpacity>
                                </View>
                            }
                        >
                            <Menu.Item onPress={() => this.selectReadMenu(notification.id)} title="Mark as Read" />
                            <Menu.Item onPress={() => this.selectDeleteMenu(notification.id)} title="Delete Notification"
                            />
                        </Menu>
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }

    paginateList = () => {
        // increment page
        const { continuePagination, offset } = this.props

        // paginate now
        if (continuePagination) {
            this.props.doLoadNotifications(offset)
        }
    }

    selectReadMenu = (notifId) => {
        this.props.doShowNotificationMenu(notifId)
        this.props.doReadNotification(notifId)
    }

    selectDeleteMenu = (notifId) => {
        this.props.doShowNotificationMenu(notifId)
        this.props.doDeleteNotification(notifId)
    }

    tapOptions = (notifId) => {
        this.props.doShowNotificationMenu(notifId)
    }

    tapNotification = (notification) => {
        if (notification.id) {
            this.props.doReadNotification(notification.id)
        }

        if (notification.notification == 'UserFollowed') {
            const userId = notification.user_id
            const userName = notification.user?.username
            if (userId && userName) {
                this.tapUserProfile(userId, userName)
            }
        } else if (notification.notification == 'PostLiked' || notification.notification == 'PostCommented' || notification.notification == 'CommentLiked') {
            const postId = notification.post_id
            if (postId) {
                this.tapPostItem(postId)
            }
        }
    }

    tapUserProfile = (userId, userName) => {
        if (userId && userName) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }

    tapPostItem = (postId) => {
        this.props.navigation.navigate('PostItemComponent', { postId })
    }
}

const mapStateToProps = (state) => {
    const notifications = state.notifications.notifications ?? [];

    const offset = notifications.length
    const offsetEnd = state.notifications.totalNotificationCount ?? 0
    const isLoading = state.notifications.isLoading ?? false
    const continuePagination = offset < offsetEnd

    const _state = {
        notifications,
        offset,
        continuePagination,
        isLoading,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doReadAllNotifications: () => dispatch(actReadAllNotifications()),
        doReadNotification: (notifId) => dispatch(actReadNotification(notifId)),
        doShowNotificationMenu: (notifId) => dispatch(actShowNotificationMenu(notifId)),
        doDeleteNotification: (notifId) => dispatch(actDeletedNotification(notifId)),
        doLoadNotifications: (offset) => dispatch(actLoadNotifications(offset))
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(NotificationsListComponent))
