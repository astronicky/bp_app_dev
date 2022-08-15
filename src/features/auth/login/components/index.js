/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import { View, Text, BackHandler, Image, Keyboard, StatusBar, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import PageLoader from 'app/features/shared/page-loader/components/index'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

import { styles } from './style';
import { connect } from 'react-redux';
import { actLogin } from '../actions/index';
import { actRootExitApp } from '../../root/actions/index';
import { withTheme } from 'react-native-paper'

class LoginComponent extends Component {

    constructor(props) {
        super(props); this.state = {};

        BackHandler.addEventListener('hardwareBackPress', this.tapBack)
    }

    tapLogin = () => {
        // hide keyboard while logging in
        Keyboard.dismiss();

        const { username, password } = this.state;
        const isLoading = this.props.isLoading ?? false

        if (isLoading == false) {
            this.props.doLogin(username, password);
        }
    }

    tapForgotPass = async () => {
        const { browserProps, forgotPassLink } = this.props
        
        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(forgotPassLink, browserProps)
            } else {
                Linking.openURL(forgotPassLink)
            }
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    tapBack = () => {
        // // To navigate back to login page if pressed back.
        this.props.doExitApp();
        // exit the app
        BackHandler.exitApp();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.error) {
            alert(nextProps.error);
        }

        // if successful login, navigate to root component again
        if (nextProps.success) {
            setTimeout(() => {
                nextProps.navigation.navigate('AppTabNavigator');
            }, 1000);
        }
        
        if (nextProps.isDeactivated == true) {
            setTimeout(() => {
                nextProps.navigation.navigate('ActivateAccountComponent');
            }, 500);
        }

        return null
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.tapBack)
    }

    render() {
        const { isDev } = this.props
        const isLoading = this.props.isLoading ?? false
        const { colors, fonts } = this.props.theme
        const { username, password } = this.state

        return (
            <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always">
                <View style={{ ...styles.container, backgroundColor: colors.background }}>
                    <View style={styles.titleContainer}>
                        <Image style={styles.logo} source={require('app/assets/logo.png')} />
                        <Text style={{ ...styles.titleLine1, color: colors.dark, fontFamily: fonts.bold }}>
                            Log in to
                        </Text>
                        <Text style={{ ...styles.titleLine2, color: colors.dark, fontFamily: fonts.bold }}>
                            BlackPlanet
                        </Text>
                    </View>
                    <View style={styles.login_txtbox_container}>
                        <TextInput
                            style={{ ...styles.txtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                            autoCapitalize='none'
                            placeholder="Username"
                            placeholderTextColor={colors.gray}
                            autoFocus={true}
                            autoCorrect={false}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            clearButtonMode="always"
                            value={username}
                            onChangeText={(username) => this.setState({ username })}
                        />
                        <TextInput
                            style={{ ...styles.txtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                            autoCapitalize='none'
                            placeholder="Password"
                            placeholderTextColor={colors.gray}
                            autoCorrect={false}
                            secureTextEntry={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            clearButtonMode="always"
                            value={password}
                            onChangeText={(password) => this.setState({ password })}
                        />
                        <View style={styles.loginActionCont}>
                            <TouchableOpacity
                                style={{ ...styles.loginButton, backgroundColor: colors.secondary }}
                                disabled={isLoading}
                                onPress={this.tapLogin}>
                                <View style={styles.loginButtonText}>
                                    {isLoading == true &&
                                        <PageLoader color="white" />
                                    }
                                    {isLoading == false &&
                                        <Text style={{ ...styles.loginText, fontFamily: fonts.semiBold }}>
                                            Log in
                                        </Text>
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.otherActionCont}>
                            <TouchableOpacity style={styles.otherAction} onPress={this.tapForgotPass}>
                                <Text style={{ ...styles.otherActionText, fontFamily: fonts.regular, color: colors.secondary }}>
                                    Forgot Password
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ ...styles.otherActionText, fontFamily: fonts.regular, color: colors.secondary }}>
                                {'•'}
                            </Text>
                            <TouchableOpacity style={styles.otherAction} onPress={this.tapSignupButton}>
                                <Text style={{ ...styles.otherActionText, fontFamily: fonts.regular, color: colors.secondary }}>
                                    Sign up for BlackPlanet
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {isDev && 
                        <Text>Note: This is a development build.</Text>
                    }
                </View>
            </ScrollView>
        );
    }

    tapSignupButton = () => {
        this.props.navigation.navigate('Register')
    }
}

const mapStateToProps = (state) => {
    const _state = {
        isLoading: state.login.isLoading,
        error: state.login.error,
        success: state.login.success,
        isVerified: state.login.isVerified,
        browserProps: state.login.browserProps || {},
        forgotPassLink: state.login.forgotPassLink,
        isDev: state.login.isDev,
        isDeactivated: state.login.isDeactivated ?? false
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLogin: (username, password) => dispatch(actLogin(username, password)),
        doExitApp: () => dispatch(actRootExitApp())
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LoginComponent))