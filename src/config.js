// get the APIs and SHEET ID from the enviroment (locally .env otherwise from secret variables in netlify)
export const GMAP_API_KEY = process.env.REACT_APP_ALTON_GMAP_API_KEY;
export const GSHEET_API_KEY = process.env.REACT_APP_ALTON_GSHEET_API_KEY;

export const SHEET_ID = process.env.REACT_APP_ALTON_GOOGLESHEET_DATABASE_ID;
export const SHEET_NAME = 'Directory';

export const GOOGLE_FORM_INPUT_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSdcRUOlHKa0VkSjMEudrHJUBR3y-4x6DJzNXLmrP8dtZg2Ahg/viewform";
export const GOOGLE_FORM_SUGGESTION_LINK = "https://forms.gle/C6YjRjXJgFUuF5qA6";
