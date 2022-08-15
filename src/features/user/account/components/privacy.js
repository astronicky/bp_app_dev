/*
 * Created by Justice on Wed Nov 18 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Text, View, TextInput, Alert, Image } from 'react-native'
import { Switch, Button, withTheme } from 'react-native-paper'
import { styles } from './style'

import Geolocation from '@react-native-community/geolocation';
import PageLoader from 'app/features/shared/page-loader/components/index'
import { actToggleAccountPrivacy, actUpdatePassword, actUpdateLocation, actHideLocation } from './../actions/index'
import { TouchableOpacity } from 'react-native-gesture-handler'

import searchIcon from 'app/assets/searchIcon.png'
import blockIcon from 'app/assets/blockIcon.png'

export class PrivacySettings extends Component {

    constructor(props) {
        super(props); this.state = { showPasswordFields: false };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.passwordSuccess == true || nextProps.passwordError) {
            return {
                ...prevState,
                // clear state
                currentPass: '', newPass: '', confirmPass: ''
            }
        }

        return null
    }

    render() {

        const { placeholders } = this.props

        return (
            <React.Fragment>
                {placeholders &&
                    this.renderMessage()
                }
            </React.Fragment>
        )
    }

    renderMessage = () => {

        const { currentPass, newPass, confirmPass, showPasswordFields } = this.state
        const { placeholders, passwordIsLoading } = this.props
        const { fonts, colors } = this.props.theme
        const settings = this.props.settings || {}

        const profilePrivacyIsLoading = (settings || {}).profilePrivacyIsLoading ?? false
        const profilePrivacy = settings.is_profile_private ?? false

        const displayLocationIsLoading = (settings || {}).locationIsLoading ?? false
        const hasLocation = _.isEmpty(settings.location ?? '') == false

        return (
            <View>
                <View style={styles.separator} />
                <Text style={{ ...styles.menuTitle, fontFamily: fonts.semiBold }}>
                    Privacy and Security Settings
                </Text>
                <View style={styles.halfSeparator} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.profilePrivateTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular }}>
                            {placeholders.profilePrivateCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {profilePrivacyIsLoading == false &&
                            <Switch value={profilePrivacy}
                                color={colors.secondary}
                                onValueChange={() => this.props.doToggleAccountPrivacy()}
                            />
                        }
                        {profilePrivacyIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.displayLocationTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular }}>
                            {placeholders.displayLocationCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        {displayLocationIsLoading == false &&
                            <Switch
                                color={colors.secondary}
                                value={hasLocation}
                                onValueChange={this.findCoordinates}
                            />
                        }
                        {displayLocationIsLoading &&
                            <PageLoader />
                        }
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.halfSeparator} />
                <View style={styles.settingContainer}>
                    <View style={{ ...styles.fieldLeftCont, justifyContent: 'flex-start' }}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.passwordTitle}
                        </Text>
                    </View>
                    {showPasswordFields == false &&
                        <View style={styles.settingRightCont}>
                            <Button color={colors.secondary} loading={passwordIsLoading} disabled={passwordIsLoading} mode="contained" onPress={this.tapToggleUpdatePass}>
                                Edit
                            </Button>
                        </View>
                    }
                    {showPasswordFields == true &&
                        <View style={styles.fieldMiddleCont}>
                            <TextInput
                                placeholder={placeholders.currentPassCaption}
                                secureTextEntry={true}
                                value={currentPass}
                                onChangeText={(currentPass) => this.setState({ currentPass })}
                                style={{ ...styles.whiteField, color: colors.dark, fontFamily: fonts.regular }}
                            />
                            <TextInput
                                placeholder={placeholders.newPassCaption}
                                secureTextEntry={true}
                                value={newPass}
                                onChangeText={(newPass) => this.setState({ newPass })}
                                style={{ ...styles.whiteField, color: colors.dark, fontFamily: fonts.regular }}
                            />
                            <TextInput
                                placeholder={placeholders.confirmNewPassCaption}
                                secureTextEntry={true}
                                value={confirmPass}
                                onChangeText={(confirmPass) => this.setState({ confirmPass })}
                                style={{ ...styles.whiteField, color: colors.dark, fontFamily: fonts.regular }}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Button style={{ marginRight: 10 }} color={colors.secondary} mode="outlined" onPress={this.tapToggleUpdatePass}>
                                    {placeholders.cancel}
                                </Button>
                                <Button loading={passwordIsLoading} color={colors.secondary} mode="contained" onPress={this.tapUpdatePass}>
                                    {placeholders.update}
                                </Button>
                            </View>
                        </View>
                    }
                </View>
                <View style={styles.halfSeparator} />
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.blockTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular }}>
                            {placeholders.blockCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        <TouchableOpacity onPress={this.tapViewBlockedUsers}>
                            <Text style={{ ...styles.field, color: colors.secondary, fontFamily: fonts.regular }}>
                                {placeholders.viewAll}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    tapToggleUpdatePass = () => {
        this.setState({ showPasswordFields: !this.state.showPasswordFields })
    }

    tapUpdatePass = () => {
        const { currentPass, newPass, confirmPass } = this.state

        if (_.isEmpty(currentPass) == false && _.isEmpty(newPass) == false && _.isEmpty(confirmPass) == false) {
            if (newPass == confirmPass) {
                if (newPass.length >= 8 && newPass.length <= 16) {
                    this.props.doUpdatePassword(currentPass, newPass)
                    this.setState({ showPasswordFields: false })
                } else {
                    Alert.alert('Password cannot be longer than 16 characters or shorter than 8 characters.')
                }
            } else {
                Alert.alert('New Password and Confirm Password does not match.')
            }
        }
    }

    tapViewBlockedUsers = () => {
        this.props.navigation.navigate('BlockListComponent')
    }

    findCoordinates = () => {
        Geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords?.latitude
                const longitude = position.coords?.longitude
                this.updateLocation(latitude, longitude)
            },
            error => {
                Alert.alert(error.message)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    updateLocation = (latitude, longitude) => {
        const settings = this.props.settings || {}
        const hasLocation = _.isEmpty(settings.location ?? '') == false

        // if has location, user is intends to turn off the location
        if (hasLocation) {
            this.props.doHideLocation()
        } else {
            if (latitude && longitude) {
                this.props.doUpdateLocation(latitude, longitude)
            }
        }
    }
}

const mapStateToProps = (state) => {

    const _state = {
        placeholders: state.account.placeholders,
        settings: state.account,
        passwordIsLoading: state.account.passwordIsLoading,
        passwordSuccess: state.account.passwordSuccess,
        passwordError: state.account.passwordError
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doToggleAccountPrivacy: () => dispatch(actToggleAccountPrivacy()),
        doHideLocation: () => dispatch(actHideLocation()),
        doUpdateLocation: (lat, lng) => dispatch(actUpdateLocation(lat, lng)),
        doUpdatePassword: (currentPassword, newPassword) => dispatch(actUpdatePassword(currentPassword, newPassword))
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PrivacySettings))