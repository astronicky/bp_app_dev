/*
 * Created by Justice on Thu Nov 26 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import moment from 'moment'
import { View, Text, Image, Keyboard, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import PageLoader from 'app/features/shared/page-loader/components/index';
import Recaptcha from 'react-native-recaptcha-that-works';
import { styles } from './style';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';

import { setVerificationCode, actCheckVerificationCode, actResendVerificationCode } from './../actions/index';

class VerifyCodeComponent extends Component {

    constructor(props) {
        super(props); this.state = { isDatePickerVisible: false };
        this.recaptcha = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.error) {
            Alert.alert(
                'Create an account', nextProps.error,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.verifyCodeLoginSuccess == true) {
            nextProps.navigation.navigate('Location')
        }

        if (nextProps.resendCodeSuccess == true) {
            Alert.alert(
                'Create an account', 'Code Resent, Please check your inbox again.',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.verifyCodeSuccess == true) {
            Alert.alert(
                'Create an account', 'Account successfully created',
                [
                    { text: 'OK', onPress: () => { nextProps.navigation.popToTop() } },
                ]
            );
        }

        return null
    }

    render() {
        const { isLoading } = this.props
        const { colors, fonts } = this.props.theme

        return (
            <React.Fragment>
                <SafeAreaView>
                    <Recaptcha
                        ref={this.recaptcha}
                        siteKey="6LdHocMZAAAAAE0vQsY5pRi-nbUIUpB0CemmXjsZ"
                        baseUrl="https://pluto.blackplanet.com/"
                        onVerify={this.onVerify}
                        onExpire={this.onExpire}
                        size="invisible"
                    />
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic" style={{ height: '92%' }}>
                        <View style={{ ...styles.container, backgroundColor: colors.background }}>
                            <View style={styles.titleContainer}>
                                <Image style={styles.logo} source={require('app/assets/logo.png')} />
                                <Text style={{ ...styles.titleLine, color: colors.dark, fontFamily: fonts.bold }}>
                                    We sent you a code!
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...styles.txtbox_container, ...styles.topSeparator }}>
                            <Text style={{ ...styles.caption, ...styles.centerText, color: colors.gray, fontFamily: fonts.regular }}>
                                Check your inbox and type in the verification code here.
                            </Text>
                            <TextInput
                                style={{ ...styles.txtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                autoCapitalize='none'
                                placeholder="Code"
                                placeholderTextColor={colors.gray}
                                autoFocus={false}
                                autoCorrect={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                clearButtonMode="always"
                                onChangeText={(code) => this.props.setVerificationCode(code)}
                            />
                            <View style={styles.smallSeparator} />
                            <Text style={{ ...styles.caption, ...styles.centerText, color: colors.gray, fontFamily: fonts.regular }}>
                                If you don’t see an email from us, check out your spam. {'\n'} If it’s not it your spam please email <Text style={{ ...styles.otherActionTextUnderline, fontFamily: fonts.semiBold, color: colors.gray }}>help@blackplanet.com</Text>
                            </Text>
                        </View>
                        <View style={styles.otherActionCont}>
                            <TouchableOpacity style={styles.otherAction} onPress={this.tapResend}>
                                <Text style={{ ...styles.otherActionTextUnderline, fontFamily: fonts.semiBold, color: colors.gray }}>
                                    Resend Email
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.otherAction} onPress={this.tapSignupButton}>
                                <Text style={{ ...styles.otherActionText, fontFamily: fonts.regular, color: colors.gray }}>
                                    Having Trouble? <Text style={{ ...styles.otherActionTextUnderline, fontFamily: fonts.semiBold, color: colors.gray }}>Contact us</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View style={{ ...styles.signupButtonCont, height: '8%' }}>
                        <TouchableOpacity onPress={this.tapNext}
                            disabled={isLoading}
                            style={{ ...styles.signupButton, backgroundColor: colors.secondary }}>
                            <View style={styles.signupButtonText}>
                                {isLoading == true &&
                                    <PageLoader color="white" />
                                }
                                {isLoading == false &&
                                    <Text style={{ ...styles.signupText, fontFamily: fonts.semiBold }}>
                                        Next
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }

    tapResend = () => {
        const email = this.props.userInfo?.email
        if (email) {
            this.props.doResendVerificationCode(email)
        } 
    }

    tapNext = () => {
        const email = this.props.userInfo?.email
        const code = this.props.userInfo?.code

        if (email && code) {
            // generate captcha
            this.recaptcha.current.open();
        } else {
            Alert.alert(
                'Create an account', 'Please indicate the verification code sent to your email.',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }
    }

    onVerify = token => {
        const email = this.props.userInfo?.email
        const code = this.props.userInfo?.code
        const captcha = token

        const username = this.props.userInfo?.username
        const displayname = this.props.userInfo?.display_name
        const password = this.props.userInfo?.password
        const confirmPassword = this.props.userInfo?.confirm_password
        const gender = this.props.userInfo?.gender
        const dob = this.props.userInfo?.dob

        if (email && code && captcha && username && displayname && password && confirmPassword && gender && dob) {
            this.props.doCheckVerificationCode(email, username, password, displayname, dob, code, captcha, gender)
        }
    }

    onExpire = () => {
        console.warn('expired!');
    }
}

const mapStateToProps = (state) => {
    const _state = {
        userInfo: state.register.userInfo,
        isLoading: (state.register.isLoadingVerifyCode || state.register.isLoadingResendCode) ?? false,
        verifyCodeSuccess: state.register.verifyCodeSuccess,
        verifyCodeLoginSuccess: state.register.verifyCodeLoginSuccess,
        resendCodeSuccess: state.register.resendCodeSuccess,
        error: state.register.verifyCodeError
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        setVerificationCode: (value) => dispatch(setVerificationCode(value)),
        doResendVerificationCode: (email) => dispatch(actResendVerificationCode(email)),
        doCheckVerificationCode: (email, username, password, displayname, birthday, code, captcha, gender) => dispatch(actCheckVerificationCode(email, username, password, displayname, birthday, code, captcha, gender)),
        doSendVerificationCode: (email, username, password, confirmPassword, bday) => dispatch(actSendVerificationCode(email, username, password, confirmPassword, bday)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(VerifyCodeComponent))