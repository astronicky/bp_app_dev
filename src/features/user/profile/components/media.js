/*
 * Created by Justice on Tue Nov 24 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import _ from 'lodash';
import { View, FlatList, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';;
import { withTheme, Card } from 'react-native-paper';

import PageLoader from 'app/features/shared/page-loader/components/index'
import EmptySetView from 'app/features/shared/empty/components/index';

import PostItemLoaderComponent from './post-loader';
import HeaderLoaderComponent from './header-loader';
import LikeComponent from './like';
import CommentsComponent from './comments';
import PostPreviewComponent from './post-preview';
import PostHeaderComponent from './post-header';
import CommentNewComponent from './comment-new';

import { styles } from './style';
import { actLoadUserMedia } from '../actions/index';

class UserMediaComponent extends Component {

  componentDidMount() {
    const otherUserId = this.props.route.params?.userId

    if (otherUserId) {
      // load other user's posts
      this.props.doLoadUserMedia(otherUserId, 0, false)
    } else {
      // load owner posts
      const { ownerUserId } = this.props
      this.props.doLoadUserMedia(ownerUserId, 0, false)
    }
  }

  render() {
    const { colors } = this.props.theme
    const { posts, continuePagination, isLoading, refreshing } = this.props

    return (
      <View style={styles.container}>
        {isLoading &&
          <React.Fragment>
            <ScrollView>
              <HeaderLoaderComponent />
              <PostItemLoaderComponent />
              <PostItemLoaderComponent />
            </ScrollView>
          </React.Fragment>
        }
        {isLoading == false &&
          <FlatList data={posts} keyboardShouldPersistTaps='always'
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={(item, idx) => this.renderItem(item, idx)}
            extraData={this.props}
            onEndReachedThreshold={1}
            onEndReached={this.paginateList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={continuePagination
              ? <PageLoader />
              : null
            }
          />
        }
      </View>
    )
  }

  renderHeader = () => {
    const { posts } = this.props
    return (
      <React.Fragment>
        {this.props.header &&
          this.props.header()
        }
        {posts == 0 &&
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
        <CommentsComponent post={post} />
      </Card>
    )
  }

  paginateList = () => {
    // increment page
    const { continuePagination, userId, offset } = this.props

    // paginate now
    if (continuePagination) {
      this.props.doLoadUserMedia(userId, offset)
    }
  }

  onRefresh = () => {
    const otherUserId = this.props.route.params?.userId

    if (otherUserId) {
      // load other user's posts
      this.props.doLoadUserMedia(otherUserId, 0, true)
    } else {
      // load owner posts
      const { ownerUserId } = this.props
      this.props.doLoadUserMedia(ownerUserId, 0, true)
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
  let offset, offsetEnd, continuePagination
  let isLoading = true

  // find the user in the state
  if (userId && index != -1) {
    const user = state.profile.users[index]
    posts = user.media ?? []
    isLoading = user.mediaIsLoading
    offset = posts.length
    offsetEnd = user.totalMediaCount
    continuePagination = offset < offsetEnd
  }

  const _state = {
    posts,
    offset,
    continuePagination,
    isLoading,
    userId,
    userName,
    ownerUserId: state.profile.userId,
    ownerUserName: state.profile.userName,
    refreshing: state.profile.otherUserIsReloading ?? false
  };

  return _state;
};

const mapDispatchToProps = (dispatch) => {
  const _action = {
    dispatch,
    doLoadUserMedia: (userId, offset, forceReload, limit = 25) => dispatch(actLoadUserMedia(userId, offset, limit, forceReload)),
  };

  return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(UserMediaComponent));