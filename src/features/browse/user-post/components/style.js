/*
 * Created by Justice on Mon Jun 21 2021
 *
 * Copyright (c) 2021. All rights reserved.
*/

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    adContainer: {
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    searchCont: {
       marginTop: 10, height: 70, flexDirection: 'row'
    },
    searchIcon: {
        width: 40, height: 40
    },
    searchText: {
        flex: 1, marginLeft: 15, marginRight: 15, marginTop: 5
    },
    tabCont: {
        width: '100%', height: 48, flexDirection: 'row', padding: 0, backgroundColor: 'white'
    },
    tabBtnItem: {
        width: 120, height: 48, alignItems: 'center', marginLeft: 5, marginRight: 5
    },
    tabTextItem: {
        fontSize: 15, height: 30, marginTop: 13
    },
    tabLine: {
        height: 3, width: '100%', marginTop: 2
    },
    titleHeader: {
        margin: 12, marginTop: 0, fontSize: 15
    },
    userHeader: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10
    },
    postHeader: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 0
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginTop: 5,
    },
    avatarThumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        marginTop: 5,
    },
    nameCont: {
        flexDirection: 'row' 
    },
    personInfoCont: {
        paddingLeft: 10, paddingRight: 10
    },
    verifiedIcon: {
        width: 15, height: 18, marginTop: 2, marginLeft: 5, resizeMode: 'stretch'
    },
    nametxt: {
        marginTop: 3,
        fontSize: 13
    },
    usernametxt: {
        fontSize: 13,
        marginLeft: 10
    },
    linkedImageCont: {
        width: 60, height: 60, marginRight: 5
    },
    linkedTextCont: {
        width: 60, height: 60, marginRight: 5
    },
    linkedImage: {
        width: 60, height: 60, borderRadius: 5
    },
    postCont: {
        margin: 10, marginTop: 0, flexDirection: 'row'
    }
})