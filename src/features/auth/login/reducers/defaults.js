/*
 * Created by Justice on Wed Mar 10 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import Config from 'react-native-config';

export const browserDefaults = {
    browserProps: {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#006A7C',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: false,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: '#006A7C',
        secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
        }
    },
    forgotPassLink: `${Config.APP_FORGOT_PASS_URL}`,
    isDev: Config.APP_BASE_URL.includes('-dev')
}