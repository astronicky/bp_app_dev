/*
 * Created by Justice on Fri Nov 06 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Colors } from 'react-native-paper'
import { withTheme } from 'react-native-paper'

export class PageLoader extends Component {
    render() {
        const { colors } = this.props.theme
        const type = this.props.type ?? 'small'
        const size = type == 'small' ? 20 : 40
        const margin = this.props.margin ?? size
        const marginTop = this.props.marginTop ?? size
        const color = this.props.color ?? colors.secondary

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: margin, marginTop: marginTop }}>
                <ActivityIndicator animating={true} color={color} size={size} />
            </View>
        )
    }
}

export default withTheme(PageLoader)
