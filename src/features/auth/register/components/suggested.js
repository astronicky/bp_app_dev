/*
 * Created by Justice on Thu Nov 26 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import PageLoader from 'app/features/shared/page-loader/components/index'
import { styles } from './style';
import { connect } from 'react-redux';
import { Card, withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';

import followIcon from 'app/assets/smallFollowIcon.png'

import { actLoadUserSuggestions, actGiveUserVerdict, resetRegister } from './../actions/index'

class SuggestedFriendComponent extends Component {

    constructor(props) {
        super(props); this.state = { isDatePickerVisible: false };
    }

    componentDidMount() {
        this.props.doLoadUserSuggestions();
    }

    render() {
        const { isLoading, friends } = this.props
        const { colors, fonts } = this.props.theme

        return (
            <React.Fragment>
                <SafeAreaView>
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic" style={{ height: '92%' }}>
                        <View style={{ ...styles.container, backgroundColor: colors.background }}>
                            <View style={styles.titleContainer}>
                                <Image style={styles.logo} source={require('app/assets/logo.png')} />
                                <Text style={{ ...styles.titleLine, color: colors.dark, fontFamily: fonts.bold, width: '90%' }}>
                                    Here are some interesting people to follow. {'\n'}Follow the ones you like.
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.topFieldSeparator, styles.userListCont]}>
                            <FlatList data={friends} keyboardShouldPersistTaps='always'
                                keyExtractor={(item, idx) => idx.toString()}
                                renderItem={(item, idx) => this.renderItem(item.item, idx)}
                                extraData={this.props}
                                numColumns={2}
                            />
                        </View>
                        <View style={styles.userListFooter}>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 15, color: colors.secondary, fontFamily: fonts.regular }}>
                                    I'll do this later
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View style={{ ...styles.signupButtonCont, height: '8%' }}>
                        <TouchableOpacity onPress={this.tapFinish}
                            disabled={isLoading}
                            style={{ ...styles.signupButton, backgroundColor: colors.secondary }}>
                            <View style={styles.signupButtonText}>
                                {isLoading == true &&
                                    <PageLoader color="white" />
                                }
                                {isLoading == false &&
                                    <Text style={{ ...styles.signupText, fontFamily: fonts.semiBold }}>
                                        Finish up
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }

    renderItem = (friend) => {
        const { colors, fonts } = this.props.theme
        const highlight = friend.isFollowing == true || friend.isVerdictLoading == true 
        const background = highlight ? colors.secondary : 'white'
        const titleColor = highlight ? 'white' : colors.dark
        const isFollowing = friend.isFollowing ?? false

        return (
            <Card style={{...styles.userCard, backgroundColor: background }}>
                <TouchableOpacity style={styles.userCardCont} onPress={() => { this.tapFollow(friend.id, isFollowing) }}>
                    <View>
                        <Image source={{ uri: friend.avatar?.sm }} style={styles.userPic} />
                        {highlight == false &&
                            <Image source={followIcon} style={styles.userPicIcon} />
                        }
                    </View>
                    <View style={styles.userDetailCont}>
                        <Text style={{ ...styles.userTitle, color: titleColor, fontFamily: fonts.semiBold }} numberOfLines={1}>
                            {friend.nickname}
                        </Text>
                        <Text style={{ ...styles.userSubTitle, color: colors.gray, fontFamily: fonts.regular }} numberOfLines={1}>
                            {friend.username}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }

    tapFinish = () => {
        this.props.navigation.popToTop()
        this.props.navigation.navigate('AppTabNavigator')
        this.props.resetRegister()
    }

    tapFollow = (friendId, isFollowing) => {
        const { pageLocation } = this.props
        if (friendId) {
            const verdict = isFollowing == true ? 'unfollow' : 'follow'
            this.props.doGiveUserVerdict(friendId, verdict, pageLocation)
        }
    }
}

const mapStateToProps = (state) => {
    const _state = {
        pageLocation: state.root.currentPageLocation,
        isLoading: state.register.isLoadingSuggestions ?? false,
        friends: state.register.suggestions || []
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadUserSuggestions: () => dispatch(actLoadUserSuggestions()),
        resetRegister: () => dispatch(resetRegister()),
        doGiveUserVerdict: (userId, verdict, pageLocation) => dispatch(actGiveUserVerdict(userId, verdict, pageLocation)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SuggestedFriendComponent))