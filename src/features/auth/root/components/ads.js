/*
 * Created by Justice on Thu May 20 2021
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react'
import { Banner } from 'react-native-ad-manager'

export class MobileAdsComponent extends Component {
    render() {
        return (
            <Banner
                adSize="banner"
                adUnitID="/4052/bp/mobileapp"
                testDevices={undefined}
                onAdFailedToLoad={error => console.error(error)}
                onAppEvent={event => console.log(event.name, event.info)}
            />
        )
    }
}

export default MobileAdsComponent
