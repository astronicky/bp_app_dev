/*
 * Created by Justice on Mon Dec 07 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { Text, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { withTheme, Card, Menu, Button } from 'react-native-paper'

import EmptySetView from 'app/features/shared/empty/components/index';
import PageLoader from 'app/features/shared/page-loader/components/index'

import { styles } from './style';
import { actLoadUserBlockedList, actUnblockUser } from '../actions/index';

import unregUser from 'app/assets/unregUser.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'

export class BlockListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.doLoadUserBlockedList(0)
    }

    render() {

        const { users, continuePagination, isLoading } = this.props
        const showEmptySet = isLoading == false && users.length == 0

        return (
            <React.Fragment>
                {showEmptySet &&
                    <ScrollView>
                        <EmptySetView title="No users found" />
                    </ScrollView>
                }
                {showEmptySet == false &&
                    <View style={styles.listContainer}>
                        {isLoading &&
                            <React.Fragment>
                                <View style={styles.loaderCont}>
                                    <PageLoader type="large" />
                                </View>
                            </React.Fragment>
                        }
                        {isLoading == false &&
                            <FlatList data={users} keyboardShouldPersistTaps='always'
                                keyExtractor={(item, idx) => idx.toString()}
                                renderItem={(item, idx) => this.renderItem(item.item, idx)}
                                extraData={this.props}
                                onEndReachedThreshold={1}
                            // onEndReached={this.paginateList}
                            // ListFooterComponent={continuePagination
                            //     ? <PageLoader />
                            //     : null
                            // }
                            />
                        }
                    </View>
                }
            </React.Fragment>
        )
    }

    renderItem = (user, index) => {
        const { colors, fonts } = this.props.theme
        const userId = user.id
        const userIsLoading = user.userIsLoading ?? false
        const userIsVerified = user.show_verified_badge ?? false

        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"
        const avatar = user?.avatar?.md
        const userHasAvatar = avatar != undefined

        return (
            <Card style={{ marginBottom: 10, height: 90 }} key={user.id}>
                <View style={styles.postHeader} onPress={() => this.tapUserProfile(user)} >
                    <View styles={styles.avatar}>
                        <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatar} />
                    </View>
                    <View style={styles.personRowCont}>
                        <View style={styles.nameCont}>
                            <Text style={{ ...styles.nicktxt, fontFamily: fonts.regular, color: colors.dark }} numberOfLines={1}>
                                {nickname}
                            </Text>
                            {userIsVerified &&
                                <Image source={verifiedIcon} style={styles.verifiedIcon} />
                            }
                        </View>
                        <Text style={{ ...styles.nametxt, fontFamily: fonts.regular, color: colors.gray }} numberOfLines={1}>
                            {`@${username}`}
                        </Text>
                    </View>
                    <View style={styles.actionInfoCont}>
                        <Button loading={userIsLoading} mode="outlined" color={colors.secondary} onPress={() => this.selectUnblockMenu(user.id)}>
                            Unblock
                        </Button>
                    </View>
                </View>
            </Card>
        )
    }

    paginateList = () => {
        // increment page
        const { continuePagination, offset } = this.props

        // paginate now
        if (continuePagination) {
            this.props.doLoadUserBlockedList(offset)
        }
    }

    selectUnblockMenu = (userId) => {
        const { pageLocation } = this.props
        if (userId) {
            this.props.doUnblockUser(userId, pageLocation)
        }
    }

    tapUserProfile = (user) => {
        const userId = user?.id
        const userName = user?.username

        if (userId && userName) {
            // this.props.navigation.push('Profile', { userId, userName })
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const users = state.account.blockedUsers ?? []
    const offset = users.length
    const offsetEnd = state.account.totalBlockedUsers ?? 0
    const isLoading = state.account.isLoadingBlockedUsers ?? false
    const continuePagination = offset < offsetEnd

    const _state = {
        users,
        offset,
        continuePagination,
        isLoading,
        pageLocation: state.root.currentPageLocation,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadUserBlockedList: (offset) => dispatch(actLoadUserBlockedList(offset)),
        doUnblockUser: (userId, pageLocation) => dispatch(actUnblockUser(userId, pageLocation)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BlockListComponent))
