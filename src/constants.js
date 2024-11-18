// constants.js

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'No Set Day'];
export const AUDIENCES = ['Children', 'Adults', 'Families', 'Everyone'];
export const COSTS = ['Free', 'Low Cost', 'Other'];

export const MAX_DISTANCE = 10000; // 10 km in meters

// Regular expression to match UK postcodes
export const UK_POSTCODE_REGEX = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})\b/i;

// Latitude regex constant for London's range (51.2 to 51.7)
export const LONDON_LATITUDE_REGEX = /^51\.[2-6]\d*$/;

// Longitude regex constant for London's range (-0.5 to 0.3)
export const LONDON_LONGITUDE_REGEX = /^-0\.[1-5]\d*$|^0\.[0-3]\d*$/;

// likely email address
export const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

// likely phone number
export const PHONE_REGEX = /(?:\+?\(?\d{1,4}\)?[\s.-]?)+\d{1,}(?=\s|$)/g;

