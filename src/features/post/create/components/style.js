/*
 * Created by Justice on Thu Nov 05 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    postCont: {
        width: '95%',
        minHeight: 150,
        backgroundColor: 'white',
        marginVertical: 5,
        borderRadius: 10,
        marginHorizontal: 10,
        flexDirection: 'row'
    },
    // container: {
    //     backgroundColor: 'white'
    // },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: 'white'
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
    send: {
        width: 30,
        height: 30,
        marginBottom: 15,
    },
    inputCont: {
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        paddingHorizontal: 15,
        marginBottom: 10, marginTop: 15,
        flexDirection: 'column'
    },
    input: {
        width: 320,
        borderRadius: 15,
        paddingHorizontal: 10,
    },
    postButton: {
        width: 120, marginTop: 10, marginRight: 10, borderRadius: 5
    },
    postTitleLabel: {
        fontWeight: 'bold', flexDirection: 'row', marginTop: 12
    },
    postLeftRowCont: {
        flex: 2, flexDirection: 'row'
    },
    postRightRowCont: {
        flex: 1, alignItems: 'flex-end'
    },
    postButtonCont: {
        flexDirection: 'row', flex: 1, marginLeft: 5
    },
    postTitleCont: {
        flexDirection: 'row', flex: 1, marginLeft: 15, marginRight: 8, marginTop: 5
    },
    postInsertBtnCont: {
        flexDirection: 'row'
    },
    previewBox: {
        marginLeft: 10, marginRight: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 3
    },
    previewHeader: {
        flexDirection: 'row',
        marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 0
    },
    previewHeaderLabel: {
        marginLeft: 8
    },
    previewContent: {
        height: 250,
        marginTop: 10, marginBottom: 10
    },
    previewLabel: {
        marginLeft: 10, marginRight: 10, marginBottom: 10
    },
    postImg: {
        marginHorizontal: 7,
        height: 300,
        borderRadius: 5,
        resizeMode: 'stretch',
        marginTop: 15,
        marginLeft: 10, marginRight: 10,
    },
    previewFavIcon: {
        height: 18, width: 18
    },
    removeMediaIcon: {
        position: 'absolute', alignItems: 'flex-end',
        width: '100%', height: 30, paddingRight: 0
    },
    removePreviewIcon: {
        position: 'absolute', alignItems: 'flex-end',
        width: '100%', height: 30, paddingRight: 10
    }
})