/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '35%'
    },
    logo: {
        width: 80, height: 65, resizeMode: 'stretch'
    },
    titleLine1: {
        marginTop: 40, fontSize: 28,
    },
    titleLine2: {
        fontSize: 28
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    login_txtbox_container : {
        margin : 40,
        width: '80%'
    },
    txtbox: {
        paddingRight: 2, marginTop: 5, marginBottom: 5,
        fontSize: 16, height: 45, 
        borderStyle: "solid",
        borderWidth: 0.6, 
        padding: 12, borderRadius: 10, 
        backgroundColor: 'white',
    },
    loading: {
        marginTop: 30
    }, 
    loginActionCont: {
        marginTop: 15, alignItems: "center"
    },
    loginButtonText: {
        alignItems: 'center', justifyContent: 'center'
    },
    loginButton: {
        width: 150, height: 43, borderRadius: 8, 
        alignItems: 'center', justifyContent: 'center'
    },
    loginText: {
        color: 'white',
        fontSize: 18, 
    },
    otherActionCont: {
        flexDirection: 'row', justifyContent: 'center', marginTop: 20
    },
    otherAction: {
        marginRight: 8, marginLeft: 8
    },
    otherActionText: {
        fontSize: 13
    }
});