/*
 * Created by Justice on Sat Nov 21 2020
 *
 * Copyright (c) 2020. All rights reserved.
*/

import Config from 'react-native-config';

/**
 * Call to Google Maps API to get address lookup
 * @param {Number} lat - latitude
 * @param {Number} lng - longitude
 */
export default async function ReverseGeocodingRequest(lat, lng) {

    const key = Config.APP_GEOCODE_KEY;

    const baseUrl = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${lat},${lng}&includeRoadMetadata=true&includeNearestIntersection=true`; 

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