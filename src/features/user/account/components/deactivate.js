/*
 * Created by Justice on Mon Feb 20 2021
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { IconButton, withTheme } from 'react-native-paper'
import { styles } from './style'

export class DeactivateSettings extends Component {

    render() {
        const placeholders = this.props.placeholders

        return (
            <React.Fragment>
                {placeholders &&
                    this.renderMessage()
                }
            </React.Fragment>

        )
    }

    renderMessage = () => {
        const { placeholders } = this.props
        const { fonts, colors } = this.props.theme

        return (
            <View>
                <View style={styles.separator} />
                <Text style={{ ...styles.menuTitle, fontFamily: fonts.semiBold }}>
                    Deactivate Account
                </Text>
                <View style={styles.halfSeparator} />
                <View style={styles.settingContainer}>
                    <View style={styles.settingLeftCont}>
                        <Text style={{ ...styles.settingTitle, color: colors.dark, fontFamily: fonts.regular  }}>
                            {placeholders.deactivateTitle}
                        </Text>
                        <Text style={{ ...styles.settingCaption, color: colors.gray, fontFamily: fonts.regular  }}>
                            {placeholders.deactivateCaption}
                        </Text>
                    </View>
                    <View style={styles.settingRightCont}>
                        <IconButton icon="delete" size={30} color={colors.danger} onPress={this.tapDeleteAccount} />
                    </View>
                </View>
            </View>
        )
    }

    tapDeleteAccount = () => {
        this.props.navigation.navigate('DeactivateConfirmComponent')
    }
}

const mapStateToProps = (state) => {

    const _state = {
        placeholders: state.account.placeholders,
        settings: state.account.notifications
    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
        
    };

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(DeactivateSettings))