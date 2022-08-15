/*
 * Created by Justice on Wed Nov 04 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Card, withTheme } from 'react-native-paper'

import unregUser from 'app/assets/unregUser.png'
import diagram from 'app/assets/diagram.png'

import PageLoader from 'app/features/shared/page-loader/components/index'
import { styles } from './style'
import { actGiveUserVerdict } from '../actions/index'

export class PeopleComponent extends Component {

    render() {
        const { index } = this.props
        const users = this.props.users ?? []
        const { colors, fonts } = this.props.theme

        return (
            <Card key={index} style={styles.postCont}>
                <View style={styles.sugestedHeader}>
                    <Text style={{ ...styles.sugestedHeaderTxt, fontFamily: fonts.semiBold, color: colors.black }}>
                        Suggested people
                    </Text>
                    <Image source={diagram} />
                </View>
                <View style={styles.hr}></View>
                <ScrollView style={styles.suggetedPeopleCont} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {users.map((user) => this.renderItem(user))}
                </ScrollView>
                <TouchableOpacity style={styles.viewMoreCont} onPress={this.tapViewMoreUsers}>
                    <Text style={{ ...styles.moreComtxt, fontFamily: fonts.regular }}>
                        {'View More >'}
                    </Text>
                </TouchableOpacity>
            </Card>
        )
    }

    renderItem = (user) => {
        const { colors, fonts } = this.props.theme
        const isFollowing = user?.following ?? false
        const isLoading = user?.isVerdictLoading ?? false
        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"
        const avatar = user?.avatar?.sm
        const userHasAvatar = avatar != undefined

        const followAction = isFollowing ? 'Unfollow' : 'Follow'

        return (
            <TouchableOpacity style={styles.suggetedPersonCont} onPress={() => this.tapUserProfile(user.id, username)}>
                <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatar} />
                <Text style={{ fontSize: 14, marginTop: 5, fontFamily: fonts.semiBold, color: colors.black }} numberOfLines={1}>
                    {nickname}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.regular, color: colors.gray }} numberOfLines={1}>
                    {`@${username}`}
                </Text>
                <View style={{ ...styles.hr, marginTop: 5, fontFamily: fonts.regular, color: colors.secondary }} />
                {isLoading &&
                    <PageLoader marginTop={10} />
                }
                {isLoading == false &&
                    <React.Fragment>
                        <TouchableOpacity onPress={() => { this.tapGiveUserVerdict(user, followAction) }} style={styles.followBtn}>
                            <Text style={{ ...styles.followStyle, fontFamily: fonts.regular, color: colors.secondary }}>
                                {followAction}
                            </Text>
                        </TouchableOpacity>
                    </React.Fragment>
                }
            </TouchableOpacity>
        )
    }

    tapUserProfile = (userId, userName) => {
        if (userId && userName) {
            this.props.navigation.navigate('Profile', { userId, userName })
        }
    }

    tapGiveUserVerdict = (user, followAction) => {
        const { index, pageLocation } = this.props
        const verdict = followAction == 'Follow' ? 'follow' : 'unfollow'
        const userId = user.id

        if (index != undefined && verdict && userId != undefined) {
            this.props.doGiveUserVerdict(index, userId, verdict, pageLocation)
        }
    }

    tapViewMoreUsers = () => {
        this.props.navigation.navigate('Browse')
    }
}

const mapStateToProps = (state, ownProps) => {
    const _state = {
        pageLocation: state.root.currentPageLocation,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doGiveUserVerdict: (index, userId, verdict, pageLocation) => dispatch(actGiveUserVerdict(index, userId, verdict, pageLocation)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PeopleComponent))