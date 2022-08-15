/*
 * Created by Justice on Wed Nov 18 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { Switch, withTheme } from 'react-native-paper'
import { styles } from './style'

import PageLoader from 'app/features/shared/page-loader/components/index'
import { actToggleBrowserSettings, actToggleFollowSettings, actToggleMentionSettings, actToggleMessageSettings, actTogglePopularEmailSettings, actTogglePostSettings } from './../actions/index'

export class NotificationSettings extends Component {

    render() {
        const placeholders = this.props.placeholders

        return (
            <React.Fragment>
                {placeholders &&
                    this.renderMessage()
                }
            </React.Fragment>

        )
    }

    renderMessage = () => {
        const { placeholders } = this.props
        const { fonts, colors } = this.props.theme
        const settings = this.props.settings || {}

        const browserNotifIsLoading = (settings || {}).browserNotifIsLoading ?? false
        const postNotifIsLoading = (settings || {}).postNotifIsLoading ?? false
        const popularNotifIsLoading = (settings || {}).popularNotifIsLoading ?? false
        const followNotifIsLoading = (settings || {}).followNotifIsLoading ?? false
        const mentionNotifIsLoading = (settings || {}).mentionNotifIsLoading ?? false
        const messageNotifIsLoading = (settings || {}).messageNotifIsLoading ?? false

        const browserNotif = settings.browser ?? false
        const postNotif = settings.posts ?? false
        const popularNotif = settings.popular ?? false
        const mentionNotif = settings.mentions ?? false
        const followNotif = settings.follows ?? false
        const messagesNotif = settings.messages ?? false

        return (
            <View>
                <View style={styles.separator} />
                <Text style={{ ...styles.menuTitle, fontFamily: fonts.semiBold }}>
                    Email Notifications
                </Text>
                <View style={styles.halfSeparator} />
                {/* <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.browserNotifTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.browserNotifCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {browserNotifIsLoading == false &&
                            <Switch value={browserNotif}
                                color={colors.secondary}
                                onValueChange={() => this.props.doToggleBrowserSettings()}
                            />
                        }
                        {browserNotifIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View> */}
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.postNotifTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.postNotifCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {postNotifIsLoading == false &&
                            <Switch value={postNotif}
                                color={colors.secondary}
                                onValueChange={() => this.props.doTogglePostSettings()}
                            />
                        }
                        {postNotifIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.popularNotifTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.popularNotifCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {popularNotifIsLoading == false &&
                            <Switch value={popularNotif}
                                color={colors.secondary}
                                onValueChange={() => this.props.doTogglePopularEmailSettings()}
                            />
                        }
                        {popularNotifIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.mentionNotifTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.mentionNotifCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {mentionNotifIsLoading == false &&
                            <Switch value={mentionNotif}
                                color={colors.secondary}
                                onValueChange={() => this.props.doToggleMentionSettings()}
                            />
                        }
                        {mentionNotifIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.followNotifTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.followNotifCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {followNotifIsLoading == false &&
                            <Switch value={followNotif}
                                color={colors.secondary}
                                onValueChange={() => this.props.doToggleFollowSettings()}
                            />
                        }
                        {followNotifIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.messagesNotifTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.messagesNotifCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {messageNotifIsLoading == false &&
                            <Switch value={messagesNotif}
                                color={colors.secondary}
                                onValueChange={() => this.props.doToggleMessageSettings()}
                            />
                        }
                        {messageNotifIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {

    const _state = {
        placeholders: state.account.placeholders,
        settings: state.account.notifications
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doToggleBrowserSettings: () => dispatch(actToggleBrowserSettings()),
        doToggleFollowSettings: () => dispatch(actToggleFollowSettings()),
        doToggleMentionSettings: () => dispatch(actToggleMentionSettings()),
        doToggleMessageSettings: () => dispatch(actToggleMessageSettings()),
        doTogglePopularEmailSettings: () => dispatch(actTogglePopularEmailSettings()),
        doTogglePostSettings: () => dispatch(actTogglePostSettings()),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(NotificationSettings))