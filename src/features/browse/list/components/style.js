/*
 * Created by Justice on Tue Dec 01 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#F5F5F5'
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    adContainer: {
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterContainer: {
        backgroundColor: 'white', marginBottom: 10
    },
    headerCont1: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 20, marginBottom: 10
    },
    headerCont2: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10
    },
    headerCont3: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 0, marginBottom: 20, marginTop: 10
    },
    headerFilterCont: {
        width: '100%', height: 100, flexDirection: 'row'
    },
    filterBtn: {
        borderWidth: 1, borderRadius: 5, width: 100, height: 35, borderStyle: 'solid', alignItems: 'center', justifyContent: 'center'
    },
    bigBtnText: {
        fontSize: 16,
    },
    smallBtnText: {
        fontSize: 14,
    },
    applyBtnText: {
        color: 'white', fontSize: 16,
    },
    filterRow: {
        width: '50%', justifyContent: 'center', alignItems: 'center'
    },
    legendLabel1: {
        fontSize: 16, margin: 15, width: '60%'
    },
    legendLabel2: {
        fontSize: 16, margin: 10, width: '60%'
    },
    valueLabel: {
        marginLeft: 10, fontSize: 16, paddingTop: 5
    },
    flexRow: {
        flexDirection: 'row'
    },
    valueRow: {
        fontSize: 16, padding: 15, paddingTop: 5, width: '80%'
    },
    dropdownCont: {
        borderWidth: 0.5, borderRadius: 5, width: '70%', height: 35, borderStyle: 'solid', alignItems: 'center', flexDirection: 'row'
    },
    dropdownRow: {
        width: '80%', height: 35,
    },
    dropdown: {
        padding: 10
    },
    chevronRow: {
        width: '20%', height: 35, justifyContent: 'center', alignItems: 'center', marginRight: 2
    },
    chevron: {
        width: 12, height: 8
    },
    applyBtn: {
        width: 100, height: 35, borderRadius: 5, alignItems: 'center', justifyContent: 'center'
    },
    resetBtn: {
        width: 100, height: 35, alignItems: 'center', justifyContent: 'center'
    },

    postHeader: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: 90,
        alignItems: 'center',
    },
    avatarCont: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
    },
    onlineCont: {
        width: 60, height: 60,
        position: 'absolute',
        alignItems: 'flex-end', justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },
    onlineIcon: {
        width: 10, height: 10, borderRadius: 5, marginBottom: 4, marginRight: 4,
        borderColor: 'white', borderStyle: 'solid', borderWidth: 1.5
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    personInfoCont: {
        width: '76%',
        paddingLeft: 10, paddingRight: 10
    },
    moreIconCont: {
        width: 35, height: '100%', justifyContent: 'center', alignItems: 'center'
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
    followBtn: {
        width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: 'transparent', borderWidth: 0.3,
    },
    loaderCont: {
        height: 250,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    searchToolbar: {
        padding: 20, paddingBottom: 0, height: 65
    },
    searchText: {
        fontSize: 18, margin: 10, marginLeft: 5
    }
})