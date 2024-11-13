// data.js

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

    // Process the data into the format you need
    const activities = data.values.slice(2)
        .filter(row => row[0]) // Only include rows where `name` (row[0]) is not empty
        .map((row) => {
            let daysOfWeek;
            if (row[weekdaySpreadSheetRow] === "Monday-Friday") {
              daysOfWeek = weekdays;
            } else if (row[weekdaySpreadSheetRow] === "All Week") {
              daysOfWeek = allDays;
            } else if (row[weekdaySpreadSheetRow] === "Other") {
              daysOfWeek = other;
            } else {
              daysOfWeek = row[weekdaySpreadSheetRow] ? row[weekdaySpreadSheetRow].split(',').map(day => day.trim()) : [];
            }
    
            return {
              name: row[0],
              description: row[1],
              audience: row[2],
              ageRange: row[4],
              venue: row[5],
              daysOfWeek: daysOfWeek, // Set the processed daysOfWeek array
              time: row[8],
              timePeriod: row[14],
              oneOffDate: row[15],
              datesDetails: row[16],
              organiser: row[9],
              cost: row[12],
              contact: row[13],
              fisLink: row[18]

            };
        });

        return activities;
        } catch (error) {
            console.error("Error fetching data from Google Sheets:", error);
            return [];
        }
    }

// // Data array - to be replaced with googlesheet backend
//   const activities = [
//     {
//       name: 'NEET support',
//       description: 'NEET support for young people not in education,employment or training',
//       audience: 'Children',
//       ageRange: '16-21',
//       venue: 'BASE Youth Club, 33-35 Danebury Avenue Roehampton SW15 4DQ',
//       time: 'Monday 1pm-3pm',
//       organiser: 'BASE',
//       cost: 'Free',
//       contact: '02088715222'
//     },
//     {
//       name: 'After school snacks',
//       description: 'After school snacks',
//       audience: 'Children',
//       ageRange: '8-18',
//       venue: 'BASE Youth Club, 33-35 Danebury Avenue Roehampton SW15 4DQ',
//       time: 'Monday 3.30pm- 4.30pm',
//       organiser: 'BASE',
//       cost: 'Free'
//     },
//     {
//       name: 'NEET support',
//       description: 'NEET support for young people not in education,employment or training',
//       audience: 'Children',
//       ageRange: '16-21',
//       venue: 'BASE Youth Club, 33-35 Danebury Avenue Roehampton SW15 4DQ',
//       time: 'Tuesday 1-3pm',
//       organiser: 'BASE',
//       cost: 'Free'
//     },
//     {
//       name: 'NEET support',
//       description: 'NEET support for young people not in education,employment or training',
//       audience: 'Children',
//       ageRange: '16-22',
//       venue: 'BASE Youth Club, 33-35 Danebury Avenue Roehampton SW15 4DQ',
//       time: 'Wednesday 1-3pm',
//       organiser: 'BASE',
//       cost: 'Free'
//     },
//     {
//       name: 'NEET support',
//       description: 'NEET support for young people not in education,employment or training',
//       audience: 'Children',
//       ageRange: '16-23',
//       venue: 'BASE Youth Club, 33-35 Danebury Avenue Roehampton SW15 4DQ',
//       time: 'Thursday 1-3pm',
//       organiser: 'BASE',
//       cost: 'Free'
//     },
//     {
//       name: 'NEET support',
//       description: 'NEET support for young people not in education,employment or training',
//       audience: 'Children',
//       ageRange: '16-24',
//       venue: 'BASE Youth Club, 33-35 Danebury Avenue Roehampton SW15 4DQ',
//       time: 'Friday 1-3pm',
//       organiser: 'BASE',
//       cost: 'Free'
//     },
//     {
//       name: 'Community Lunch',
//       description: 'Come along and join us for our free Brunch Cafe',
//       audience: 'Everyone',
//       venue: 'Chantelle\'s Community Kitchen',
//       time: 'Friday 11am -1pm',
//       organiser: 'Chantelle\'s Community Kitchen',
//       cost: 'Donations appreciated if you feel able',
//       contact: 'chantellescommunitykitchen@gmail.com @CCKRoehampton'
//     },
//     {
//       name: 'Walking Group with the Health Champions',
//       description: 'Make new friends and enjoy the beauty of Richmond Park',
//       audience: 'Everyone',
//       venue: 'Leaving from Manresa Clubroom, Fontley Way, SW15 4LY',
//       time: 'Monday 11am',
//       organiser: 'Estate Art',
//       cost: 'Free',
//       contact: 'estateartsw15@gmail.com'
//     },
//     {
//       name: 'Quiz Night',
//       description: 'Quiz night, £50 bar tab and bonus prizes to be won',
//       audience: 'Adults',
//       venue: 'Kings Head, 1 Roehampton High St, London SW15 4HL',
//       time: 'Wednesday from 7.30pm',
//       organiser: 'Kings Head',
//       cost: '£2.50'
//     },
//     {
//       name: 'Free cooked meal',
//       description: 'Enjoy a healthy cooked meal on us!',
//       audience: 'Everyone',
//       venue: 'Roehampton Methodist Church, Minstead Gardens, Roehampton SW15 4EB',
//       time: 'Saturday at 5pm',
//       organiser: 'Roehampton Methodist Church',
//       cost: 'Free'
//     },
//     {
//       name: 'Tai Chi',
//       description: 'Tai Chi sessions designed to promote relaxation and flexibility.',
//       audience: 'Adults',
//       venue: 'Barn Elms',
//       time: '11:30AM-12:30PM Monday',
//       organiser: 'Enable',
//       cost: '£4-5',
//       contact: 'active@enablelc.org'
//     },
//     {
//       name: 'Yoga',
//       description: 'Yoga classes focusing on mindfulness and physical well-being.',
//       audience: 'Adults',
//       venue: 'Newlands Hall',
//       time: '9:30AM-10:30AM Thursday',
//       organiser: 'Enable',
//       cost: '£4-5',
//       contact: 'active@enablelc.org'
//     },
//     {
//       name: 'Stretch & Movement',
//       description: 'Stretch and Movement classes aimed at improving mobility and reducing stiffness.',
//       audience: 'Adults',
//       venue: 'Newlands Hall',
//       time: '10:30AM-11:30AM Thursday',
//       organiser: 'Enable',
//       cost: '£4-5',
//       contact: 'active@enablelc.org'
//     },
//     {
//       name: 'Tone & Stretch',
//       description: 'Tone and Stretch sessions focusing on toning muscles and enhancing flexibility.',
//       audience: 'Adults',
//       venue: 'Roehampton Methodist Church',
//       time: '11AM-12noon Friday',
//       organiser: 'Enable',
//       cost: '£4-5',
//       contact: 'active@enablelc.org'
//     }
//   ];