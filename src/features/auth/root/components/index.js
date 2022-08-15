/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { styles } from './style';
import { actSetRootView, actLogoutUser, actSetUserIsOnline } from '../actions/index';

class RootComponent extends Component {

    constructor(props) {
        super(props); this.state = { hasLoggedOut: false };
    }

    componentDidMount() {
        // IMPORTANT: logout will redirect to this to avoid bug
        const shouldLogout = this.props.route.params?.logout;
        if (shouldLogout == undefined) {
            this.props.doSetRootView();
        } 
    }

    componentDidUpdate() {
        const shouldLogout = this.props.route.params?.logout;
        if (shouldLogout) {
            // added some delay to make it consistent upon login loading
            setTimeout(() => {
                this.props.doLogoutUser();
            }, 300);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.hasNoUser == false) {
            if (nextProps.isDeactivated == false) {
                nextProps.navigation.navigate('AppTabNavigator');
                nextProps.doSetUserIsOnline()
            } else {
                nextProps.navigation.navigate('ActivateAccountComponent')
            }
        }

        // if has no user, force user to login
        // if has exited the app (android) and has no user, redirect to login
        if (nextProps.successLogout || nextProps.hasNoUser || nextProps.hasExitedApp) {
            nextProps.navigation.navigate('AuthNavigator');
        }

        return null;
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={styles.loading} size="large" color="gray" />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const _state = {
        hasNoUser: state.root.hasNoUser,
        isDeactivated: state.root.isDeactivated ?? false,
        successLogout: state.root.successLogout,
        hasExitedApp: state.root.hasExitedApp
    };

    return _state
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        doLogoutUser: () => dispatch(actLogoutUser()),
        doSetRootView: () => dispatch(actSetRootView()),
        doSetUserIsOnline: () => dispatch(actSetUserIsOnline())
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);