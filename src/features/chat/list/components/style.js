/*
 * Created by Justice on Wed Jan 27 2021
 *
 * Copyright (c) 2021. All rights reserved.
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
    cardInfoCont: {
        width: '100%',
        height: 250,
        backgroundColor: 'red'
    },
    cardCont: {
        marginBottom: 10, height: 50, justifyContent: 'center'
    },
    cardTouchCont: {
        flexDirection: 'row'
    },
    cardFirstRow: {
        width: '10%', height: 50, justifyContent: 'center', alignItems: 'center'
    },
    cardSecondRow: {
        width: '78%', marginRight: '2%', overflow: 'hidden', height: 50, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'
    },
    cardThirdRow: {
        width: '10%', height: 50, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center'
    },
    cardInfoFirstRow: {
        width: 50, height: 50, justifyContent: 'center', alignItems: 'center'
    },
    cardInfoSecondRow: {
        flex: 1, height: 50, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'
    },
    cardInfoThirdRow: {
        width: 120, height: 50, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', marginLeft: 5
    },
    cardInfoRow: {
        width: '85%', padding: 10
    },
    cardActionRow: {
        width: '15%', marginTop: 10, paddingRight: 5
    },
    cardActionRowButton: {
        flexDirection: 'row', height: 40, padding: 10, paddingLeft: 0
    },
    cardButtonCont: {
        flexDirection: 'row'
    },
    commentIcon: {
        width: 20, height: 20, margin: 10
    },
    roomTitle: {
        fontSize: 20
    },
    roomSubtitle: {
        fontSize: 14
    },
    countTitle: {
        fontSize: 16, height: 25, marginRight: 10
    },
    groupIcon: {
        width: 20, height: 20, resizeMode: 'contain', marginLeft: 10, marginRight: 10
    },
    detailIcon: {
        width: 30, height: 30, resizeMode: 'contain', marginRight: 10
    },
    loaderCont: {
        height: Dimensions.get('window').height * 0.7,
        justifyContent: 'center'
    },
    checkboxView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        flex: 1,
    },
    infoCont: {
        backgroundColor: '#ffffff'
    },
    infoUserCont: {
        flexDirection: 'row', margin: 20
    },
    infoActionCont: {
        flexDirection: 'row', justifyContent: 'center'
    },
    infoButtonCont: {
        flexDirection: 'row', margin: 20, width: '100%', height: 100, flexWrap: 'wrap', justifyContent: 'center'
    },
    infoActionButton: {
        margin: 10, marginLeft: 0, marginTop: 0, height: 35,
    },
    infoUserInfoColumn: {
        flex: 2, flexDirection: 'column'
    },
    infoUserPicColumn: {
        flex: 1, alignItems: 'flex-end', flexDirection: 'column'
    },
    infoTitle: {
        fontSize: 20, marginBottom: 5
    },
    infoSubtitle: {
        fontSize: 14
    },
    infoProfileButton: {
        marginTop: 20,
    },
    infoPic: {
        width: 100, height: 100, borderRadius: 50
    },
    mutedUserCont: {
        marginBottom: 10, height: 80, flexDirection: 'row'
    },
    mutedPicCont: {
        width: 80, alignItems: 'center', justifyContent: 'center'
    },
    mutedInfoCont: {
        flex: 3, justifyContent: 'center', paddingLeft: 10
    },
    mutedActionCont: {
        flex: 1, justifyContent: 'center', alignItems: 'flex-end'
    },
    mutedActionButton: {
        marginRight: 20
    },
    mutedPic: {
        width: 60, height: 60, borderRadius: 30
    },
    avatarFront: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'white', zIndex: 5
    },
    avatarBack: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'white', position: 'absolute'
    },
    sendButton: {
        width: 80, height: 35, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 5
    },
    sendButtonTitle: {
        color: 'white', fontSize: 16
    },
    verifiedIcon: {
        width: 15, height: 18, marginTop: 5, marginLeft: 5, resizeMode: 'stretch'
    },
})