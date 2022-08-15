/*
 * Created by Justice on Wed Dec 02 2020
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
    headerCont: {
        flexDirection: 'row', margin: 20
    },
    cardCont: {
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 20, width: '80%'
    },
    headerRightCont: {
        width: '20%', flexDirection: 'row-reverse'
    },
    newMsgIcon: {
        width: 34, height: 34
    },
    nicktxt: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1
    },
    nametxt: {
        fontSize: 12,
        textAlign: 'right', 
        width: 100
    },
    msgtxt: {
        marginTop: 3,
        fontSize: 15,
        fontStyle: 'italic'
    },
    personInfoCont: {
        width: '78%',
        paddingLeft: 10, paddingRight: 10
    },
    nameCont: {
        flexDirection: 'row'
    },
    avatarCont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    onlineCont: {
        width: 40, height: 40,
        position: 'absolute',
        alignItems: 'flex-end', justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },
    onlineIcon: {
        width: 10, height: 10, borderRadius: 5, marginBottom: 1, marginRight: 1,
        borderColor: 'white', borderStyle: 'solid', borderWidth: 1.5
    },
    loaderCont: {
        height: Dimensions.get('window').height * 0.7,
        justifyContent: 'center'
    },
    sendButton: {
        width: 80, height: 35, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 5
    },
    sendButtonTitle: {
        color: 'white', fontSize: 16
    },
    verifiedIcon: {
        width: 13, height: 15, marginLeft: 0, resizeMode: 'stretch'
    }
})