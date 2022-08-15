/*
 * Created by Justice on Mon Nov 16 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import _ from 'lodash';
import { IconButton } from 'react-native-paper';
import { View, Text } from 'react-native';

export default class EmptySetView extends Component {

    constructor(props) {
        super(props); this.state = {};
    }

    render() {
        const { title, subtitle } = this.props;
        const icon = this.props.icon ?? 'account-group';
        const size = this.props.size == 'small' ? 200 : 400

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: size }}>
                {_.isEmpty(icon) == false &&
                    <View style={{ marginBottom: 15 }}>
                        <IconButton icon={icon} color="gray" size={40} />
                    </View>
                }
                <Text style={{ fontSize: 20, color: 'gray' }}>
                    {title}
                </Text>
                {subtitle != undefined &&
                    <Text style={{ fontSize: 15, color: 'gray', marginTop: 10, textAlign: 'center' }}>
                        {subtitle}
                    </Text>
                }
            </View>
        );
    }
}
