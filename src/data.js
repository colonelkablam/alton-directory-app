// data.js
import { UK_POSTCODE_REGEX, EMAIL_REGEX, PHONE_REGEX } from './constants.js';
import { GSHEET_API_KEY, SHEET_ID, SHEET_NAME } from "./config.js";
import { isValidLondonCoordinate, fetchCoordinatesFromPostcode } from './navUtils.js';

export async function fetchActivities() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${GSHEET_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Define arrays for weekdays and the full week
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const other = ["No Set Day"];

    // start processing data from gsheet

    //top two lines are not data
    const activitiesData = data.values.slice(2).filter(row => row[0]); // Remove empty rows

    // Step 1: Gather postcodes that need geolocation data and make new set with postcodes added as an element
    const activitiesWithPostcodes = await Promise.all(
      activitiesData.map(async (row, index) => {
        const venue = row[5] || "";
        const postcodeMatch = venue.match(UK_POSTCODE_REGEX);
        const postcode = postcodeMatch ? postcodeMatch[0].toUpperCase() : null;
    
        let lat = null;
        let long = null;
    
        // If valid coordinates are provided in the spreadsheet, use them
        if (isValidLondonCoordinate(row[6], row[7])) {
          lat = parseFloat(row[6]);
          long = parseFloat(row[7]);
        } 
        // Otherwise, try fetching coordinates using the postcode
        else if (postcode) {
          const coords = await fetchCoordinatesFromPostcode(postcode); // Use the existing function
          if (coords) {
            lat = coords.lat;
            long = coords.long;
          } else {
            console.warn(`Failed to resolve coordinates for postcode: ${postcode}`);
          }
        }
    
        return { row, index, lat, long, postcode };
      })
    );
    

    // Step 2: Map the final activity data
    const activities = activitiesWithPostcodes.map(({ row, index, lat, long, postcode }) => {
      
      let daysOfWeek;
      const daysString = row[16] || '';

      if (daysString === "Monday-Friday") {
        daysOfWeek = weekdays;
      } else if (daysString === "All Week") {
        daysOfWeek = allDays;
      } else if (daysString === "Other") {
        daysOfWeek = other;
      } else {
        daysOfWeek = daysString.split(',').map(day => day.trim());
      }

      const extraAudienceInfo = row[3] || 'n/a';
      const extraDatesInfo = row[17] || 'n/a';
      const booking = row[10] || 'no booking info given';
      const dropIn = row[11] || 'no drop in details given';
      const doesItCost = row[12] || 'no details given';
      const rawContactDetails = row[13] || 'No contact details provided';

      // Extract emails and phone numbers safely
      const emails = Array.isArray(rawContactDetails.match(EMAIL_REGEX))
        ? rawContactDetails.match(EMAIL_REGEX)
        : []; // Ensure it's always an array
      const phones = Array.isArray(rawContactDetails.match(PHONE_REGEX))
        ? rawContactDetails.match(PHONE_REGEX)
        : []; // Ensure it's always an array

      // Combine the full string and extracted data into an array
      const contactArray = [
        rawContactDetails.trim(), // Full original string
        ...emails.filter(Boolean).map(email => email.trim()), // Filter out invalid values, then trim
        ...phones.filter(Boolean).map(phone => phone.trim()) // Filter out invalid values, then trim
      ];

      return {
        id: index, // Generate a unique id for each activity - currently just using index as this has to be unique
        name: row[0],
        description: row[1],
        audience: row[2],
        audienceOther: extraAudienceInfo,
        ageRange: row[4],
        venue: row[5],
        daysOfWeek,
        time: row[8],
        timePeriod: row[14],
        oneOffDate: row[15],
        datesDetails: row[16],
        extraDatesDetails: extraDatesInfo,
        organiser: row[9],
        cost: doesItCost,
        bookingRequired: booking,
        dropInAllowed: dropIn,
        contacts: contactArray,
        fisLink: row[18],
        long,
        lat,
        postcode,
        distance: null
      };
    })

    //console.log(activities);

    return activities;

  } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      return [];
  }
}