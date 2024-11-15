// data.js
import { UK_POSTCODE_REGEX } from './constants.js';
import { isValidLondonCoordinate, fetchCoordinatesFromPostcode } from './navUtils.js';


const API_KEY = 'AIzaSyBdKlI9mxJJfv5xsuVFAK7ncjbES2A1kaI'; // Replace with your actual API key
const SHEET_ID = '1uUiZB1ArpX2KskYTXZ8sMphLWraAm4n_JQO57NXr6U0'; // Replace with your actual Sheet ID
const SHEET_NAME = 'Directory';


export async function fetchActivities() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Define arrays for weekdays and the full week
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const other = ["No Set Day"];
    const weekdaySpreadSheetRow = 16;

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
      const daysString = row[weekdaySpreadSheetRow] || '';

      if (daysString === "Monday-Friday") {
        daysOfWeek = weekdays;
      } else if (daysString === "All Week") {
        daysOfWeek = allDays;
      } else if (daysString === "Other") {
        daysOfWeek = other;
      } else {
        daysOfWeek = daysString.split(',').map(day => day.trim());
      }

      return {
        id: index, // Generate a unique id for each activity - currently just using index as this has to be unique
        name: row[0],
        description: row[1],
        audience: row[2],
        ageRange: row[4],
        venue: row[5],
        daysOfWeek,
        time: row[8],
        timePeriod: row[14],
        oneOffDate: row[15],
        datesDetails: row[16],
        organiser: row[9],
        cost: row[12],
        contact: row[13],
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