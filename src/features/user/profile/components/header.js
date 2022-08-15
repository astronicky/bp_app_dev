/*
 * Created by Justice on Wed Nov 11 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Text, View, Image, TouchableOpacity, Alert, } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import { TextInput, withTheme, Menu, Modal, Portal, Provider, Card } from 'react-native-paper'
import { Title, Caption } from 'react-native-paper'
import PageLoader from 'app/features/shared/page-loader/components/index'
import ViewMoreText from 'react-native-view-more-text'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { styles } from './style';

import unregUser from 'app/assets/unregUser.png'
import imgBtn from 'app/assets/img-btn.png'
import settingsBtn from 'app/assets/settings-btn.png'
import groupIcon from 'app/assets/stat3.png'
import postsIcon from 'app/assets/stat4.png'
import verifiedIcon from 'app/assets/verifiedIcon.png'
import heartIcon from 'app/assets/stat2.png'
import sinceIcon from 'app/assets/sinceIcon.png'
import locationIcon from 'app/assets/stat1.png'
import editBioIcon from 'app/assets/editBioIcon.png'
import sadBadgeIcon from 'app/assets/sad-badge.png';
import emailBadgeIcon from 'app/assets/email-badge.png';
import moreIcon from 'app/assets/moreIcon.png'
import blockIcon from 'app/assets/blockIcon.png'

import { actGiveUserVerdict, actUpdateUserCoverPic, actUpdateUserAvatarPic, actUpdateUserBio, actReportUser, actBlockUser } from './../actions/index'
import { actResendVerificationCode } from './../../../auth/register/actions/index'
import { actLoadAccountSettings } from './../../../user/account/actions/index'

export class ProfileHeaderComponent extends Component {

    constructor(props) {
        super(props); this.state = { isEditingBio: false, isMenuVisible: false, isVerifyMenuVisible: false };
    }

    componentDidMount() {
        this.props.doLoadAccountSettings()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.bioSuccess == true) {
            return {
                ...prevState,
                isEditingBio: false
            }
        }

        return null
    }

    render() {
        const { colors, fonts } = this.props.theme
        const { user, isLoading, isVerdictLoading, isBioLoading } = this.props
        const isOtherUser = user.viewer?.self == false ?? undefined
        const avatar = user.avatar?.lg
        const hasAvatar = avatar != undefined
        const cover = user.page_cover?.sm

        const location = _.isEmpty(user.location) ? 'location' : user.location
        const followersCount = user.counts?.followersDesc ?? 0
        const followingCount = user.counts?.followingDesc ?? 0
        const postsCount = user.counts?.postsDesc ?? 0
        const userIsVerified = user.show_verified_badge ?? false
        const userIsFollowing = user.viewer?.is_follower ?? false
        const userIsBlocked = user.viewer?.is_blocked ?? false
        const userIsSuspended = user.profile_status == 'Suspended'
        const userEmailNotVerified = user.email_status != 'Verified' && user.email_status != undefined
        const isEditingBio = this.state.isEditingBio ?? false
        const bioEdit = this.state.bioEdit ?? user.bio
        const userSince = user.since
        const coverIsLoading = user.coverPicIsLoading ?? false
        const avatarIsLoading = user.avatarPicIsLoading ?? false

        const { isMenuVisible } = this.state
        const { blockIsLoading, reportIsLoading } = this.props
        const showMenuLoading = blockIsLoading == true || reportIsLoading == true

        const username = user?.username ?? "Guest"
        const nickname = user?.nickname ?? "Guest"

        return (
            <React.Fragment>
                {userIsSuspended && isOtherUser == false &&
                    this.renderFlagBanner()
                }
                {userEmailNotVerified == true &&
                    this.renderVerifyEmailBanner()
                }
                {isLoading == false &&
                    <View style={styles.headerContainer}>
                        {cover &&
                            <Image source={{ uri: cover }} style={styles.bannerImg} />
                        }
                        {coverIsLoading == true &&
                            <View style={styles.bannerImgLoader}>
                                <PageLoader marginTop={0} />
                            </View>
                        }
                        <View style={styles.camActionCont}>
                            {isOtherUser == false && coverIsLoading == false &&
                                <TouchableOpacity onPress={this.tapCoverImport}>
                                    <Image source={imgBtn} style={styles.camIcon} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.actionCont}>
                            <View style={styles.actionSubCont}>
                                {isOtherUser == true &&
                                    <Menu visible={isMenuVisible} onDismiss={this.tapPostOptions}
                                        anchor={
                                            <View style={{ marginRight: 10, ...styles.moreCont }}>
                                                {showMenuLoading == false && userIsBlocked == false &&
                                                    <TouchableOpacity onPress={this.tapPostOptions}>
                                                        <Image source={moreIcon} />
                                                    </TouchableOpacity>
                                                }
                                                {showMenuLoading &&
                                                    <PageLoader margin={0} marginTop={0} />
                                                }
                                            </View>
                                        }
                                    >
                                        <React.Fragment>
                                            <Menu.Item icon="flag" onPress={this.selectFlagMenu} title="Flag user" />
                                            <Menu.Item onPress={this.selectBlockMenu} title="Block user"
                                                icon={({ size, color }) => (
                                                    <Image
                                                        source={blockIcon}
                                                        style={{ width: size, height: size, tintColor: color }}
                                                    />
                                                )}
                                            />
                                        </React.Fragment>
                                    </Menu>
                                }
                                {isOtherUser == false &&
                                    <TouchableOpacity style={{ marginRight: 5 }} onPress={this.tapAccountSettings} disabled={userIsBlocked}>
                                        <Image source={settingsBtn} style={styles.button2} />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={styles.userCont}>
                            <Image source={hasAvatar ? { uri: avatar } : unregUser} style={styles.userPicCont} />
                            {avatarIsLoading == true &&
                                <View style={styles.userPicLoaderCont}>
                                    <PageLoader marginTop={20} />
                                </View>
                            }
                            {isOtherUser == false && avatarIsLoading == false &&
                                <TouchableOpacity style={styles.profileCamCont} onPress={this.tapImageImport}>
                                    <Image source={imgBtn} style={styles.button1} />
                                    <View style={{ ...styles.onlineIcon, backgroundColor: colors.success }} />
                                </TouchableOpacity>
                            }
                            <View style={styles.personalInfoCont}>
                                <View style={styles.nameCont}>
                                    <Title style={{ ...styles.nickNameLabel, fontFamily: fonts.semiBold }}>
                                        {nickname}
                                    </Title>
                                    {userIsVerified && this.renderVerifiedIcon()}
                                </View>
                                {username &&
                                    <Caption style={{ ...styles.userNameLabel, fontFamily: fonts.semiBold, color: colors.gray }}>
                                        @{username}
                                    </Caption>
                                }
                            </View>
                        </View>
                    </View>
                }
                {isLoading == false &&
                    <View style={styles.userInfoCont}>
                        <View>
                            {isOtherUser == true && userIsSuspended == false && userIsBlocked == false &&
                                <View style={styles.actionsCont}>
                                    <TouchableOpacity style={{ borderColor: colors.secondary, ...styles.editBioBtn }} onPress={this.tapGiveVerdict} disabled={userIsBlocked}>
                                        <Text style={{ color: colors.secondary, fontFamily: fonts.semiBold, fontSize: 13 }}>
                                            {userIsFollowing ? 'Follow' : 'Following'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: colors.secondary, ...styles.editBioBtn }} onPress={this.tapMessage} disabled={userIsBlocked}>
                                        <Text style={{ color: colors.secondary, fontFamily: fonts.semiBold, fontSize: 13 }}>
                                            Message
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {isEditingBio == true &&
                                <TextInput
                                    mode="outlined"
                                    theme={{ colors: { primary: colors.secondary } }}
                                    style={{ paddingRight: 2, marginTop: 5 }}
                                    autoCapitalize='none'
                                    label="User Bio"
                                    autoFocus={true}
                                    clearButtonMode="always"
                                    autoCorrect={false}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    value={bioEdit}
                                    onChangeText={(bioEdit) => this.setState({ bioEdit })}
                                />
                            }
                        </View>
                        {isEditingBio == false &&
                            <ViewMoreText
                                numberOfLines={3}
                                renderViewMore={this.renderViewMore}
                                renderViewLess={this.renderViewLess}
                                textStyle={styles.bioCont}
                            >
                                <Text style={{ color: colors.dark, fontFamily: fonts.regular }}>
                                    {bioEdit}
                                </Text>
                            </ViewMoreText>
                        }
                        {isOtherUser == false && isEditingBio == false &&
                            <TouchableOpacity style={styles.bioCont} onPress={this.tapEditBio}>
                                <Image source={editBioIcon} style={styles.bioIcon} />
                            </TouchableOpacity>
                        }
                        {isOtherUser == false && isEditingBio == true && userIsBlocked == false &&
                            <View style={styles.editBioCon}>
                                <TouchableOpacity style={{ borderColor: colors.danger, ...styles.editBioBtn }} onPress={this.tapCancelBio}>
                                    <Text style={{ color: colors.danger, fontFamily: fonts.semiBold, fontSize: 13 }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderColor: colors.secondary, ...styles.editBioBtn }} onPress={this.tapUpdateBio}>
                                    <Text style={{ color: colors.secondary, fontFamily: fonts.semiBold, fontSize: 13 }}>
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {userIsSuspended == false &&
                            <View style={styles.sinceCont}>
                                <Text style={{ ...styles.statLabel, color: colors.gray, fontFamily: fonts.regular }}>
                                    Since {userSince}
                                </Text>
                                <Image source={sinceIcon} style={styles.sinceIcon} />
                            </View>
                        }
                        {userIsSuspended == false && userIsBlocked == false &&
                            <View style={{ ...styles.statsCont, borderTopColor: colors.gray, borderBottomColor: colors.gray }}>
                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <Image source={locationIcon} style={styles.statIcon} />
                                    </View>
                                    <Text style={{ ...styles.statLabel, color: colors.black, fontFamily: fonts.regular }} numberOfLines={1}>
                                        {location}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.statRowBig} onPress={this.tapFollowersList} disabled={userIsBlocked}>
                                    <View style={styles.statItem}>
                                        <Image source={heartIcon} style={styles.statIcon} />
                                    </View>
                                    <Text style={{ ...styles.statLabel, color: colors.black, fontFamily: fonts.regular }} numberOfLines={1}>
                                        {followersCount} followers
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.statRowBig} onPress={this.tapFollowingList} disabled={userIsBlocked}>
                                    <View style={styles.statItem}>
                                        <Image source={groupIcon} style={styles.statIcon} />
                                    </View>
                                    <Text style={{ ...styles.statLabel, color: colors.black, fontFamily: fonts.regular }} numberOfLines={1}>
                                        {followingCount} following
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <Image source={postsIcon} style={styles.statIcon} />
                                    </View>
                                    <Text style={{ ...styles.statLabel, color: colors.black, fontFamily: fonts.regular }} numberOfLines={1}>
                                        {postsCount} posts
                                    </Text>
                                </View>
                            </View>
                        }
                    </View>
                }
                {userIsSuspended == true &&
                    this.renderSuspendedBanner()
                }
            </React.Fragment>
        )
    }

    renderFlagBanner = () => {
        const { colors, fonts } = this.props.theme
        const msg = "You have limited access to your account.\n"

        return (
            <View style={{ ...styles.banner, backgroundColor: colors.danger }}>
                <Image source={sadBadgeIcon} style={styles.sadIcon} />
                <Text style={{ ...styles.sadTitle, fontFamily: fonts.regular }}>
                    {msg}
                    <TouchableOpacity>
                        <Text style={{ ...styles.whatIs, fontFamily: fonts.semiBold }}>
                            What is this?
                        </Text>
                    </TouchableOpacity>
                </Text>
            </View>
        )
    }

    renderVerifiedIcon = () => {
        const { colors, fonts } = this.props.theme
        const { isVerifyMenuVisible } = this.state

        return (
            <React.Fragment>
                <TouchableOpacity onPress={this.tapVerified}>
                    <Image source={verifiedIcon} style={styles.verifiedIcon} />
                </TouchableOpacity>
                <Portal>
                    <Modal visible={isVerifyMenuVisible} onDismiss={this.tapVerified} contentContainerStyle={{ padding: 20 }}>
                        <Card style={{ borderRadius: 8 }}>
                            <Card.Content>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={verifiedIcon} style={styles.verifiedIconBig} />
                                    <Text style={{ ...styles.verifiedTitle, fontFamily: fonts.bold, color: colors.dark }}>
                                        Verified User
                                    </Text>
                                </View>
                                <Text style={{ fontFamily: fonts.regular, color: colors.dark }}>
                                    This account is verified. All verified accounts have been evaluated by our team.{' '}
                                    <TouchableOpacity style={{ height: 16 }} onPress={this.tapLearnMore}>
                                        <Text style={{ fontFamily: fonts.bold, color: colors.bonus }}>
                                            Learn more
                                        </Text>
                                    </TouchableOpacity>
                                </Text>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>
            </React.Fragment>
        )
    }

    tapResendCode = () => {
        // resend the code
        const { ownerEmail } = this.props

        if (ownerEmail != undefined) {
            this.props.doResendVerificationCode(ownerEmail)

            // immediately show the verify page
            this.props.navigation.navigate('ResendVerifyCodeComponent', { email: ownerEmail })
        }
    }

    tapPostOptions = () => {
        this.setState({ isMenuVisible: !this.state.isMenuVisible })
    }

    selectBlockMenu = () => {
        this.tapPostOptions()

        const { user, pageLocation } = this.props
        const userId = user.id

        if (userId) {
            this.props.doBlockUser(userId, pageLocation)
        }
    }

    selectFlagMenu = () => {
        this.tapPostOptions()

        const { user } = this.props
        const userId = user.id

        if (userId) {
            this.props.doReportUser(userId)
        }
    }

    renderViewMore = (onPress) => {
        const { colors, fonts } = this.props.theme
        return (
            <Text onPress={onPress} style={{ ...styles.viewMoreBioTextCont, fontFamily: fonts.semiBold, color: colors.secondary }}>
                View more
            </Text>
        )
    }

    renderViewLess = (onPress) => {
        const { colors, fonts } = this.props.theme
        return (
            <Text onPress={onPress} style={{ ...styles.viewMoreBioTextCont, fontFamily: fonts.semiBold, color: colors.secondary }}>
                View less
            </Text>
        )
    }

    renderVerifyEmailBanner = () => {
        const { colors, fonts } = this.props.theme
        const msg = "Verify your Email Address. "

        return (
            <View style={{ ...styles.banner, backgroundColor: colors.secondary }}>
                <Image source={emailBadgeIcon} style={styles.sadIcon} />
                <View style={{ flexDirection: 'row' }}></View>
                <Text numberOfLines={2} style={{ ...styles.verifyTitle, fontFamily: fonts.regular }}>
                    {msg}
                    <TouchableOpacity onPress={this.tapResendCode} style={{ marginTop: -2 }}>
                        <Text style={{ ...styles.verifySubtitle, fontFamily: fonts.semiBold }}>
                            Resend Code
                        </Text>
                    </TouchableOpacity>
                </Text>
            </View>
        )
    }

    renderSuspendedBanner = () => {
        const { colors, fonts } = this.props.theme
        const msg = "This account has been suspended.\n"
        const subtitle = "BlackPlanet suspends accounts which violate the "

        return (
            <View style={styles.suspendBanner}>
                <Text style={{ ...styles.suspendTitle, fontFamily: fonts.bold, color: colors.dark }}>
                    {msg}
                </Text>
                <Text style={{ ...styles.suspendSubTitle, fontFamily: fonts.regular, color: colors.gray }}>
                    {subtitle}
                </Text>
                <TouchableOpacity>
                    <Text style={{ ...styles.tnc, fontFamily: fonts.regular, color: colors.secondary }}>
                        Terms and Conditions
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    tapCoverImport = () => {
        const opts = { includeBase64: true, mediaType: 'photo', maxWidth: 1024, maxHeight: 769 }
        ImagePicker.launchImageLibrary(opts, (response) => {
            if (response.data != undefined) {
                this.props.doUpdateUserCoverPic(response.data)
            }
        })
    }

    tapImageImport = () => {
        const opts = { includeBase64: true, mediaType: 'photo', maxWidth: 800, maxHeight: 800 }
        ImagePicker.launchImageLibrary(opts, (response) => {
            if (response.data != undefined) {
                this.props.doUpdateUserAvatarPic(response.data)
            }
        })
    }

    tapGiveVerdict = () => {
        const { user, pageLocation } = this.props
        const userIsFollowing = user.viewer?.is_follower ?? false
        const verdict = userIsFollowing ? 'unfollow' : 'follow'
        this.props.doGiveUserVerdict(user.id, verdict, pageLocation)
    }

    tapMessage = () => {
        const { user, ownerUserId } = this.props
        const { id, nickname } = user

        if (id && ownerUserId && nickname) {
            const thread = { thread_id: `${id}-${ownerUserId}` }
            this.props.navigation.navigate('MessageThread', { thread, title: nickname, reloadThreadsAfterSend: true })
        }
    }

    tapVerified = async () => {
        const isVerifyMenuVisible = this.state.isVerifyMenuVisible
        this.setState({ isVerifyMenuVisible: !isVerifyMenuVisible })
    }

    tapLearnMore = async () => {
        const isVerifyMenuVisible = this.state.isVerifyMenuVisible
        this.setState({ isVerifyMenuVisible: !isVerifyMenuVisible })
        this.navigateToLearnMore()
    }

    navigateToLearnMore = async () => {
        const { browserProps } = this.props
        const link = 'https://help.blackplanet.com/blackplanet101/verified-user'

        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(link, browserProps)
            } else {
                Linking.openURL(url)
            }
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    tapFollowersList = () => {
        const { user } = this.props
        this.props.navigation.push('FollowerListComponent', { type: 'follower', userId: user.id })
    }

    tapFollowingList = () => {
        const { user } = this.props
        this.props.navigation.push('FollowingListComponent', { type: 'following', userId: user.id })
    }

    tapAccountSettings = () => {
        this.props.navigation.push('Settings')
    }

    tapEditBio = () => {
        this.setState({ isEditingBio: !this.state.isEditingBio })
    }

    tapUpdateBio = () => {
        const { user } = this.props
        const { bio } = user
        const { bioEdit } = this.state

        if (_.isEmpty(bioEdit) == false) {
            this.props.doUpdateUserBio(bioEdit)
        } else {
            this.setState({ isEditingBio: false, bioEdit: bio })
        }
    }

    tapCancelBio = () => {
        const { user } = this.props
        const { bio } = user
        this.setState({ isEditingBio: false, bioEdit: bio })
    }
}

const mapStateToProps = (state, onwProps) => {
    const users = state.profile.users || []
    const userId = onwProps.route.params?.userId ?? state.profile.userId
    let index = _.findIndex(users, { id: userId })

    let user = {}
    // find the user in the state
    if (userId && index != -1) {
        user = state.profile.users[index]
    }

    const _state = {
        user,
        isVerdictLoading: state.profile.isUserVerdictLoading,
        isBioLoading: user.bioIsLoading,
        bioSuccess: user.bioSuccess,
        ownerUserId: state.profile.userId,
        ownerEmail: state.account.email,
        pageLocation: state.root.currentPageLocation,
        blockIsLoading: state.profile.blockIsLoading,
        reportIsLoading: state.profile.reportIsLoading,
        browserProps: state.feed.browserProps || {}
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doReportUser: (userId) => dispatch(actReportUser(userId)),
        doBlockUser: (userId, pageLocation) => dispatch(actBlockUser(userId, pageLocation)),
        doLoadAccountSettings: () => dispatch(actLoadAccountSettings()),
        doGiveUserVerdict: (userId, verdict, pageLocation) => dispatch(actGiveUserVerdict(userId, verdict, pageLocation)),
        doUpdateUserCoverPic: (image) => dispatch(actUpdateUserCoverPic(image)),
        doUpdateUserAvatarPic: (image) => dispatch(actUpdateUserAvatarPic(image)),
        doUpdateUserBio: (bio) => dispatch(actUpdateUserBio(bio)),
        doResendVerificationCode: (email) => dispatch(actResendVerificationCode(email)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileHeaderComponent))