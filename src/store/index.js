/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';

import thunk from 'redux-thunk';
import reducers from '../reducers';

const composeEnhancers = composeWithDevTools({ realtime: true });

/** Collect all reducers combined */
export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));