/*
 * Created by Justice on Wed Mar 17 2021
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import PageLoader from 'app/features/shared/page-loader/components/index';
import { styles } from './style';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';

import { actActivateAccount, actSetUserIsOnline } from './../actions/index';

class ActivateAccountComponent extends Component {

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.activateError) {
            Alert.alert(
                'Activate account', nextProps.error,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.activateSuccess == true) {
            nextProps.navigation.navigate('AppTabNavigator');
        }

        return null
    }

    render() {
        const { isLoading } = this.props
        const { colors, fonts } = this.props.theme
        const title = 'Please activate your account'
        const subTitle = 'We noticed that you recently deactivated your account. Please activate it to continue using the service.'

        return (
            <React.Fragment>
                <SafeAreaView>
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic" style={{ height: '92%' }}>
                        <View style={{ ...styles.activateContainer, backgroundColor: colors.background }}>
                            <View style={styles.titleContainer}>
                                <Image style={styles.logo} source={require('app/assets/logo.png')} />
                                <Text style={{ ...styles.titleLine, color: colors.secondary, fontFamily: fonts.bold }}>
                                    {title}
                                </Text>
                                <Text style={{ ...styles.subTitleLine, color: colors.gray, fontFamily: fonts.regular }}>
                                    {subTitle}
                                 </Text>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ ...styles.nextButtonCont, height: '8%' }}>
                        <TouchableOpacity onPress={this.tapNext}
                            disabled={isLoading}
                            style={{ ...styles.nextButton, backgroundColor: colors.secondary }}>
                            <View style={styles.nextButtonText}>
                                {isLoading == true &&
                                    <PageLoader color="white" />
                                }
                                {isLoading == false &&
                                    <Text style={{ ...styles.nextText, fontFamily: fonts.semiBold }}>
                                        Activate
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }

    tapNext = () => {
        this.props.doActivateAccount()
    }
}

const mapStateToProps = (state) => {
    const _state = {
        isLoading: state.root.activateAccountIsLoading ?? false,
        activateSuccess: state.root.activateAccountSuccess,
        activateError: state.root.activateAccountError,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doActivateAccount: () => dispatch(actActivateAccount()),
        doSetUserIsOnline: () => dispatch(actSetUserIsOnline())
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ActivateAccountComponent))