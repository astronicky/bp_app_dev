/*
 * Created by Justice on Thu Nov 19 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import { Button, withTheme } from 'react-native-paper'
import { styles } from './style'
import moment from 'moment'

import { actUpdateUsername, actUpdateDisplayname, actUpdateGender, actUpdateDateOfBirth, actUpdateUserIsOnline } from './../actions/index'
import RNPickerSelect from 'react-native-picker-select'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import PageLoader from 'app/features/shared/page-loader/components/index'

import { actSendVerificationCode } from './../actions/index';

export class AccountSettings extends Component {

    constructor(props) {
        super(props); this.state = { isDatePickerVisible: false };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.birthdateSuccess == true) {
            return {
                ...prevState,
                date: undefined, birthdayEdit: undefined
            }
        }

        if (nextProps.sendCodeSuccess == true) {
            nextProps.navigation.navigate('AccountVerifyCodeComponent')
        }

        return null
    }

    render() {
        const placeholders = this.props.placeholders

        return (
            <React.Fragment>
                {placeholders && this.renderMessage()}
            </React.Fragment>
        )
    }

    renderMessage = () => {
        const { placeholders, availableGenders, isLoadingSendCode } = this.props
        const { genderEdit, isDatePickerVisible } = this.state
        const { fonts, colors } = this.props.theme
        const settings = this.props.settings || {}

        const usernameEdit = this.state.usernameEdit ?? settings.username
        const displaynameEdit = this.state.displaynameEdit ?? settings.display_name
        const emailEdit = this.state.emailEdit ?? settings.email
        const usernameIsLoading = (settings || {}).usernameIsLoading ?? false
        const displaynameIsLoading = (settings || {}).displaynameIsLoading ?? false
        const genderIsLoading = (settings || {}).genderIsLoading ?? false
        const birthdateIsLoading = (settings || {}).birthdateIsLoading ?? false
        const setOnlineIsLoading = (settings || {}).isLoadingSetOnline ?? false
        const genderId = genderEdit ?? settings.genderId
        const birthdayEdit = this.state.birthdayEdit ?? (settings.birthday ?? 'Indicate a date')
        const birthdate = this.state.birthdate ?? (settings.birthdate ?? new Date())

        return (
            <View>
                <View style={styles.separator} />
                <Text style={{ ...styles.menuTitle, fontFamily: fonts.semiBold }}>
                    My Account
                </Text>
                <View style={styles.halfSeparator} />
                <View style={styles.settingContainer}>
                    <View style={styles.fieldLeftCont}>
                        <Text style={{ ...styles.settingSubTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.usernameTitle}
                        </Text>
                    </View>
                    <View style={styles.fieldMiddleCont}>
                        <TextInput
                            value={usernameEdit}
                            onChangeText={(usernameEdit) => this.setState({ usernameEdit })}
                            style={{ ...styles.field, color: colors.dark, fontFamily: fonts.regular }}
                        />
                    </View>
                    <View style={styles.fieldRightCont}>
                        <Button disabled={usernameIsLoading} loading={usernameIsLoading} color={colors.secondary} mode="contained" onPress={() => this.props.doUpdateUsername(usernameEdit)}>
                            Save
                        </Button>
                    </View>
                </View>
                <View style={{...styles.lineSeparator, backgroundColor: colors.gray}} />
                <View style={styles.settingContainer}>
                    <View style={styles.fieldLeftCont}>
                        <Text style={{ ...styles.settingSubTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.displaynameTitle}
                        </Text>
                    </View>
                    <View style={styles.fieldMiddleCont}>
                        <TextInput
                            value={displaynameEdit}
                            onChangeText={(displaynameEdit) => this.setState({ displaynameEdit })}
                            style={{ ...styles.field, color: colors.dark, fontFamily: fonts.regular }}
                        />
                    </View>
                    <View style={styles.fieldRightCont}>
                        <Button disabled={displaynameIsLoading} loading={displaynameIsLoading} color={colors.secondary} mode="contained" onPress={() => this.props.doUpdateDisplayname(displaynameEdit)}>
                            Save
                        </Button>
                    </View>
                </View>
                <View style={{...styles.lineSeparator, backgroundColor: colors.gray}} />
                <View style={styles.settingContainer}>
                    <View style={styles.fieldLeftCont}>
                        <Text style={{ ...styles.settingSubTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.emailTitle}
                        </Text>
                    </View>
                    <View style={styles.fieldMiddleCont}>
                        <TextInput
                            value={emailEdit}
                            onChangeText={(emailEdit) => this.setState({ emailEdit })}
                            style={{ ...styles.field, color: colors.dark, fontFamily: fonts.regular }}
                        />
                    </View>
                    <View style={styles.fieldRightCont}>
                        <Button disabled={isLoadingSendCode} loading={isLoadingSendCode} color={colors.secondary} mode="contained" onPress={() => { this.tapEditEmail() }}>
                            Save
                        </Button>
                    </View>
                </View>
                <View style={{...styles.lineSeparator, backgroundColor: colors.gray}} />
                <View style={styles.settingContainer}>
                    <View style={styles.fieldLeftCont}>
                        <Text style={{ ...styles.settingSubTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.genderTitle}
                        </Text>
                    </View>
                    <View style={styles.fieldMiddleCont}>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            placeholder={{ label: 'Select Gender', value: 0 }}
                            value={genderId}
                            style={{
                                inputIOS: { ...styles.field, color: colors.dark, fontFamily: fonts.regular },
                                inputAndroid: { ...styles.field, color: colors.dark, fontFamily: fonts.regular }
                            }}
                            onValueChange={(genderEdit) => this.setState({ genderEdit })}
                            items={availableGenders}
                        />
                    </View>
                    <View style={styles.fieldRightCont}>
                        <Button disabled={genderIsLoading} loading={genderIsLoading} color={colors.secondary} mode="contained" onPress={this.tapEditGender}>
                            Save
                        </Button>
                    </View>
                </View>
                <View style={{ ...styles.lineSeparator, backgroundColor: colors.gray }} />
                <View style={styles.settingContainer}>
                    <View style={styles.fieldLeftCont}>
                        <Text style={{ ...styles.settingSubTitle, color: colors.dark, fontFamily: fonts.regular }}>
                            {placeholders.birthdayTitle}
                        </Text>
                    </View>
                    <View style={styles.fieldMiddleCont}>
                        <TouchableOpacity onPress={this.tapSelectBirthdate}>
                            <Text style={{ ...styles.field, color: colors.dark, fontFamily: fonts.regular, paddingTop: 8 }}>
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
                    <View style={styles.fieldRightCont}>
                        <Button disabled={birthdateIsLoading} loading={birthdateIsLoading} color={colors.secondary} mode="contained" onPress={this.tapEditBirthdate}>
                            Save
                        </Button>
                    </View>
                </View>
                {/* <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.field, color: colors.dark, fontFamily: fonts.regular, paddingTop: 8 }}>
                            Set account is online
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        <Button disabled={setOnlineIsLoading} loading={setOnlineIsLoading} color={colors.secondary} mode="contained" onPress={this.tapEditIsOnline}>
                            ONLINE
                        </Button>
                    </View>
                </View> */}
            </View>
        )
    }

    tapEditGender = () => {
        const { genderEdit } = this.state
        if (genderEdit) {
            this.props.doUpdateGender(genderEdit)
        }
    }

    tapSelectBirthdate = () => {
        this.setState({ isDatePickerVisible: true })
    }

    tapEditBirthdate = () => {
        const { birthdate } = this.state
        if (birthdate) {
            const formattedDate = moment(birthdate).format('YYYY-MM-DD').toString()
            this.props.doUpdateDateOfBirth(formattedDate)
        }
    }

    tapEditIsOnline = () => {
        this.props.doUpdateUserIsOnline()
    }

    tapEditEmail = () => {
        const { emailEdit } = this.state
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // check if valid email
        if (reg.test(emailEdit) === true || emailEdit !== undefined) {
            this.props.doSendVerificationCode(emailEdit)
        }
    }

    tapConfirmDate = (date) => {
        const formattedDate = moment(date).format('MMM DD, YYYY').toString()
        this.setState({ isDatePickerVisible: false, birthdate: date, birthdayEdit: formattedDate })
    }

    tapCancelDate = () => {
        this.setState({ isDatePickerVisible: false })
    }
}

const mapStateToProps = (state) => {

    let msg
    if (state.account) {
        if (state.account.usernameSuccess) {
            msg = 'Username successfully updated'
        } else if (state.account.displaynameSuccess) {
            msg = 'Displayname successfully updated'
        }
    }

    const _state = {
        placeholders: state.account.placeholders,
        settings: state.account,
        showSnack: msg != undefined,
        snackMessage: msg,
        isLoadingSendCode: state.account.isLoadingSendCode ?? false,
        birthdateSuccess: state.account.birthdateSuccess,
        sendCodeSuccess: state.account.sendCodeSuccess,
        availableGenders: state.account.available_genders || []
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doSendVerificationCode: (code) => dispatch(actSendVerificationCode(code)),
        doUpdateDisplayname: (displayname) => dispatch(actUpdateDisplayname(displayname)),
        doUpdateUsername: (username) => dispatch(actUpdateUsername(username)),
        doUpdateUserIsOnline: () => dispatch(actUpdateUserIsOnline()),
        doUpdateGender: (gender) => dispatch(actUpdateGender(gender)),
        doUpdateDateOfBirth: (date) => dispatch(actUpdateDateOfBirth(date)),
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AccountSettings))