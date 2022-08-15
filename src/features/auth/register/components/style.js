/*
 * Created by Justice on Wed Nov 25 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        paddingTop: 20
    },
    logo: {
        width: 50, height: 40, resizeMode: 'stretch'
    },
    titleLine: {
        marginTop: 15, fontSize: 24, marginBottom: 15
    },
    subTitleLine: {
        margin: 0, fontSize: 24,
        textDecorationLine: 'underline',
    },
    backBtn: {
        position: 'absolute', margin: 10, marginTop: 5, height: 55, width: 55 
    },  
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    txtbox_container : {
        margin: 20,
        marginBottom: 5,
        marginTop: 5,
        maxWidth: '100%'
    },
    topSeparator: {
        marginTop: 70,
        alignItems: 'center'
    },
    topFieldSeparator: {
        marginTop: 30,
        alignItems: 'center'
    },
    caption: {
        fontSize: 13,
        marginBottom: 5,
    },
    boldCaption: {
        fontSize: 17,
        marginBottom: 5
    },  
    smallSeparator: {
        marginTop: 30
    },  
    centerText: {
        textAlign: 'center',
    },
    txtbox: {
        paddingRight: 2, marginTop: 5, marginBottom: 5,
        fontSize: 16, height: 45, 
        maxWidth: '100%',
        width: '60%',
        borderStyle: "solid",
        borderWidth: 0.6, 
        padding: 12, borderRadius: 10, 
        backgroundColor: 'white',
    },
    smallTxtbox: {
        paddingRight: 2, marginTop: 5, marginBottom: 5,
        fontSize: 16, height: 45, 
        width: '40%',
        borderStyle: "solid",
        borderWidth: 0.6, 
        padding: 12, borderRadius: 10, 
        backgroundColor: 'white',
    },
    bigTxtbox: {
        paddingRight: 2, marginTop: 5, marginBottom: 5,
        fontSize: 16, height: 45, 
        maxWidth: '100%',
        width: '80%',
        borderStyle: "solid",
        borderWidth: 0.6, 
        padding: 12, borderRadius: 10, 
        backgroundColor: 'white',
    },
    halfTxtbox: {
        paddingRight: 2, 
        marginTop: 5, marginBottom: 5,
        marginRight: 15,
        fontSize: 16, height: 45, 
        maxWidth: '100%',
        width: '48%',
        borderStyle: "solid",
        borderWidth: 0.6, 
        padding: 12, borderRadius: 10, 
        backgroundColor: 'white',
    },
    halfTxtCont: {
        flexDirection: 'row' 
    },
    agreementCont: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    agreementCaption: {
        fontSize: 11
    },
    signupButtonCont: {
        justifyContent: 'center', alignItems: 'center'
    },  
    signupButton: {
        width: '90%', height: 43, borderRadius: 8, marginBottom: 15, marginTop: 5,
        alignItems: 'center', justifyContent: 'center'
    },
    signupButtonText: {
        alignItems: 'center', justifyContent: 'center'
    },
    signupText: {
        color: 'white',
        fontSize: 18, 
    },
    otherActionCont: {
        flexDirection: 'row', justifyContent: 'center', marginTop: 30
    },
    otherAction: {
        marginRight: 8, marginLeft: 8
    },
    otherActionText: {
        fontSize: 12,
    },
    otherActionTextUnderline: {
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    userListCont: {
        marginLeft: '5%', marginRight: '5%', flexDirection: 'row'
    },
    userCard: {
        height: 60, width: '45%', margin: 10, borderRadius: 8
    },
    userCardCont: {
        padding: 10, flexDirection: 'row'
    },
    userPic: {
        width: 32, height: 32, justifyContent: 'center', borderRadius: 16
    },
    userPicIcon: {
        width: 15, height: 15, position: 'absolute', marginLeft: 21, borderRadius: 8, borderColor: 'white', borderWidth: 1
    },
    userDetailCont: {
        flexDirection: 'column'
    },
    userTitle: {
        fontSize: 13, maxWidth: '80%', marginLeft: 10, marginRight: 10, alignItems: 'center'
    },
    userSubTitle: {
        fontSize: 12, maxWidth: '80%', margin: 10, marginTop: 5, alignItems: 'center'
    },
    userListFooter: {
        flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: '5%'
    }
});