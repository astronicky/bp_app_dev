/*
 * Created by Justice on Wed Nov 18 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, Alert } from 'react-native'
import { Snackbar, withTheme } from 'react-native-paper'
import { styles } from './style'

import { actLoadAccountSettings } from '../actions/index'
import NotificationSettings from './notifications'
import PrivacySettings from './privacy'
import AccountSettings from './account'
import DeactivateSettings from './deactivate'

export class AccountSettingsComponent extends Component {

    componentDidMount() {
        this.props.doLoadAccountSettings()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.birthdateSuccess == true) {
            Alert.alert(
                'Settings', 'Successfully updated birthdate',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.passwordSuccess == true) {
            Alert.alert(
                'Settings', 'Successfully updated password',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.passwordError != undefined) {
            Alert.alert(
                'Settings', nextProps.passwordError,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.usernameSuccess == true) {
            Alert.alert(
                'Settings', 'Successfully updated username',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.usernameError != undefined) {
            Alert.alert(
                'Settings', nextProps.usernameError,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.displaynameSuccess == true) {
            Alert.alert(
                'Settings', 'Successfully updated displayname',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.genderSuccess == true) {
            Alert.alert(
                'Settings', 'Successfully updated gender',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }
        
        return null
    }

    render() {
        return (
            <React.Fragment>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
                    <PrivacySettings navigation={this.props.navigation} />
                    <AccountSettings navigation={this.props.navigation} />
                    <NotificationSettings />
                    <DeactivateSettings navigation={this.props.navigation} />
                </ScrollView>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {

    const _state = {
        placeholders: state.account.placeholders,
        settings: state.account,
        passwordError: state.account.passwordError,
        passwordSuccess: state.account.passwordSuccess,
        birthdateSuccess: state.account.birthdateSuccess,
        usernameSuccess: state.account.usernameSuccess,
        usernameError: state.account.usernameError,
        displaynameSuccess: state.account.displaynameSuccess,
        genderSuccess: state.account.genderSuccess,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLoadAccountSettings: () => dispatch(actLoadAccountSettings()),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AccountSettingsComponent))
