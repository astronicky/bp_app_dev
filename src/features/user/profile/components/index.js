/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import _ from 'lodash';
import { View, FlatList, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';;
import { withTheme, Card } from 'react-native-paper';

import PageLoader from 'app/features/shared/page-loader/components/index';
import EmptySetView from 'app/features/shared/empty/components/index';
import ProfileHeaderComponent from './header';
import PostItemLoaderComponent from './post-loader';
import HeaderLoaderComponent from './header-loader';
import UserMediaComponent from './media';
import LikeComponent from './like';
import CommentsComponent from './comments';
import PostPreviewComponent from './post-preview';
import PostHeaderComponent from './post-header';
import CommentNewComponent from './comment-new';

import { styles } from './style';
import { actLoadUserPosts, actLoadUserData, actCreateLinkPreview } from '../actions/index';

class UserProfileComponent extends Component {

  state = { selectedTab: 'posts' }

  static getDerivedStateFromProps(nextProps, prevState) {
    // NOTE: I placed it here to avoid subscription on comments component
    // If successfully attached a GIF, query it's preview immediately 
    if (nextProps.gifAttachmentUrl && nextProps.gifAttachmentPostId) {
      // prevState.urls = [nextProps.gifAttachmentUrl]
      nextProps.doCreateLinkPreview(nextProps.gifAttachmentPostId, nextProps.gifAttachmentUrl)
    }

    // NOTE: Load user posts only if the profile status is not suspended
    if (nextProps.userProfileStatus && nextProps.userProfileStatus != 'Suspended' && nextProps.postIsLoading == undefined) {
      const otherUserId = nextProps.route.params?.userId
      if (otherUserId) {
        nextProps.doLoadUserPosts(otherUserId, 0)
      }
    }

    if (nextProps.flagPostSuccess) {
      Alert.alert(
        'User Profile', "Post successfully reported.",
        [
          {
            text: 'OK', onPress: () => { }
          },
        ]
      );
    }

    if (nextProps.deletePostSuccess) {
      Alert.alert(
        'User Profile', "Post successfully deleted.",
        [
          { text: 'OK', onPress: () => { } },
        ]
      );
    }

    if (nextProps.reportSuccess) {
      Alert.alert(
        'User Profile', "User successfully reported.",
        [
          { text: 'OK', onPress: () => { } },
        ]
      );
    }

    if (nextProps.blockSuccess) {
      Alert.alert(
        'User Profile', 'User successfully blocked.',
        [
          { text: 'OK', onPress: () => { nextProps.navigation?.pop() } },
        ]
      );
    }

    return null;
  }

  componentDidMount() {
    const otherUserId = this.props.route.params?.userId
    const otherUserName = this.props.route.params?.userName

    if (otherUserId && otherUserName) {
      // load other user's posts
      this.props.doLoadUserData(otherUserId, otherUserName, false, false)
    } else {
      // load owner posts
      const { ownerUserId, ownerUserName } = this.props
      this.props.doLoadUserData(ownerUserId, ownerUserName, true, false)
      setTimeout(() => {
        this.props.doLoadUserPosts(ownerUserId, 0)
      }, 500)
    }
  }

  render() {
    const { isLoading } = this.props
    const { selectedTab } = this.state

    return (
      <View style={styles.container}>
        {isLoading == true &&
          <React.Fragment>
            <ScrollView>
              <HeaderLoaderComponent />
              <PostItemLoaderComponent />
              <PostItemLoaderComponent />
            </ScrollView>
          </React.Fragment>
        }
        {isLoading == false &&
          <React.Fragment>
            {selectedTab == 'posts' &&
              this.renderPosts()
            }
            {selectedTab == 'media' &&
              this.renderMedia()
            }
          </React.Fragment>
        }
      </View>
    )
  }

  renderHeader = () => {
    return (
      <React.Fragment>
        <ProfileHeaderComponent {...this.props} />
        {this.renderHeaderTab()}
        {this.renderEmptyView()}
      </React.Fragment>
    )
  }

  renderHeaderTab = () => {
    const { userProfileStatus, userIsBlocked } = this.props
    const { colors, fonts } = this.props.theme
    const { selectedTab } = this.state
    const isNotSuspended = userProfileStatus != 'Suspended'

    return (
      <React.Fragment>
        {isNotSuspended && 
          <View style={styles.tabCont}>
            <TouchableOpacity onPress={() => this.tapChangeTab('posts')} style={styles.tabBtnItem} disabled={userIsBlocked}>
              <Text style={{ ...styles.tabTextItem, fontFamily: fonts.semiBold }}>
                Posts
              </Text>
              <View style={{ ...styles.tabLine, backgroundColor: selectedTab == 'posts' ? colors.secondary : 'transparent' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.tapChangeTab('media')} style={styles.tabBtnItem} disabled={userIsBlocked}>
              <Text style={{ ...styles.tabTextItem, fontFamily: fonts.semiBold }}>
                Media
              </Text>
              <View style={{ ...styles.tabLine, backgroundColor: selectedTab == 'media' ? colors.secondary : 'transparent' }} />
            </TouchableOpacity>
          </View>
        }
      </React.Fragment>
    )
  }

  renderEmptyView = () => {
    const { userIsBlocked, userName } = this.props
    const posts = userIsBlocked == true ? [] : this.props.posts
    const { selectedTab } = this.state

    return (
      <React.Fragment>
        {posts == 0 && userIsBlocked == true &&
          <EmptySetView title={'@' + userName + ' has blocked you.'} subtitle={'You cannot follow, view posts, \n or send messages.'} icon="" size="small" />
        }
        {posts == 0 && userIsBlocked == false && selectedTab == 'posts' &&
          <EmptySetView title="No posts found" icon="post" size="small" />
        }
      </React.Fragment>
    )
  }

  renderItem = (el, idx) => {
    const post = el.item;
    return (
      <Card key={post.id} style={styles.postCont}>
        <PostHeaderComponent post={post} />
        <PostPreviewComponent post={post} />
        <LikeComponent post={post} />
        <CommentNewComponent post={post} navigation={this.props.navigation} />
        <CommentsComponent post={post} navigation={this.props.navigation} route={this.props.route} />
      </Card>
    )
  }

  paginateList = () => {
    // increment page
    const { continuePagination, userId, offset } = this.props

    // paginate now
    if (continuePagination) {
      this.props.doLoadUserPosts(userId, offset)
    }
  }

  renderPosts = () => {
    const { continuePagination, userIsBlocked, refreshing } = this.props
    const posts = userIsBlocked == true ? [] : this.props.posts
    return (
      <FlatList data={posts} keyboardShouldPersistTaps='always'
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={(item, idx) => this.renderItem(item, idx)}
        extraData={this.props}
        onEndReachedThreshold={1}
        onEndReached={this.paginateList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={continuePagination && userIsBlocked == false 
          ? <PageLoader />
          : null
        }
      />
    )
  }

  renderMedia = () => {
    return (
      <UserMediaComponent navigation={this.props.navigation} route={this.props.route} header={this.renderHeader} />
    )
  }

  tapChangeTab = (tab) => {
    this.setState({ selectedTab: tab })
  }

  onRefresh = () => {
    const otherUserId = this.props.route.params?.userId
    const otherUserName = this.props.route.params?.userName

    if (otherUserId && otherUserName) {
      // load other user's posts
      this.props.doLoadUserData(otherUserId, otherUserName, false, true)
    } else {
      // load owner posts
      const { ownerUserId, ownerUserName } = this.props
      this.props.doLoadUserData(ownerUserId, ownerUserName, true, true)
      setTimeout(() => {
        this.props.doLoadUserPosts(ownerUserId, 0)
      }, 500)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  // attach other user id when viewing other profile
  const userId = ownProps.route.params?.userId ?? state.profile.userId
  const userName = ownProps.route.params?.userName ?? state.profile.userName

  const users = state.profile.users || []
  let index = _.findIndex(users, { id: userId })
  let posts = []
  let offset, offsetEnd, continuePagination, userProfileStatus, postIsLoading, userIsBlocked
  let isLoading = true

  // find the user in the state
  if (userId && index != -1) {
    const user = state.profile.users[index]
    posts = user.posts ?? []
    isLoading = user.postIsLoading != undefined ? user.postIsLoading : true
    postIsLoading = user.postIsLoading
    offset = posts.length
    offsetEnd = user.totalPostsCount
    userProfileStatus = user.profile_status
    userIsBlocked = user.viewer.is_blocked
    continuePagination = offset < offsetEnd

    if (userProfileStatus == 'Suspended') {
      isLoading = false
    }
  }

  const _state = {
    posts,
    offset,
    continuePagination,
    isLoading,
    userId,
    userName,
    userProfileStatus,
    userIsBlocked,
    postIsLoading,
    ownerUserId: state.profile.userId,
    ownerUserName: state.profile.userName,
    gifAttachmentUrl: state.profile.gifAttachmentUrl,
    gifAttachmentPostId: state.profile.gifAttachmentPostId,
    flagPostSuccess: state.profile.flagPostSuccess,
    deletePostSuccess: state.profile.deletePostSuccess,
    blockSuccess: state.profile.blockSuccess,
    reportSuccess: state.profile.reportSuccess,
    refreshing: state.profile.otherUserIsReloading ?? false
  };

  return _state;
};

const mapDispatchToProps = (dispatch) => {
  const _action = {
    dispatch,
    doForceReloadUserFeed: (userId) => dispatch(actForceReloadUserFeed(userId)),
    doLoadUserPosts: (userId, offset) => dispatch(actLoadUserPosts(userId, offset)),
    doLoadUserData: (uid, uname, loadCurrentUserData, forceReload) => dispatch(actLoadUserData(uid, uname, loadCurrentUserData, forceReload)),
    doCreateLinkPreview: (postId, url) => dispatch(actCreateLinkPreview(postId, url)),
  };

  return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(UserProfileComponent));