/*
 * Created by Justice on Mon Feb 20 2021
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import { Button, withTheme, IconButton } from 'react-native-paper'
import { styles } from './style'
import { actCloseAccount, actDeactivateAccount } from './../actions/index'
import { actLogoutUser } from './../../../auth/root/actions/index'

export class DeactivateConfirmComponent extends Component {

    state = {}
    
    static getDerivedStateFromProps(nextProps, prevState) {
        // if success, logout the account immediately
        if (nextProps.success == true) {
            nextProps.doLogoutUser()
        }
    }

    render() {
        const placeholders = this.props.placeholders
        return (
            <ScrollView>
                {placeholders &&
                    this.renderMessage()
                }
            </ScrollView>

        )
    }

    renderMessage = () => {
        const { placeholders, isLoading, success } = this.props
        const { fonts, colors } = this.props.theme
        const { selectedOption } = this.state

        return (
            <View style={styles.deactContainer}>
                <Text style={{ ...styles.deactTitle, fontFamily: fonts.semiBold, color: colors.dark }}>
                    {placeholders.deactivateModalTitle}
                </Text>
                <Text style={{ ...styles.deactSubtitle, fontFamily: fonts.regular, color: colors.darkGray }}>
                    {placeholders.deactivateModalSubtitle}
                </Text>
                {placeholders.deactivateOptions.map(option => 
                    <View style={{ ...styles.deactOptionContainer, borderColor: colors.gray }}>
                        <TouchableOpacity disabled={isLoading == true} onPress={() => this.tapOption(option.value)}>
                            <View style={styles.optionContainer}>
                                <View style={styles.optionRadioContainer}>
                                    <IconButton
                                        icon={selectedOption == option.value ? 'radiobox-marked' : 'radiobox-blank'}
                                        color={colors.secondary}
                                        size={20}
                                    />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <Text style={{ ...styles.optionTitle, color: colors.dark, fontFamily: fonts.semiBold }}>
                                        {option.title}
                                    </Text>
                                    <Text style={{ ...styles.optionSubtitle, color: colors.darkGray, fontFamily: fonts.regular }}>
                                        {option.subtitle}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 30 }}>
                    <Button loading={isLoading} disabled={selectedOption == undefined || isLoading == true || success == true} color={colors.secondary} mode="contained" onPress={this.tapContinue}>
                        Continue
                    </Button>
                    <View style={{ width: 10 }} />
                    <Button disabled={isLoading == true || success == true} color={colors.secondary} mode="outlined" onPress={this.tapCancel}>
                        Cancel
                    </Button>
                </View>
            </View>
        )
    }

    tapOption = (option) => {
        this.setState({ selectedOption: option })
    }

    tapContinue = () => {
        const { selectedOption } = this.state
        if (selectedOption) {
            if (selectedOption == 'delete') {
                Alert.alert(
                    'Delete Account', 
                    'Are you sure you want to delete your account?',
                    [
                        { text: 'OK', onPress: () => { this.props.doCloseAccount() } },
                        { text: 'Cancel', onPress: () => {  } },
                    ]
                );
            } else if (selectedOption == 'deactivate') {
                Alert.alert(
                    'Deactivate Account', 
                    'Are you sure you want to deactivate your account?',
                    [
                        { text: 'OK', onPress: () => { this.props.doDeactivateAccount() } },
                        { text: 'Cancel', onPress: () => {  } },
                    ]
                );
            }
        }
    }

    tapCancel = () => {
        this.props.navigation.goBack()
    }
}

const mapStateToProps = (state) => {

    const _state = {
        placeholders: state.account.placeholders,
        settings: state.account.notifications,
        isLoading: state.account.closeAccountIsLoading == true || state.account.deactivateAccountIsLoading == true,
        success: state.account.deactivateAccountSuccess == true || state.account.closeAccountSuccess == true
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doCloseAccount: () => dispatch(actCloseAccount()),
        doDeactivateAccount: () => dispatch(actDeactivateAccount()),
        doLogoutUser: () => dispatch(actLogoutUser())
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(DeactivateConfirmComponent))