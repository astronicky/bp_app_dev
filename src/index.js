/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './store';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './styles/paper-theme';

import AppNavigation from './navigation/index';

export default class BPApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppNavigation />
        </PaperProvider>
      </Provider>
    );
  }
}
