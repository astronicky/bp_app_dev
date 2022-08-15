/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Calls an API fnx 
 * @param {String} path - path declared in constants
 * @param {String} method
 * @param {Object} params 
 */
export default async function ApiRequest(path, method, params, timeout) {
    
    const token = await AsyncStorage.getItem('userToken');

    let head = { 'Accept': 'application/json', 'Content-Type': 'application/json' };

    // additional parameters like grant_type, client_id or client_secret
    let body = { }

    if (token) {
        head = { ...head, 'Authorization': 'Bearer ' + token };
    } 

    if (params) {
        body = { ...body, ...params };
    }
    
    let options = {
        headers: head, method,
        ...(params && { body: JSON.stringify(body) })
    };

    if (timeout != undefined) {
        const controller = new AbortController();
        const { signal } = controller;
        options = { ...options, signal };
        // wait for nth timeout to abort
        setTimeout(() => controller.abort(), timeout);
    }

    return fetch(Config.APP_BASE_URL + path, options).then(response => {
        // DELETE does not return items that has been deleted. 
        // it only returns a successful confirmation
        if (response.status >= 200 && response.status < 500 && method != 'DELETE') {
            return response.json();
        }

        return response;
    });
}