/*
 * Created by Justice on Wed Feb 03 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react';
import _ from 'lodash'
import { View, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Card } from 'react-native-paper';
import PostItemLoaderComponent from './post-loader';

import PageLoader from 'app/features/shared/page-loader/components/index'

import LikeComponent from './like';
import CommentsComponent from './comments';
import PostPreviewComponent from './post-preview';
import PostHeaderComponent from './post-header';
import CommentNewComponent from './comment-new';
import PostConnectionComponent from './post-connection';

import { styles } from './style';
import { actLoadPostItem, actCreateLinkPreview, actLoadPostComments } from '../actions/index';

class PostItemComponent extends Component {

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

        return null;
    }

    componentDidMount() {
        const postId = this.props.route.params?.postId
        if (postId) {
            this.props.doLoadPostItem(postId)
            this.props.doLoadPostComments(postId, 0)
        }
    }

    render() {
        const { posts, isLoading } = this.props

        return (
            <View style={styles.container}>
                {isLoading &&
                    <React.Fragment>
                        <ScrollView>
                            <PostItemLoaderComponent />
                        </ScrollView>
                    </React.Fragment>
                }
                {isLoading == false && posts.length !== 0 &&
                    <FlatList data={posts} keyboardShouldPersistTaps='always'
                        keyExtractor={(item, idx) => idx.toString()}
                        renderItem={(item) => this.renderItem(item)}
                        extraData={this.props}
                        ListFooterComponent={null}
                    />
                }
            </View>
        )
    }

    renderItem = (item) => {
        const post = item.item
        return (
            <React.Fragment>
                <Card key={post.id} style={styles.postCont}>
                    <PostConnectionComponent post={post} {...this.props} />
                    <PostHeaderComponent post={post} {...this.props} />
                    <PostPreviewComponent post={post} />
                    <LikeComponent post={post} />
                    <CommentNewComponent post={post} navigation={this.props.navigation} />
                    <CommentsComponent post={post} navigation={this.props.navigation} />
                </Card>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const postId = ownProps.route?.params?.postId
    const postItems = state.feed.postItems || []
    let index = _.findIndex(postItems, { id: postId })

    let postItem
    // find the user in the state
    if (postId && index !== -1) {
        postItem = postItems[index]
    }

    const _state = {
        posts: postItem?.body != undefined ? [postItem] : [],
        isLoading: postItem?.isLoading,
        gifAttachmentUrl: state.feed.gifAttachmentUrl,
        gifAttachmentPostId: state.feed.gifAttachmentPostId,
        flagPostSuccess: state.feed.flagPostSuccess,
        deletePostSuccess: state.feed.deletePostSuccess,
        postItemSuccess: state.feed.postItemSuccess
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadPostItem: (postId) => dispatch(actLoadPostItem(postId)),
        doLoadPostComments: (postId, offset) => dispatch(actLoadPostComments(postId, offset)),
        doCreateLinkPreview: (postId, url) => dispatch(actCreateLinkPreview(postId, url)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PostItemComponent));