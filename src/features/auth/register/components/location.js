/*
 * Created by Justice on Thu Nov 26 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, Image, Keyboard, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import PageLoader from 'app/features/shared/page-loader/components/index';
import Geolocation from '@react-native-community/geolocation';
import { styles } from './style';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';

import { actUpdateLocation, setLocation, actFindLocation } from './../actions/index';

class LocationComponent extends Component {

    constructor(props) {
        super(props); this.state = { isDatePickerVisible: false };
    }

    componentDidMount() {
        this.findCoordinates()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if has error, display it
        if (nextProps.locationError) {
            Alert.alert(
                'Create an account', nextProps.error,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            );
        }

        if (nextProps.locationSuccess == true) {
            nextProps.navigation.navigate('FriendSuggestion')
        }

        return null
    }

    render() {
        const { isLoading } = this.props
        const { colors, fonts } = this.props.theme
        const currentLocation = this.props.userInfo?.currentLocation
        const title = currentLocation == undefined ? 'Please indicate your location' : 'We have determined \n that your location is';
        const subTitle = currentLocation == undefined ? '' : "Correct me if I'm wrong."

        return (
            <React.Fragment>
                <SafeAreaView>
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic" style={{ height: '92%' }}>
                        <View style={{ ...styles.container, backgroundColor: colors.background }}>
                            <View style={styles.titleContainer}>
                                <Image style={styles.logo} source={require('app/assets/logo.png')} />
                                <Text style={{ ...styles.titleLine, color: colors.dark, fontFamily: fonts.bold }}>
                                    {title}
                                </Text>
                                {currentLocation &&
                                    <Text style={{ ...styles.subTitleLine, color: colors.secondary, fontFamily: fonts.bold }}>
                                        {currentLocation}
                                    </Text>
                                }
                            </View>
                        </View>
                        <View style={{ ...styles.txtbox_container, ...styles.topFieldSeparator }}>
                            <TextInput
                                style={{ ...styles.txtbox, fontFamily: fonts.regular, borderColor: colors.gray }}
                                autoCapitalize='none'
                                placeholder="Location"
                                placeholderTextColor={colors.gray}
                                autoFocus={false}
                                autoCorrect={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                clearButtonMode="always"
                                onChangeText={(location) => this.props.setLocation(location)}
                            />
                            <Text style={{ ...styles.caption, color: colors.gray, fontFamily: fonts.regular }}>
                                {subTitle}
                            </Text>
                        </View>
                    </ScrollView>
                    <View style={{ ...styles.signupButtonCont, height: '8%' }}>
                        <TouchableOpacity onPress={this.tapNext}
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

    tapNext = () => {
        const location = this.props.userInfo?.location
        const currentLocation = this.props.userInfo?.currentLocation

        if (location && _.isEmpty(location) == false) {
            this.props.doUpdateLocation(location)
        } else {
            if (currentLocation && _.isEmpty(currentLocation) == false) {
                this.props.doUpdateLocation(currentLocation)
            } else {
                // skip the process entirely
                this.props.navigation.navigate('FriendSuggestion')
            }
        }
    }

    findCoordinates = () => {
		Geolocation.getCurrentPosition(
			position => {
                const latitude = position.coords?.latitude
                const longitude = position.coords?.longitude
                this.props.doFindLocation(latitude, longitude)
			},
			error => {
                Alert.alert(error.message)
            },
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
    };
}

const mapStateToProps = (state) => {
    const _state = {
        userInfo: state.register.userInfo,
        isLoading: state.register.isLoadingLocation ?? false,
        locationSuccess: state.register.locationSuccess,
        locationError: state.register.locationError,
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        setLocation: (value) => dispatch(setLocation(value)),
        doUpdateLocation: (value) => dispatch(actUpdateLocation(value)),
        doFindLocation: (lat, lng) => dispatch(actFindLocation(lat, lng)),
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LocationComponent))