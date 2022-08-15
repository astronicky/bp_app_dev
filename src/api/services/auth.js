/*
 * Created by Justice on Fri Oct 30 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import AsyncStorage from '@react-native-community/async-storage';

import ApiRequest from './../manager';

import { Constants } from './../manager/constant';

/**
 * Login an account
 * @param {String} username 
 * @param {String} password 
 */
export async function loginAccount(username, password) {

   const payload = { username, password, platform: 'ios' };
   const response = await ApiRequest(Constants.USER_LOGIN_URL, 'POST', payload);
   
   // Override: store the token
   if (response && response.token && response.user) {
      const userInfo = JSON.stringify(response.user);
      AsyncStorage.multiSet([
         ['userToken', response.token], ['userInfo', userInfo]
      ]);
   }

   return response;
}

/**
 * Login broadcast
 * @param {String} socket_id 
 * @param {String} channel_name 
 * @param {String} user_id 
 */
export async function loginBroadcast(socket_id, channel_name, user_id) {

   const payload = { socket_id, channel_name, id: user_id };
   return await ApiRequest(Constants.BROADCAST_AUTH, 'POST', payload);
}

/**
 * Logout the current user and clear all existing session
 */
export async function logoutAccount() {

    const payload = { platform: 'ios' };
    await ApiRequest(Constants.USER_LOGOUT_URL, 'POST', payload);

    const keys = [
       'userToken', 'userInfo'
    ];
 
    AsyncStorage.multiRemove(keys);
 }
 