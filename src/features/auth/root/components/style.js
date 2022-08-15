/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    loading: {
        marginTop: 30
    },
    activateContainer: {
        paddingTop: 20
    },
    titleLine: {
        marginTop: 15, fontSize: 24, marginBottom: 15
    },
    subTitleLine: {
        margin: 0, fontSize: 16
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20
    },
    logo: {
        width: 50, height: 40, resizeMode: 'stretch'
    },
    nextButtonCont: {
        justifyContent: 'center', alignItems: 'center'
    },  
    nextButton: {
        width: '90%', height: 43, borderRadius: 8, marginBottom: 15, marginTop: 5,
        alignItems: 'center', justifyContent: 'center'
    },
    nextButtonText: {
        alignItems: 'center', justifyContent: 'center'
    },
    nextText: {
        color: 'white',
        fontSize: 18, 
    },
});