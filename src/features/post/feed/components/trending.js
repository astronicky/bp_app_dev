/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import { RefreshControl, View, FlatList, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Card } from 'react-native-paper';

import PageLoader from 'app/features/shared/page-loader/components/index'
import MobileAdsComponent from 'app/features/auth/root/components/ads'
import PostItemLoaderComponent from './post-loader'

import LikeComponent from './like';
import PeopleComponent from './people';
import CommentsComponent from './comments';
import PostPreviewComponent from './post-preview';
import PostHeaderComponent from './post-header';
import CommentNewComponent from './comment-new';
import PostConnectionComponent from './post-connection';

import plusIcon from 'app/assets/plus.png';
import { styles } from './style';
import { actLoadUserFeed, actCheckNewPostItems, actForceReloadUserFeed, actDisplayUpdatedUserFeed, actLoadUserSuggestions, actCreateLinkPreview } from '../actions/index';
import { TouchableOpacity } from 'react-native-gesture-handler';

class TrendingFeedComponent extends Component {

  constructor(props) {
    super(props)
    this.state = { timer: null }
    this.listView = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // NOTE: I placed it here to avoid subscription on comments component
    // If successfully attached a GIF, query it's preview immediately 
    if (nextProps.gifAttachmentUrl && nextProps.gifAttachmentPostId) {
      // prevState.urls = [nextProps.gifAttachmentUrl]
      nextProps.doCreateLinkPreview(nextProps.gifAttachmentPostId, nextProps.gifAttachmentUrl)
    }

    if (nextProps.flagPostSuccess) {
      alert("Post successfully reported.")
    }

    if (nextProps.deletePostSuccess) {
      alert("Post successfully deleted.")
    }

    if (nextProps.reportSuccess) {
      alert("User successfully reported.")
    }

    if (nextProps.blockSuccess) {
      alert("User successfully blocked.")
    }

    return null;
  }

  componentDidMount() {
    const { offset } = this.props
    this.props.doLoadUserSuggestions()
    this.props.doLoadUserFeed(offset)

    // reload every minute
    const timer = setInterval(this.reloadUserFeed, 60000);
    this.setState({ timer })
  }

  componentWillUnmount() {
    const { timer } = this.state
    if (timer) {
      clearInterval(timer)
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
    const { posts, continuePagination, isLoading, refreshing, hasUpdates } = this.props
    return (
      <View style={styles.contentContainer}>
        {isLoading == true &&
          <React.Fragment>
            <ScrollView>
              <PostItemLoaderComponent />
              <PostItemLoaderComponent />
              <PostItemLoaderComponent />
            </ScrollView>
          </React.Fragment>
        }
        {isLoading == false &&
          <FlatList data={posts} keyboardShouldPersistTaps='always'
            ref={ref => this.listView = ref}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={(item) => this.renderItem(item)}
            extraData={this.props}
            onEndReached={this.paginateList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}
            ListFooterComponent={continuePagination
              ? <PageLoader />
              : null
            }
          />
        }
        {hasUpdates == true &&
          this.renderUpdater()
        }
        {/* <TouchableHighlight style={styles.fab} onPress={this.navigateToCreatePost}>
          <Image source={plusIcon} style={styles.fabIcon} />
        </TouchableHighlight> */}
      </View>
    )
  }

  renderItem = (item) => {
    const post = item.item
    const index = item.index
    const isSuggestionItem = item.item.isSuggestionItem != undefined

    return (
      <React.Fragment>
        {isSuggestionItem == true &&
          <PeopleComponent users={item.item.users ?? []} index={index} navigation={this.props.navigation} />
        }
        {isSuggestionItem == false &&
          <Card key={post.id} style={styles.postCont}>
            <PostConnectionComponent post={post} {...this.props} />
            <PostHeaderComponent post={post} {...this.props} />
            <PostPreviewComponent post={post} />
            <LikeComponent post={post} />
            <CommentNewComponent post={post} navigation={this.props.navigation} />
            <CommentsComponent post={post} navigation={this.props.navigation} />
          </Card>
        }
      </React.Fragment>
    )
  }

  renderUpdater = () => {
    const { colors, fonts } = this.props.theme
    return (
      <View style={styles.updaterCont}>
        <TouchableOpacity style={{ backgroundColor: colors.secondary, ...styles.updaterButton }} onPress={this.displayUpdatedFeed}>
          <Text style={{ fontFamily: fonts.semiBold, ...styles.updaterTitle }}>
            New posts
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  paginateList = () => {
    // increment page
    const { continuePagination, offset, isLoading } = this.props

    // paginate now
    if (continuePagination && isLoading == false) {
      this.props.doLoadUserFeed(offset)
    }
  }

  onRefresh = () => {
    this.props.doForceReloadUserFeed()
  }

  reloadUserFeed = () => {
    const { ownerUserId, since, posts } = this.props
    const firstFeedItem = posts[0]
    if (ownerUserId && since && firstFeedItem != undefined) {
      this.props.doCheckNewPostItems(since, firstFeedItem.id)
    }
  }

  displayUpdatedFeed = () => {
    this.props.doDisplayUpdatedUserFeed()
    if (this.listView != undefined) {
      this.listView.scrollToOffset({ animated: true, offset: 0 });
    }
  }

  navigateToCreatePost = () => {
    this.props.navigation.navigate('CreatePost')
  }
}

const mapStateToProps = (state) => {
  const posts = state.feed.posts || []
  const offset = posts.filter(item => item.isSuggestionItem == undefined).length
  const offsetEnd = state.feed.totalPostsCount
  const continuePagination = offset < offsetEnd
  const totalUpdatesCount = state.feed.totalUpdatedPostsCount

  const _state = {
    posts: state.feed.posts || [],
    offset,
    continuePagination,
    isLoading: state.feed.isLoading,
    gifAttachmentUrl: state.feed.gifAttachmentUrl,
    gifAttachmentPostId: state.feed.gifAttachmentPostId,
    flagPostSuccess: state.feed.flagPostSuccess,
    deletePostSuccess: state.feed.deletePostSuccess,
    blockSuccess: state.feed.blockSuccess,
    reportSuccess: state.feed.reportSuccess,
    hasUpdates: totalUpdatesCount != undefined ? totalUpdatesCount != 0 : false,
    ownerUserId: state.profile.userId,
    refreshing: state.feed.refreshing ?? false,
    since: state.feed.since
  };

  return _state;
};

const mapDispatchToProps = (dispatch) => {
  const _action = {
    dispatch,
    doLoadUserFeed: (offset) => dispatch(actLoadUserFeed(offset)),
    doForceReloadUserFeed: () => dispatch(actForceReloadUserFeed()),
    doCheckNewPostItems: (since, recentItemId) => dispatch(actCheckNewPostItems(since, recentItemId)),
    doDisplayUpdatedUserFeed: () => dispatch(actDisplayUpdatedUserFeed()),
    doLoadUserSuggestions: () => dispatch(actLoadUserSuggestions()),
    doCreateLinkPreview: (postId, url) => dispatch(actCreateLinkPreview(postId, url)),
  };

  return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TrendingFeedComponent));