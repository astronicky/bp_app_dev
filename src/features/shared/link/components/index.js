/*
 * Created by Justice on Tue Nov 17 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { Text, Linking, Alert } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { withTheme } from 'react-native-paper'

export class Link extends Component {

    render() {
        const { colors, fonts } = this.props.theme
        const style = this.props.style ?? { color: colors.secondary, fontFamily: fonts.regular, fontSize: 15 }

        return (
            <Text onPress={this.openUrl.bind(this, this.props.url)} style={style}>
                {this.props.children}
            </Text>
        )
    }

    openUrl = async (url) => {
        const { browserProps } = this.props

        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, browserProps)
            } else {
                Linking.openURL(url)
            }
        } catch (error) {
            Alert.alert(error.message)
        }
    }
}

export default withTheme(Link)
