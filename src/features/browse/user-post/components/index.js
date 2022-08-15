/*
 * Created by Justice on Mon Jun 21 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Text, View, SafeAreaView, FlatList, TouchableOpacity, Image, SectionList } from 'react-native'
import { Searchbar, withTheme, Divider, IconButton } from 'react-native-paper'

import PageLoader from 'app/features/shared/page-loader/components/index';
import EmptySetView from 'app/features/shared/empty/components/index';
import MobileAdsComponent from 'app/features/auth/root/components/ads';

import { styles } from './style';
import { actResetSearchUsers, actSearchUser, actSearchPost, actIsLoadingSearchUsers, actIsLoadingSearchPosts, actResetSearchPosts, actReportSelectedUser, actReportSelectedPost } from './../actions/index'
import { actToggleSearching } from 'app/features/browse/list/actions'

import unregUser from 'app/assets/unregUser.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'

export class SearchComponent extends Component {

    state = { selectedTab: 'posts', searchQuery: undefined }

    constructor() {
        super()
        this.onSearchEvent = _.debounce(this.onSearch, 100);
    }

    onSearch = () => {
        const { pageLocation } = this.props
        const { searchQuery, selectedTab } = this.state
        if (searchQuery != undefined) {
            //this.props.doSearchPost(searchQuery, pageLocation)
            this.props.doSearchUser(searchQuery, pageLocation)
        } else {
            //this.props.doResetSearchPosts()
            this.props.doResetSearchUsers()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
                {/* {this.renderAds()} */}
            </View>
        )
    }

    renderContent() {
        return (
            <SafeAreaView style={styles.contentContainer}>
                {this.renderSearchBar()}
                {/* {this.renderHeader()} */}
                {this.renderEmptyView()}
                {this.renderBody()}
            </SafeAreaView>
        )
    }

    renderAds() {
        return (
            <View style={styles.adContainer}>
                <MobileAdsComponent />
            </View>
        )
    }

    renderSearchBar() {
        const { colors } = this.props.theme
        const { searchQuery } = this.state
        return (
            <View style={styles.searchCont}>
                <View style={styles.searchIcon}>
                    <IconButton
                        icon="arrow-left"
                        color={colors.secondary}
                        size={30}
                        style={{ backgroundColor: 'white' }}
                        onPress={() => this.tapGoBack()}
                    />
                </View>
                <View style={styles.searchText}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={this.onChangeSearch}
                        value={searchQuery}
                    />
                </View>
            </View>
        )
    }

    renderBody() {
        const { selectedTab } = this.state

        return (
            <View style={styles.container}>
                <React.Fragment>
                    {this.renderList()}
                </React.Fragment>
            </View>
        )
    }

    renderList = () => {
        const { colors, fonts } = this.props.theme
        const users = this.props.users ?? []
        const posts = this.props.posts ?? []

        const data = [
            { title: posts.length != 0 ? 'Posts' : '', data: posts },
            { title: users.length != 0 ? 'People' : '', data: users }
        ]

        return (
            <SectionList
                sections={data}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item, idx }) => item.body != undefined
                    ? this.renderPostItem(item, idx)
                    : this.renderUserItem(item, idx)
                }
                // renderSectionHeader={({ section: { title } }) => (
                //     <View style={{ height: 30, backgroundColor: 'white' }}>
                //         <Text style={{ fontFamily: fonts.semiBold, ...styles.titleHeader }}>
                //             {title}
                //         </Text>
                //     </View>
                // )}
            />
        )
    }

    renderHeader = () => {
        const { colors, fonts } = this.props.theme
        const { selectedTab } = this.state

        return (
            <React.Fragment>
                <Divider />
                <View style={styles.tabCont}>
                    <TouchableOpacity onPress={() => this.tapChangeTab('posts')} style={styles.tabBtnItem}>
                        <Text style={{ ...styles.tabTextItem, fontFamily: fonts.semiBold }}>
                            Posts
                        </Text>
                        <View style={{ ...styles.tabLine, backgroundColor: selectedTab == 'posts' ? colors.secondary : 'transparent' }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.tapChangeTab('people')} style={styles.tabBtnItem}>
                        <Text style={{ ...styles.tabTextItem, fontFamily: fonts.semiBold }}>
                            People
                        </Text>
                        <View style={{ ...styles.tabLine, backgroundColor: selectedTab == 'people' ? colors.secondary : 'transparent' }} />
                    </TouchableOpacity>
                </View>
                <Divider />
            </React.Fragment>
        )
    }

    renderUsers = () => {
        const { users, continuePagination } = this.props
        return (
            <FlatList data={users} keyboardShouldPersistTaps='always'
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={(item, idx) => this.renderUserItem(item.item, idx)}
                extraData={this.props}
                onEndReachedThreshold={1}
                onEndReached={this.paginateList}
                ListFooterComponent={continuePagination
                    ? <PageLoader />
                    : null
                }
            />
        )
    }

    renderUserItem = (user, idx) => {
        const { colors, fonts } = this.props.theme
        const userIsVerified = user.show_verified_badge ?? false

        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"
        const avatar = user?.avatar?.sm
        const userHasAvatar = avatar != undefined

        return (
            <View key={user.id}>
                <TouchableOpacity style={styles.userHeader} onPress={() => this.tapUserProfile(user)} >
                    <View styles={styles.avatar}>
                        <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatar} />
                    </View>
                    <View style={styles.personInfoCont}>
                        <View style={styles.nameCont}>
                            <Text style={{ ...styles.nicktxt, fontFamily: fonts.regular, color: colors.dark }}>
                                {nickname}
                            </Text>
                            {userIsVerified &&
                                <Image source={verifiedIcon} style={styles.verifiedIcon} />
                            }
                        </View>
                        <Text style={{ ...styles.nametxt, fontFamily: fonts.regular, color: colors.gray }}>
                            {`@${username}`}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Divider />
            </View>
        )
    }

    renderPosts = () => {
        const { posts, continuePagination } = this.props
        return (
            <FlatList data={posts} keyboardShouldPersistTaps='always'
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={(item, idx) => this.renderPostItem(item.item, idx)}
                extraData={this.props}
                onEndReachedThreshold={1}
                onEndReached={this.paginateList}
                ListFooterComponent={continuePagination
                    ? <PageLoader />
                    : null
                }
            />
        )
    }

    renderPostItem = (post, idx) => {
        const { colors, fonts } = this.props.theme
        const userIsVerified = post.user?.show_verified_badge ?? false

        const username = post.user?.username ?? "Guest"
        const nickname = post.user?.nickname ?? "Guest"
        const avatar = post.user?.avatar?.sm
        const userHasAvatar = avatar != undefined

        const postMsg = post.body ?? ''
        const postHasMedia = post.media != undefined && post.media[0] != undefined
        const firstMedia = post.media != undefined ? post.media[0].sm : undefined

        return (
            <View key={post.user?.id}>
                <TouchableOpacity style={styles.postHeader} onPress={() => this.tapUserProfile(post.user)}>
                    <TouchableOpacity styles={styles.avatarThumb}>
                        <Image source={userHasAvatar ? { uri: avatar } : unregUser} style={styles.avatarThumb} />
                    </TouchableOpacity>
                    <View style={styles.personInfoCont}>
                        <View style={styles.nameCont}>
                            <Text style={{ ...styles.nicktxt, fontFamily: fonts.regular, color: colors.dark }}>
                                {nickname}
                            </Text>
                            {userIsVerified &&
                                <Image source={verifiedIcon} style={styles.verifiedIcon} />
                            }
                            <Text style={{ ...styles.usernametxt, fontFamily: fonts.regular, color: colors.gray }}>
                                {`@${username}`}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {postHasMedia == true &&
                    <TouchableOpacity style={styles.postCont} onPress={() => this.tapPostItem(post)}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: fonts.regular, fontSize: 16 }} numberOfLines={6}>
                                {`${postMsg}`}
                            </Text>
                        </View>
                        <View style={styles.linkedImageCont}>
                            <Image style={styles.linkedImage} source={{ uri: firstMedia }} />
                        </View>
                    </TouchableOpacity>
                }
                {postHasMedia == false &&
                    <TouchableOpacity style={styles.postCont} onPress={() => this.tapPostItem(post)}>
                        <Text style={{ fontFamily: fonts.regular, fontSize: 16 }} numberOfLines={6}>
                            {`${postMsg}`}
                        </Text>
                    </TouchableOpacity>
                }
                <Divider />
            </View>
        )
    }

    renderEmptyView = () => {
        const { selectedTab } = this.state
        const { users, posts, isSearchingUsers, isSearchingPosts } = this.props

        const showUsersEmptySet = this.hasSearchQuery() && isSearchingUsers == false && users.length == 0 && selectedTab == 'people'
        const showPostsEmptySet = this.hasSearchQuery() && isSearchingPosts == false && posts.length == 0 && selectedTab == 'posts'

        return (
            <React.Fragment>
                {(isSearchingUsers == true || isSearchingPosts == true) &&
                    <PageLoader marginTop={100} type="large" />
                }
                {showUsersEmptySet && showPostsEmptySet &&
                    <EmptySetView title="No results found" icon="post" size="small" />
                }
            </React.Fragment>
        )
    }

    onChangeSearch = (query) => {
        const { selectedTab } = this.state
        this.setState({ searchQuery: query })

        if (query == undefined || query.length == 0) {
            // this.props.doResetSearchPosts()
            this.props.doResetSearchUsers()
        } else {
            // this.props.doShowSearchPosts()
            this.props.doShowSearchUsers()
            this.onSearchEvent()
        }
    }

    tapChangeTab = (tab) => {
        this.setState({ selectedTab: tab, searchQuery: undefined })
    }

    tapGoBack = () => {
        this.props.doToggleSearching()
    }

    tapUserProfile = (user) => {
        const userId = user?.id
        const userName = user?.username

        if (userId && userName) {
            this.props.navigation.push('Profile', { userId, userName })
        }

        const { searchQuery } = this.state
        const { pageLocation } = this.props

        if (searchQuery && userId && pageLocation) {
            this.props.doReportSelectedUser(searchQuery, userId, pageLocation)
        }
    }

    tapPostItem = (post) => {
        const postId = post.id
        const userId = post.user_id

        if (postId) {
            this.props.navigation.navigate('PostItemComponent', { postId })
        }

        const { searchQuery } = this.state
        const { pageLocation } = this.props

        if (searchQuery && postId && userId && pageLocation) {
            this.props.doReportSelectedPost(searchQuery, postId, userId, pageLocation)
        }
    }

    hasSearchQuery = () => {
        const { searchQuery } = this.state
        if (searchQuery && _.isEmpty(searchQuery) == false && searchQuery.length >= 3) {
            return true
        }
        return false
    }
}

const mapStateToProps = (state, ownProps) => {
    const _state = {
        pageLocation: state.root.currentPageLocation,
        users: state.search.users ?? [],
        posts: state.search.posts ?? [],
        continuePagination: false,
        isSearchingUsers: state.search.isLoadingUsers ?? false,
        isSearchingPosts: state.search.isLoadingPosts ?? false,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doToggleSearching: () => dispatch(actToggleSearching()),
        doShowSearchUsers: () => dispatch(actIsLoadingSearchUsers(true)),
        doShowSearchPosts: () => dispatch(actIsLoadingSearchPosts(true)),
        doSearchUser: (query, pageLocation) => dispatch(actSearchUser(query, pageLocation)),
        doSearchPost: (query, pageLocation) => dispatch(actSearchPost(query, pageLocation)),
        doReportSelectedUser: (query, ownerId, pageLocation) => dispatch(actReportSelectedUser(query, ownerId, pageLocation)),
        doReportSelectedPost: (query, postId, ownerId, pageLocation) => dispatch(actReportSelectedPost(query, postId, ownerId, pageLocation)),
        doResetSearchUsers: () => dispatch(actResetSearchUsers()),
        doResetSearchPosts: () => dispatch(actResetSearchPosts()),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SearchComponent))
