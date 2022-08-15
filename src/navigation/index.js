/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component, useState } from "react";
import { NativeModules, Platform } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { Image, TouchableOpacity, View } from "react-native";
import { IconButton, Badge, Menu, Divider } from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';
import { useRef } from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// declare components here
import LoginComponent from './../features/auth/login/components/index';
import RegisterComponent from './../features/auth/register/components/index';
import VerifyCodeComponent from './../features/auth/register/components/code';
import LocationComponent from './../features/auth/register/components/location';
import SuggestedFriendComponent from './../features/auth/register/components/suggested';
import TrendingFeedComponent from './../features/post/feed/components/trending';
import LatestFeedComponent from './../features/post/feed/components/latest';
import FollowingFeedComponent from './../features/post/feed/components/following';
import BrowseListComponent from './../features/browse/list/components/index';
import MessageListComponent from './../features/message/list/components/index';
import MessageThreadComponent from './../features/message/list/components/thread';
import ChatListComponent from './../features/chat/list/components/index';
import UserProfileComponent from './../features/user/profile/components/index';
import AccountVerifyCodeComponent from './../features/user/account/components/code';
import PostCreateComponent from './../features/post/create/components/index';
import AudienceListComponent from './../features/user/audience/components/index';
import AccountSettingsComponent from './../features/user/account/components/index';
import BlockListComponent from './../features/user/account/components/blocklist';
import RootComponent from './../features/auth/root/components/index';
import FeedGifSearchComponent from './../features/post/feed/components/gifSearch';
import ProfileGifSearchComponent from './../features/user/profile/components/gifSearch';
import NotificationsListComponent from './../features/user/notifications/components/index';
import ChatThreadComponent from './../features/chat/list/components/thread';
import PostItemComponent from './../features/post/feed/components/post-item';
import DeactivateConfirmComponent from './../features/user/account/components/deactivate-confirm';
import ResendVerifyCodeComponent from './../features/user/profile/components/verify-resend';
import RoomInfoComponent from './../features/chat/list/components/info';
import MutedUsersListComponent from './../features/chat/list/components/muted-users';
import ActivateAccountComponent from './../features/auth/root/components/activate';

// assets
import userIcon from 'app/assets/unregUser.png';
import titleIcon from 'app/assets/icon.png';
import sadBadgeIcon from 'app/assets/sad-badge-small.png';
import homeIcon from 'app/assets/homeIcon.png';
import chatIcon from 'app/assets/dialogs.png';
import chatIconNotif from 'app/assets/dialogs-notif.png';
import messageIcon from 'app/assets/messages.png';
import homeActiveIcon from 'app/assets/homeIcon-active.png';
import chatActiveIcon from 'app/assets/dialogs-active.png';
import messageActiveIcon from 'app/assets/messages-active.png';
import plusIcon from 'app/assets/createIcon.png';
import plusIconActive from 'app/assets/createIcon-active.png';
import searchIcon from 'app/assets/searchTabIcon.png';
import searchIconActive from 'app/assets/searchTabIcon-active.png';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TopMenu = createMaterialTopTabNavigator();

export default function AppNavigation() {
    const navigationRef = useRef();
    const routeNameRef = useRef();
    const dispatch = useDispatch();
    const { ComscoreNativeiOSModule, ComscoreNativeAndroidModule } = NativeModules;

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() =>
                (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
            }
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;

                console.log('Analytics Track Page:', currentRouteName);

                if (previousRouteName !== currentRouteName) {
                    // The line below uses the expo-firebase-analytics tracker
                    // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
                    // Change this line to use another Mobile analytics SDK
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName
                    });

                    if (Platform.OS == 'ios') {
                        ComscoreNativeiOSModule?.trackScreenAt(currentRouteName)
                    } else {
                        ComscoreNativeAndroidModule?.trackScreenAt(currentRouteName)
                    }
                }

                // Save the current route name for later comparison
                routeNameRef.current = currentRouteName;

                // Track current screen
                const setCurrentScreenActionType = 'ROOT_SET_CURRENT_SCREEN'
                dispatch({
                    type: setCurrentScreenActionType,
                    payload: { screenName: currentRouteName }
                })
            }}
        >
            <Stack.Navigator initialRouteName='RootComponent' headerMode='none'>
                <Stack.Screen name='RootComponent' component={RootComponent} />
                <Stack.Screen name='ActivateAccountComponent' component={ActivateAccountComponent} />
                <Stack.Screen name='AuthNavigator' component={AuthNavigator} options={{ animationEnabled: false }} />
                <Stack.Screen name='AppTabNavigator' component={AppTabNavigator} options={{ animationEnabled: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function renderNavBar(navigation, userPic, isSuspended, unreadCount) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const menuHandler = () => {
        setIsMenuVisible(current => !current)
    }

    const profileHandler = () => {
        setIsMenuVisible(current => !current)
        navigation.navigate('UserProfile')
    }

    const settingsHandler = () => {
        setIsMenuVisible(current => !current)
        navigation.navigate('UserSettings')
    }

    const logoutHandler = () => {
        setIsMenuVisible(current => !current)
        navigation.navigate('RootComponent', { logout: true })
    }

    return {
        headerLeft: () => (
            <View>
                <IconButton
                    style={{ marginLeft: 10 }}
                    onPress={() => navigation.navigate('Notifications')}
                    size={30}
                    icon="bell"
                />
                {unreadCount &&
                    <View style={{ position: 'absolute', marginLeft: 40, marginTop: 10, width: 40, flexWrap: 'wrap' }}>
                        <Badge style={{ fontWeight: 'bold', fontSize: 13, maxWidth: 40, marginLeft: 0 }}>
                            {unreadCount}
                        </Badge>
                    </View>
                }
            </View>

        ),
        headerTitle: () => (
            <IconButton
                size={40}
                color="#4AE3A8"
                icon={titleIcon}
            />
        ),
        headerRight: () => {
            return (
                <View>
                    <Menu visible={isMenuVisible} onDismiss={menuHandler}
                        anchor={renderAnchor(userPic, userIcon, isSuspended, menuHandler)}
                    >
                        <Menu.Item onPress={profileHandler} title="Profile" />
                        <Divider />
                        <Menu.Item onPress={settingsHandler} title="Settings" />
                        <Divider />
                        <Menu.Item onPress={logoutHandler} title="Logout" />
                    </Menu>
                </View>
            )
        }
    }
}

function renderAnchor(userPic, userIcon, isSuspended, menuHandler) {

    if (userPic == undefined) {
        return (
            <IconButton
                style={{ marginRight: 12 }}
                onPress={menuHandler}
                size={30}
                icon={userIcon}
            />
        )
    }

    return (
        <TouchableOpacity onPress={menuHandler}>
            <Image source={{ uri: userPic }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 15 }} />
            {isSuspended &&
                <Image source={sadBadgeIcon} style={{ width: 15, height: 15, marginTop: 22, position: 'absolute' }} />
            }
        </TouchableOpacity>
    )
}

function TrendingTabNavigator() {
    return (
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={TrendingFeedComponent} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

function Tab1MenuNavigator() {
    return (
        <TopMenu.Navigator tabBarOptions={{ indicatorStyle: { backgroundColor: '#006A7C' } }}>
            <TopMenu.Screen name="Trending" component={TrendingTabNavigator} />
            <TopMenu.Screen name="Latest" component={LatestFeedComponent} />
            <TopMenu.Screen name="Following" component={FollowingFeedComponent} />
        </TopMenu.Navigator>
    )
}

function TabFeedNavigator() {
    const userPic = useSelector(state => state.profile.avatar?.sm)
    const isSuspended = useSelector(state => state.profile.profile_status) == 'Suspended'
    const unreadCount = useSelector(state => state.root.unreadNotifCount)
    return (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen name='Home' component={TrendingTabNavigator}
                options={({ navigation }) => renderNavBar(navigation, userPic, isSuspended, unreadCount)}
            />
            <Stack.Screen name="FeedGifSearchComponent" component={FeedGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            { /*Required Views*/}
            <Stack.Screen name="Profile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="UserProfile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="ResendVerifyCodeComponent" component={ResendVerifyCodeComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Verify Email'
                }}
            />
            <Stack.Screen name="UserSettings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="ProfileGifSearchComponent" component={ProfileGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            <Stack.Screen name="Notifications" component={NotificationsListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Notifications'
                }}
            />
            <Stack.Screen name="FollowerListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Followers'
                }}
            />
            <Stack.Screen name="FollowingListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Following'
                }}
            />
            <Stack.Screen name="MessageThread" component={MessageThreadComponent}
                options={({ route }) => ({
                    title: route.params.title,
                    headerTintColor: '#006A7C'
                })}
            />
            <Stack.Screen name="Settings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="DeactivateConfirmComponent" component={DeactivateConfirmComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="BlockListComponent" component={BlockListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Blocked Users'
                }}
            />
            <Stack.Screen name="AccountVerifyCodeComponent" component={AccountVerifyCodeComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="PostItemComponent" component={PostItemComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Post'
                }}
            />
        </Stack.Navigator>
    );
}

function TabCreatePostNavigator() {
    const userPic = useSelector(state => state.profile.avatar?.sm)
    const isSuspended = useSelector(state => state.profile.profile_status) == 'Suspended'
    const unreadCount = useSelector(state => state.root.unreadNotifCount)
    return (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen name="CreatePost" component={PostCreateComponent}
                options={({ navigation }) => renderNavBar(navigation, userPic, isSuspended, unreadCount)}
            />
            <Stack.Screen name="FeedGifSearchComponent" component={FeedGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            { /*Required Views*/}
            <Stack.Screen name="Profile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="UserProfile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="ResendVerifyCodeComponent" component={ResendVerifyCodeComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Verify Email'
                }}
            />
            <Stack.Screen name="UserSettings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="ProfileGifSearchComponent" component={ProfileGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            <Stack.Screen name="Notifications" component={NotificationsListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Notifications'
                }}
            />
            <Stack.Screen name="FollowerListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Followers'
                }}
            />
            <Stack.Screen name="FollowingListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Following'
                }}
            />
            <Stack.Screen name="MessageThread" component={MessageThreadComponent}
                options={({ route }) => ({
                    title: route.params.title,
                    headerTintColor: '#006A7C'
                })}
            />
            <Stack.Screen name="Settings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="DeactivateConfirmComponent" component={DeactivateConfirmComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="BlockListComponent" component={BlockListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Blocked Users'
                }}
            />
            <Stack.Screen name="AccountVerifyCodeComponent" component={AccountVerifyCodeComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="PostItemComponent" component={PostItemComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Post'
                }}
            />
        </Stack.Navigator>
    );
}

function TabBrowseNavigator() {
    const userPic = useSelector(state => state.profile.avatar?.sm)
    const isSuspended = useSelector(state => state.profile.profile_status) == 'Suspended'
    const unreadCount = useSelector(state => state.root.unreadNotifCount)
    return (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen name='Browse' component={BrowseListComponent}
                options={({ navigation }) => renderNavBar(navigation, userPic, isSuspended, unreadCount)}
            />
            { /*Required Views*/}
            <Stack.Screen name="Profile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="ProfileGifSearchComponent" component={ProfileGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            <Stack.Screen name="Notifications" component={NotificationsListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Notifications'
                }}
            />
            <Stack.Screen name="FollowerListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Followers'
                }}
            />
            <Stack.Screen name="FollowingListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Following'
                }}
            />
            <Stack.Screen name="MessageThread" component={MessageThreadComponent}
                options={({ route }) => ({
                    title: route.params.title,
                    headerTintColor: '#006A7C'
                })}
            />
            <Stack.Screen name="Settings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="DeactivateConfirmComponent" component={DeactivateConfirmComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="BlockListComponent" component={BlockListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Blocked Users'
                }}
            />
            <Stack.Screen name="AccountVerifyCodeComponent" component={AccountVerifyCodeComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="PostItemComponent" component={PostItemComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Post'
                }}
            />
        </Stack.Navigator>
    );
}

function TabChatNavigator() {
    const userPic = useSelector(state => state.profile.avatar?.sm)
    const isSuspended = useSelector(state => state.profile.profile_status) == 'Suspended'
    const unreadCount = useSelector(state => state.root.unreadNotifCount)
    return (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen name='Chats' component={ChatListComponent}
                options={({ navigation }) => renderNavBar(navigation, userPic, isSuspended, unreadCount)}
            />
            <Stack.Screen name="ChatThreadComponent" component={ChatThreadComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: ''
                }}
            />
            <Stack.Screen name="RoomInfoComponent" component={RoomInfoComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Info'
                }}
            />
            <Stack.Screen name="MutedUsersListComponent" component={MutedUsersListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Muted Users'
                }}
            />
            { /*Required Views*/}
            <Stack.Screen name="Profile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="ProfileGifSearchComponent" component={ProfileGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            <Stack.Screen name="Notifications" component={NotificationsListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Notifications'
                }}
            />
            <Stack.Screen name="FollowerListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Followers'
                }}
            />
            <Stack.Screen name="FollowingListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Following'
                }}
            />
            <Stack.Screen name="MessageThread" component={MessageThreadComponent}
                options={({ route }) => ({
                    title: route.params.title,
                    headerTintColor: '#006A7C'
                })}
            />
            <Stack.Screen name="Settings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="DeactivateConfirmComponent" component={DeactivateConfirmComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="BlockListComponent" component={BlockListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Blocked Users'
                }}
            />
            <Stack.Screen name="AccountVerifyCodeComponent" component={AccountVerifyCodeComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="PostItemComponent" component={PostItemComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Post'
                }}
            />
        </Stack.Navigator>
    );
}

function TabMessageNavigator() {
    const dispatch = useDispatch()
    const userPic = useSelector(state => state.profile.avatar?.sm)
    const isSuspended = useSelector(state => state.profile.profile_status) == 'Suspended'
    const unreadCount = useSelector(state => state.root.unreadNotifCount)
    const deleteActionType = 'DM_THREADS_DELETE_CONFIRM'

    return (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen name='Messages' component={MessageListComponent}
                options={({ navigation }) => renderNavBar(navigation, userPic, isSuspended, unreadCount)}
            />
            <Stack.Screen name="MessageThread" component={MessageThreadComponent}
                options={({ route }) => ({
                    title: route.params.title,
                    headerTintColor: '#006A7C',
                    headerRight: () => {
                        return (
                            <IconButton
                                style={{ marginRight: 12, color: '#006A7C' }}
                                onPress={() => dispatch({ type: deleteActionType, payload: { thread: route.params.thread } })}
                                size={25}
                                color="#B1B1B1"
                                icon="delete"
                            />
                        )
                    }
                })}
            />
            { /*Required Views*/}
            <Stack.Screen name="Profile" component={UserProfileComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'User Profile'
                }}
            />
            <Stack.Screen name="ProfileGifSearchComponent" component={ProfileGifSearchComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Search GIF'
                }}
            />
            <Stack.Screen name="Notifications" component={NotificationsListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Notifications'
                }}
            />
            <Stack.Screen name="FollowerListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Followers'
                }}
            />
            <Stack.Screen name="FollowingListComponent" component={AudienceListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Following'
                }}
            />
            <Stack.Screen name="Settings" component={AccountSettingsComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Settings'
                }}
            />
            <Stack.Screen name="DeactivateConfirmComponent" component={DeactivateConfirmComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="BlockListComponent" component={BlockListComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Blocked Users'
                }}
            />
            <Stack.Screen name="AccountVerifyCodeComponent" component={AccountVerifyCodeComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="PostItemComponent" component={PostItemComponent}
                options={{
                    headerTintColor: '#006A7C',
                    headerTitle: 'Post'
                }}
            />
        </Stack.Navigator>
    );
}

function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}

/**
 * Create Tab Navigation
 */
function AppTabNavigator() {
    const unreadMessageCount = useSelector(state => state.root.unreadMsgCount)
    const hasRoomChange = useSelector(state => state.chatRoom.roomChanges?.withChanges)
    return (
        <Tab.Navigator barStyle={{ backgroundColor: '#FAFAFA' }} tabBarOptions={{ activeTintColor: '#006A7C', inactiveTintColor: '#B1B1B1' }}>
            <Tab.Screen name="Home" component={TabFeedNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ height: 25, width: 25, marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25 }} source={focused ? homeActiveIcon : homeIcon} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Browse" component={TabBrowseNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ height: 25, width: 25, marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25 }} source={focused ? searchIconActive : searchIcon} />
                        </View>
                    )
                }}
            />
            {/* <Tab.Screen name="Discover" component={DiscoverListComponent}
                options={{
                    tabBarLabel: 'Discover',
                    tabBarIcon: ({ focused }) => (
                        <Image style={{ width: 25, height: 25 }} source={focused ? discoverActiveIcon : discoverIcon} />
                    )
                }}
            /> */}
            <Tab.Screen name="CreatePost" component={TabCreatePostNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ height: 40, width: 40, marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 40, height: 40 }} source={focused ? plusIconActive : plusIcon} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Chats" component={TabChatNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ height: 25, width: 25, marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25 }} source={hasRoomChange == true && focused == false ? chatIconNotif : focused ? chatActiveIcon : chatIcon} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Messages" component={TabMessageNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ height: 25, width: 25, marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25 }} source={focused ? messageActiveIcon : messageIcon} />
                        </View>
                    ),
                    tabBarBadge: unreadMessageCount != 0 && unreadMessageCount ? unreadMessageCount : undefined
                }}
            />
        </Tab.Navigator>
    )
}

/**
 * Create Auth Navigator
 */
function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginComponent} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterComponent} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyCode" component={VerifyCodeComponent} options={{ headerShown: false }} />
            <Stack.Screen name="Location" component={LocationComponent} options={{ headerShown: false }} />
            <Stack.Screen name="FriendSuggestion" component={SuggestedFriendComponent} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}