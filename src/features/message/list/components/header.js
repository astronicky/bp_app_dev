/*
 * Created by Justice on Wed Dec 02 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Text, View, Image } from 'react-native'
import { withTheme } from 'react-native-paper'

import { styles } from './style'
import newMsgIcon from 'app/assets/newMsgIcon.png'
import { TouchableOpacity } from 'react-native-gesture-handler';

class MessageHeaderComponent extends Component {
    render() {
        const { colors, fonts } = this.props.theme

        return (
            <View style={styles.headerCont}>
                <Text style={{ ...styles.headerTitle, color: colors.dark, fontFamily: fonts.bold }}>
                    Messages
                </Text>
                {/* <View style={styles.headerRightCont}>
                    <TouchableOpacity>
                        <Image source={newMsgIcon} style={styles.newMsgIcon} />
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const _state = {

    };

    return _state;
};

const mapDispatchToProps = (dispatch) => {
    const _action = {
        dispatch,
    }

    return _action;
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MessageHeaderComponent))
