/*
 * Created by Justice on Thu Mar 04 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import PageLoader from 'app/features/shared/page-loader/components/index';
import Recaptcha from 'react-native-recaptcha-that-works';
import { styles } from '../../account/components/style';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';

import { setVerificationCode, actVerifyEmail } from '../../account/actions/index';

class ResendVerifyCodeComponent extends Component {

    constructor(props) {
        super(props); this.state = { isDatePickerVisible: false };
        this.recaptcha = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.error) {
            Alert.alert(
                'Verify Email', nextProps.error,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }
        
        if (nextProps.verifyEmailSuccess == true) {
            Alert.alert(
                'Verify Email', 'Email successfully verified',
                [
                    { text: 'OK', onPress: () => { nextProps.navigation.pop() } },
                ]
            );
        }

        return null
    }

    render() {
        const { isLoading, account } = this.props
        const { colors, fonts } = this.props.theme

        return (
            <React.Fragment>
                    <Recaptcha
                        ref={this.recaptcha}
                        siteKey="6LdHocMZAAAAAE0vQsY5pRi-nbUIUpB0CemmXjsZ"
                        baseUrl="https://pluto.blackplanet.com/"
                        onVerify={this.onVerify}
                        onExpire={this.onExpire}
                        size="invisible"
                    />
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic" style={{ height: '92%' }}>
                        <View style={{ ...styles.codeContainer, backgroundColor: colors.background }}>
                            <View style={styles.titleContainer}>
                                <Image style={styles.logo} source={require('app/assets/logo.png')} />
                                <Text style={{ ...styles.titleLine, color: colors.dark, fontFamily: fonts.bold }}>
                                    We sent you a code!
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...styles.txtbox_container, ...styles.topSeparator }}>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                Enter it below to verify your email address
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
                        </View>
                    </ScrollView>
                    <View style={{ ...styles.updateButtonCont, height: '8%' }}>
                        <TouchableOpacity onPress={this.tapNext}
                            disabled={isLoading}
                            style={{ ...styles.updateButton, backgroundColor: colors.secondary }}>
                            <View style={styles.updateButtonText}>
                                {isLoading == true &&
                                    <PageLoader color="white" />
                                }
                                {isLoading == false &&
                                    <Text style={{ ...styles.updateText, fontFamily: fonts.semiBold }}>
                                        Verify Email
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
            </React.Fragment>
        );
    }

    tapNext = () => {
        const email = this.props.route.params?.email
        const { code, account } = this.props

        if (email && code) {
            // generate captcha
            this.recaptcha.current.open();
        } else {
            Alert.alert(
                'Verify Email', 'Please indicate the verification code sent to your email.',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }
    }

    onVerify = token => {
        const email = this.props.route.params?.email
        const { code } = this.props
        const captcha = token

        if (email && code && captcha) {
            this.props.doVerifyEmail(email, code, captcha)
        }
    }

    onExpire = () => {
        console.warn('expired!');
    }
}

const mapStateToProps = (state) => {

    const _state = {
        account: state.account,
        code: state.account.verificationCode,
        isLoading: state.account.verifyEmailIsLoading ?? false,
        verifyEmailSuccess: state.account.verifyEmailSuccess,
        error: state.account.verifyEmaillError
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        setVerificationCode: (value) => dispatch(setVerificationCode(value)),
        doVerifyEmail: (email, code, captcha) => dispatch(actVerifyEmail(email, code, captcha))
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ResendVerifyCodeComponent))