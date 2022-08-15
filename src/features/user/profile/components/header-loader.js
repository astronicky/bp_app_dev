/*
 * Created by Justice on Wed Jun 30 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'

import { Divider, Card, withTheme } from 'react-native-paper'
import { View } from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { styles } from './style'

class HeaderLoaderComponent extends Component {
    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width="100%" height={150} />
                    <SkeletonPlaceholder.Item flexDirection="row">
                        <SkeletonPlaceholder.Item
                            width={100}
                            height={100}
                            borderRadius={100}
                            borderWidth={10}
                            borderColor="white"
                            alignSelf="flex-start"
                            position="relative"
                            top={-30}
                            marginLeft={15}
                        />
                        <SkeletonPlaceholder.Item marginLeft={20} marginTop={10}>
                            <SkeletonPlaceholder.Item width={100} height={15} />
                            <SkeletonPlaceholder.Item width={150} marginTop={10} height={15} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item flexDirection="row" marginLeft={15} marginTop={0} marginBottom={20}>
                        <SkeletonPlaceholder.Item width={100} height={25} />
                        <SkeletonPlaceholder.Item width={100} marginLeft={15} height={25} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        )
    }
}

export default withTheme(HeaderLoaderComponent);