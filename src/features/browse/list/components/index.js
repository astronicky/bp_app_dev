/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, ScrollView, View } from 'react-native'
import { withTheme } from 'react-native-paper'

import EmptySetView from 'app/features/shared/empty/components/index'
import PageLoader from 'app/features/shared/page-loader/components/index'
import MobileAdsComponent from 'app/features/auth/root/components/ads'

import BrowserHeaderComponent from './header'
import UserItemComponent from './user'
import SearchComponent from 'app/features/browse/user-post/components/index'
import { styles } from './style';

import { actFilterUsers } from './../actions/index';

class BrowseListComponent extends Component {

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.reportSuccess) {
            alert("User successfully reported.")
        }

        if (nextProps.blockSuccess) {
            alert("User successfully blocked.")
        }

        return null;
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
        const { continuePagination, users, isLoading, showSearch } = this.props
        const showEmptySet = isLoading == false && users.length == 0

        return (
            <React.Fragment>
                {showSearch == true && 
                    <SearchComponent {...this.props} />
                }
                {showEmptySet == true && showSearch == false &&
                    <ScrollView>
                        <BrowserHeaderComponent navigation={this.props.navigation} />
                        <EmptySetView title="No users found" />
                    </ScrollView>
                }
                {showEmptySet == false && showSearch == false &&
                    <View style={styles.container}>
                        <FlatList data={users} keyboardShouldPersistTaps='always'
                            keyExtractor={(item, idx) => idx.toString()}
                            renderItem={(item) => this.renderItem(item)}
                            extraData={this.props}
                            onEndReachedThreshold={1}
                            onEndReached={this.paginateList}
                            ListHeaderComponent={<BrowserHeaderComponent navigation={this.props.navigation}/>}
                            ListFooterComponent={continuePagination
                                ? <PageLoader />
                                : null
                            }
                        />
                    </View>
                }
            </React.Fragment>
        )
    }

    renderItem = (item) => {
        const user = item.item
        return (
            <UserItemComponent user={user} navigation={this.props.navigation} />
        )
    }

    paginateList = () => {
        // increment page
        const { continuePagination, offset } = this.props

        // paginate now
        if (continuePagination) {
            const { genderValue, ageValue, latValue, lngValue, isOnline, isNearby } = this.props

            if (genderValue != undefined && ageValue != undefined) {
                const lat = isNearby == true ? latValue : undefined
                const lng = isNearby == true ? lngValue : undefined

                this.props.doFilterUsers(offset, lat, lng, genderValue, ageValue, isOnline)
            }
        }
    }
}

const mapStateToProps = (state) => {
    const users = state.browse.users ?? []
    const offset = users.length
    const offsetEnd = state.browse.total
    const continuePagination = offset < offsetEnd

    const _state = {
        users,
        offset,
        continuePagination,
        isLoading: state.browse.isLoading,
        latValue: state.browse.latValue,
        lngValue: state.browse.lngValue,
        genderValue: state.browse.genderValue,
        ageValue: state.browse.ageValue,
        isNearby: state.browse.isNearby,
        isOnline: state.browse.isOnline,
        blockSuccess: state.browse.blockSuccess,
        reportSuccess: state.browse.reportSuccess,
        showSearch: state.browse.showSearch
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doFilterUsers: (offset, lat, lng, gender, age, online) => dispatch(actFilterUsers(offset, lat, lng, gender, age, online)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BrowseListComponent))
