/*
 * Created by Justice on Sat Jan 9 2021
 *
 * Copyright (c) 2021. All rights reserved.
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
        flexDirection: 'row', alignItems: 'center'
    },
    picCont: {
        paddingLeft: 5, width: 40, height: 60, justifyContent: 'center', alignItems: 'center'
    },
    dataColumn: {
        flex: 1, flexDirection: 'column', marginLeft: 5, marginRight: 5
    },
    moreColumn: {
        width: 35, height: 60
    },
    moreIconCont: {
        width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-start'
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginTop: 5,
    },
    infoCont: {
        flexDirection: 'row',
    },
    dateLabel: {
        marginTop: 5, fontSize: 12,
    }
});