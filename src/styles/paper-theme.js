/*
 * Created by Justice on Sat Oct 31 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { DefaultTheme } from 'react-native-paper';

// Provide a custom theme for react-native-paper
export const theme = {
    ...DefaultTheme, roundness: 2,
    colors: {
        ...DefaultTheme.colors, 
        primary: '#4AE3A8', 
        secondary: '#006A7C', 
        background: '#F5F5F5',
        bubble: '#F4F2F2',
        neutral: '#BDD1D3',
        dark: '#00282F',
        light: '#F0F0F0',
        bonus: '#3FA3EF',
        gray: '#B1B1B1',
        darkGray: '#707070',
        black: '#252525',
        white: '#FAFAFA',
        danger: '#FC6969',
        warning: '#F4AE5E',
        success: '#4AE3A8',
    },
    fonts: {
        regular: 'OpenSans-Regular',
        semiBold: 'OpenSans-SemiBold',
        light: 'OpenSans-Light',
        bold: 'OpenSans-Bold'
    }
};