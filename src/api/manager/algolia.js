/*
 * Created by Justice on Thu Jul 15 2021
 *
 * Copyright (c) 2020. All rights reserved.
*/

import Config from 'react-native-config';

/**
 * Call to Embedly API to get url preview
 * @param {String} url - get og data from this url
 */
export default async function AlgoliaRequest(params) {

    const api_key = Config.APP_ALGOLIA_API_KEY;
    const app_key = Config.APP_ALGOLIA_APP_KEY;
    const url_key = (Config.APP_ALGOLIA_APP_KEY ?? '').toLowerCase();

    const baseUrl = `https://${url_key}-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%20(lite)&x-algolia-api-key=${api_key}&x-algolia-application-id=${app_key}`; 

    let head = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    let body = {};

    if (params) {
        body = { ...body, ...params };
    }
    
    const options = {
        headers: head, method: 'POST',
        ...(params && { body: JSON.stringify(body) })
    };
    
    return fetch(baseUrl, options).then(response => {
        // DELETE does not return items that has been deleted. 
        // it only returns a successful confirmation
        if (response.status >= 200 && response.status < 500) {
            return response.json();
        }

        return response;
    });
}