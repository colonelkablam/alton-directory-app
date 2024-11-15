// navUtils.js
import { LONDON_LATITUDE_REGEX, LONDON_LONGITUDE_REGEX } from './constants.js';

// Function to get the user's current location
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.warn("Geolocation not supported by this browser.");
        }
    });
}

// Function to calculate the distance between two coordinates
export function calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        console.warn("Invalid coordinates for distance calculation");
        return null; // Return null if any coordinates are missing
    }

    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export function isValidLondonCoordinate(lat, long) {
    const isValidLatitude = LONDON_LATITUDE_REGEX.test(lat);
    const isValidLongditude = LONDON_LONGITUDE_REGEX.test(long);
    
    return isValidLatitude && isValidLongditude;
}

export async function fetchCoordinatesFromPostcode(postcode) {
    const cleanedPostcode = postcode.replace(/\s/g, ''); // Remove spaces
    const url = `https://api.postcodes.io/postcodes/${cleanedPostcode}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 200 && data.result) {
            return {
                lat: data.result.latitude,
                long: data.result.longitude,
            };
        } else if (data.status === 404) {
            console.warn(`Postcode not found: ${postcode}`);
        } else {
            console.error(`Unexpected API response: ${data}`);
        }

        return null;
    } catch (error) {
        console.error(`Error fetching coordinates for postcode ${postcode}:`, error);
        return null;
    }
}


