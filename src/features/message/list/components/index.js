/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux';
import { FlatList, ScrollView, View } from 'react-native'
import { withTheme } from 'react-native-paper'

import MessageHeaderComponent from './header'
import MessageItemComponent from './message'

import EmptySetView from 'app/features/shared/empty/components/index'
import PageLoader from 'app/features/shared/page-loader/components/index'
import MobileAdsComponent from 'app/features/auth/root/components/ads'

import { styles } from './style';
import { actLoadMessageThreads } from './../actions/index'

class MessageListComponent extends Component {

    componentDidMount() {
        this.props.doLoadMessageThreads(0)
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
        const { continuePagination, threads, isLoading } = this.props
        const showEmptySet = isLoading == false && threads.length == 0
        const { colors, fonts } = this.props.theme

        return (
            <React.Fragment>
                {showEmptySet == true &&
                    <ScrollView>
                        <EmptySetView title="No messages found" />
                    </ScrollView>
                }
                {showEmptySet == false &&
                    <View style={styles.container}>
                        {isLoading &&
                            <React.Fragment>
                                <View style={styles.loaderCont}>
                                    <PageLoader type="large" />
                                </View>
                            </React.Fragment>
                        }
                        {isLoading == false &&
                            <FlatList data={threads} keyboardShouldPersistTaps='always'
                                keyExtractor={(item, idx) => idx.toString()}
                                renderItem={(item) => this.renderItem(item)}
                                extraData={this.props}
                                onEndReachedThreshold={1}
                                style={{ paddingTop: 10 }}
                                onEndReached={this.paginateList}
                                ListHeaderComponent={<MessageHeaderComponent />}
                                ListFooterComponent={continuePagination
                                    ? <PageLoader />
                                    : null
                                }
                            />
                        }
                    </View>
                }
            </React.Fragment>
        )
    }

    renderItem = (item) => {
        return (
            <MessageItemComponent thread={item.item} navigation={this.props.navigation} />
        )
    }

    paginateList = () => {
        // increment page
        const { continuePagination, offset } = this.props

        // paginate now
        if (continuePagination) {

        }
    }
}

const mapStateToProps = (state) => {
    const threads = state.messaging.threads ?? []
    const offset = threads.length
    const offsetEnd = state.messaging.total
    const continuePagination = offset < offsetEnd

    const _state = {
        threads,
        offset,
        continuePagination,
        isLoading: state.messaging.isLoading
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadMessageThreads: (offset) => dispatch(actLoadMessageThreads(offset)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MessageListComponent))
