/*
 * Created by Justice on Fri Nov 06 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import Config from 'react-native-config';

/**
 * Call to Embedly API to get url preview
 * @param {String} url - get og data from this url
 */
export default async function EmbedlyRequest(url) {

    const key = Config.APP_EMBEDLY_KEY;

    const baseUrl = `https://api.embed.ly/1/extract?url=${url}&key=${key}`; 

    let head = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    
    return fetch(baseUrl, { method: 'GET', headers: head }).then(response => {
        // DELETE does not return items that has been deleted. 
        // it only returns a successful confirmation
        if (response.status >= 200 && response.status < 500) {
            return response.json();
        }

        return response;
    });
}