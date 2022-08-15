/*
 * Created by Justice on Wed Jun 30 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import React, { Component } from 'react'

import { Divider, Card, withTheme } from 'react-native-paper'
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { styles } from './style'

class PostItemLoaderComponent extends Component {
    render() {
        const { colors } = this.props.theme
        return (
            <Card style={styles.postCont}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item flexDirection="row" margin={10} marginTop={20}>
                        <SkeletonPlaceholder.Item width={35} height={35} borderRadius={18} />
                        <SkeletonPlaceholder.Item marginLeft={10}>
                            <SkeletonPlaceholder.Item width={150} height={10} borderRadius={4} marginTop={5} />
                            <SkeletonPlaceholder.Item marginTop={5} width={200} height={10} borderRadius={4} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item margin={10} marginTop={5}>
                        <SkeletonPlaceholder.Item height={10} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={8} height={10} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={8} height={10} borderRadius={4} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item margin={10} marginTop={5}>
                        <SkeletonPlaceholder.Item height={200} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={10} height={10} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={10} width={200} height={10} borderRadius={4} />
                    </SkeletonPlaceholder.Item>
                    <Divider />
                    <SkeletonPlaceholder.Item flexDirection="row" margin={10}>
                        <SkeletonPlaceholder.Item width={35} height={35} borderRadius={18} />
                        <SkeletonPlaceholder.Item marginLeft={10} width={'87%'}>
                            <SkeletonPlaceholder.Item height={35} borderRadius={4} borderRadius={8} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </Card>
        )
    }
}

export default withTheme(PostItemLoaderComponent);