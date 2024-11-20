const axios = require("axios");

exports.handler = async (event, context) => {

  require("dotenv").config(); // Load local .env variables (only for development)

  // Use secrets in environment variables
  const SHEET_API_KEY = process.env.ALTON_GOOGLESHEET_API_KEY; 
  const SHEET_ID = process.env.ALTON_SHEET_ID;
  const SHEET_NAME = process.env.ALTON_SHEET_NAME;


  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${SHEET_API_KEY}`;
    console.log("Fetching data from:", url);

    const response = await axios.get(url);
    //console.log("Data fetched successfully:", response.data);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
 