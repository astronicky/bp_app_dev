/*
 * Created by Justice on Mon Nov 16 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#F5F5F5'
    },
    loaderCont: {
        height: Dimensions.get('window').height * 0.7,
        justifyContent: 'center'
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 80,
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: 15,
    },
    personInfoCont: {
        width: '55%',
        paddingLeft: 10, paddingRight: 10
    },
    nicktxt: {
        fontSize: 17,
        fontWeight: '600',
    },
    nametxt: {
        marginTop: 3,
        fontSize: 13
    },
    verifiedIcon: {
        width: 15, height: 18, marginTop: 2, marginLeft: 5, resizeMode: 'stretch'
    },
    nameCont: {
        flexDirection: 'row' 
    },
    actionCont: {
        flexDirection: 'row', width: '26%'
    },
    verdictButton: {
        width: 45, height: 32, marginRight: 8, marginTop: 5
      },
})