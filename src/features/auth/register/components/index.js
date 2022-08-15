/*
 * Created by Justice on Wed Nov 25 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import moment from 'moment';
import { View, Text, Image, Keyboard, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import PageLoader from 'app/features/shared/page-loader/components/index';
import Link from 'app/features/shared/link/components/index';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from './style';
import { connect } from 'react-redux';
import { withTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    setDisplayname, setUsername,
    setPassword, setConfirmPassword,
    setEmail, setBirthday,
    setGender, actLoadGenders,
    actSendVerificationCode
} from './../actions/index';

class RegisterComponent extends Component {

    constructor(props) {
        super(props); this.state = { isDatePickerVisible: false };
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

        if (nextProps.codeSuccess == true) {
            nextProps.navigation.navigate('VerifyCode')
        }

        return null
    }

    componentDidMount() {
        this.props.doLoadGenders()
    }

    render() {
        const { isLoading, genders, browserProps } = this.props
        const { isDatePickerVisible } = this.state
        const { colors, fonts } = this.props.theme
        const birthdayEdit = this.props.userInfo?.dob_desc ?? 'Select your Birthday'
        const birthdate = this.props.userInfo?.dob_date ?? new Date()
        const genderId = this.props.userInfo?.gender ?? 0

        return (
            <React.Fragment>
                <SafeAreaView>
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic" style={{ height: '92%' }}>
                        <View style={{ ...styles.container, backgroundColor: colors.background }}>
                            <View style={styles.titleContainer}>
                                <Image style={styles.logo} source={require('app/assets/logo.png')} />
                                <Text style={{ ...styles.titleLine, ...styles.centerText, color: colors.dark, fontFamily: fonts.bold }}>
                                    Welcome to BlackPlanet, {'\n'}let’s get you started on your journey!
                                </Text>
                            </View>
                            <View style={styles.backBtn}>
                                <IconButton
                                    icon="arrow-left"
                                    color={colors.secondary}
                                    size={30}
                                    style={{ backgroundColor: 'white' }}
                                    onPress={() => this.props.navigation.popToTop() }
                                />
                            </View>
                        </View>
                        <View style={styles.txtbox_container}>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                What is the name you want others to see while you are voyaging through this experience?
                            </Text>
                            <TextInput
                                style={{ ...styles.txtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                autoCapitalize='none'
                                placeholder="Display Name"
                                placeholderTextColor={colors.gray}
                                autoFocus={false}
                                autoCorrect={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                clearButtonMode="always"
                                onChangeText={(displayname) => this.props.setDisplayname(displayname)}
                            />
                        </View>
                        <View style={styles.txtbox_container}>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                Create a username! If it’s not available we will ask you to create another one.
                            </Text>
                            <TextInput
                                style={{ ...styles.txtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                autoCapitalize='none'
                                placeholder="Username"
                                placeholderTextColor={colors.gray}
                                autoFocus={false}
                                autoCorrect={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                clearButtonMode="always"
                                onChangeText={(username) => this.props.setUsername(username)}
                            />
                        </View>
                        <View style={styles.txtbox_container}>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                What is your gender?
                            </Text>
                            <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{ label: 'Select Gender', value: 0 }}
                                value={genderId}
                                style={{
                                    inputIOS: { ...styles.smallTxtbox, color: colors.dark, fontFamily: fonts.regular, borderColor: colors.gray },
                                    inputAndroid: { ...styles.smallTxtbox, color: colors.dark, fontFamily: fonts.regular, borderColor: colors.gray }
                                }}
                                onValueChange={(id) => this.props.setGender(id)}
                                items={genders}
                            />
                        </View>
                        <View style={styles.txtbox_container}>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                Let’s connect! Enter your email address, we will send you a code via email to verify this account.
                            </Text>
                            <TextInput
                                style={{ ...styles.bigTxtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                autoCapitalize='none'
                                placeholder="Email Address"
                                placeholderTextColor={colors.gray}
                                autoFocus={false}
                                autoCorrect={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                clearButtonMode="always"
                                onChangeText={(email) => this.props.setEmail(email)}
                            />
                        </View>
                        <View style={styles.txtbox_container}>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                Create a strong password that will not be easily forgotten
                            </Text>
                            <View style={styles.halfTxtCont}>
                                <TextInput
                                    style={{ ...styles.halfTxtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                    autoCapitalize='none'
                                    placeholder="Password"
                                    placeholderTextColor={colors.gray}
                                    autoFocus={false}
                                    autoCorrect={false}
                                    secureTextEntry={true}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    clearButtonMode="always"
                                    textContentType={'oneTimeCode'}
                                    onChangeText={(password) => this.props.setPassword(password)}
                                />
                                <TextInput
                                    style={{ ...styles.halfTxtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                    autoCapitalize='none'
                                    placeholder="Confirm Password"
                                    placeholderTextColor={colors.gray}
                                    autoFocus={false}
                                    autoCorrect={false}
                                    secureTextEntry={true}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    clearButtonMode="always"
                                    textContentType={'oneTimeCode'}
                                    onChangeText={(confirmPassword) => this.props.setConfirmPassword(confirmPassword)}
                                />
                            </View>
                        </View>
                        <View style={styles.txtbox_container}>
                            <Text style={{ ...styles.boldCaption, color: colors.dark, fontFamily: fonts.semiBold }}>
                                Birthday
                            </Text>
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.semiBold }}>
                                Must be at least 13 years old to sign up for Black Planet. Younger users are not permitted.
                            </Text>
                            <TouchableOpacity onPress={this.tapSelectBirthdate}>
                                <Text style={{ ...styles.txtbox, color: colors.gray, fontFamily: fonts.regular, borderColor: colors.gray }}>
                                    {birthdayEdit}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={this.tapConfirmDate}
                                onCancel={this.tapCancelDate}
                                date={birthdate}
                            />
                        </View>
                        <View style={{ ...styles.agreementCont }} >
                            <Text style={{ ...styles.agreementCaption, color: colors.gray, fontFamily: fonts.regular }}>
                                {'By tapping Sign up, you agree to our '}
                                <Link style={{ fontFamily: fonts.bold, fontSize: 10 }} browserProps={browserProps} url='https://urban1.com/terms-of-service/'>
                                    Terms, Data Policy
                                </Link>
                            </Text>
                            <Text style={{ ...styles.agreementCaption, color: colors.gray, fontFamily: fonts.regular }}>
                                {' and '} 
                                <Link style={{ fontFamily: fonts.bold, fontSize: 10 }} browserProps={browserProps} url='https://urban1.com/privacy/'>
                                    Cookies Policy
                                </Link>
                            </Text>
                        </View>
                    </ScrollView>
                    <View style={{ ...styles.signupButtonCont, height: '8%' }}>
                        <TouchableOpacity onPress={this.tapSignup}
                            disabled={isLoading}
                            style={{ ...styles.signupButton, backgroundColor: colors.secondary }}>
                            <View style={styles.signupButtonText}>
                                {isLoading == true &&
                                    <PageLoader color="white" />
                                }
                                {isLoading == false &&
                                    <Text style={{ ...styles.signupText, fontFamily: fonts.semiBold }}>
                                        Sign up
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }

    tapSelectBirthdate = () => {
        this.setState({ isDatePickerVisible: true })
    }

    tapConfirmDate = (date) => {
        const birthDesc = moment(date).format('MMM DD, YYYY').toString()
        const birthDay = moment(date).format('YYYY-MM-DD').toString()
        this.props.setBirthday(date, birthDay, birthDesc)
        this.setState({ isDatePickerVisible: false })
    }

    tapCancelDate = () => {
        this.setState({ isDatePickerVisible: false })
    }

    tapSignup = () => {
        const email = this.props.userInfo?.email
        const username = this.props.userInfo?.username
        const password = this.props.userInfo?.password
        const displayname = this.props.userInfo?.display_name
        const confirmPassword = this.props.userInfo?.confirm_password
        const gender = this.props.userInfo?.gender
        const dob = this.props.userInfo?.dob

        if (email && username && displayname && password && confirmPassword && gender && dob) {
            this.props.doSendVerificationCode(email, username, password, confirmPassword, dob)
        } else {
            Alert.alert(
                'Create an account', 'Please complete all fields',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }
    }
}

const mapStateToProps = (state) => {
    const _state = {
        userInfo: state.register.userInfo,
        isLoading: state.register.isLoadingCode ?? false,
        genders: state.register.availableGenders ?? [],
        error: state.register.codeError,
        codeSuccess: state.register.codeSuccess,
        browserProps: state.login.browserProps
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        setDisplayname: (value) => dispatch(setDisplayname(value)),
        setUsername: (value) => dispatch(setUsername(value)),
        setPassword: (value) => dispatch(setPassword(value)),
        setConfirmPassword: (value) => dispatch(setConfirmPassword(value)),
        setEmail: (value) => dispatch(setEmail(value)),
        setBirthday: (dateObj, date, desc) => dispatch(setBirthday(dateObj, date, desc)),
        setGender: (genderId) => dispatch(setGender(genderId)),
        doLoadGenders: () => dispatch(actLoadGenders()),
        doSendVerificationCode: (email, username, password, confirmPassword, bday) => dispatch(actSendVerificationCode(email, username, password, confirmPassword, bday)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RegisterComponent))