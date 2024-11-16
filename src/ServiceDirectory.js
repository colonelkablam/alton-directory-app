import React, { useState, useEffect, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import './serviceDirectoryStyle.css';
import { fetchActivities } from './data.js';
import { resetFilters, togglePin, applyFilters, clearPinnedActivities} from './utils.js';
import { DAYS_OF_WEEK, AUDIENCES, COSTS, UK_POSTCODE_REGEX, MAX_DISTANCE} from './constants.js';
import { getUserLocation, fetchCoordinatesFromPostcode, calculateDistance } from './navUtils.js';
import DistanceFilter from './distanceFilter.js';
import FilterOptions from './filterOptions.js';
import TabbedView from './tabbedView.js';





// Main Component
function ServiceDirectory() {

  // combined filter states
  const [filterOptions, setFilterOptions] = useState({
    audience: [],
    cost: [],
    days: [],
    isOneOff: false,
    maxDistance: MAX_DISTANCE, 
    searchTerm: '',
    postcode: ''

  });  
  // Store pinned activity IDs
  const [pinnedActivities, setPinnedActivities] = useState([]);
   // state for active tab view
  const [activeTab, setActiveTab] = useState('days');
   // initialise activities array
  const [activities, setActivities] = useState([]);
  // user location
  const [userLocation, setUserLocation] = useState(null);
  // keep track of if postcode valid
  const [postcodeIsValid, setPostcodeIsValid] = useState(null);
   // New: Checkbox state
  const [distanceEnabled, setDistanceEnabled] = useState(false);



  // load in the activity data from the googlesheet using fetchActivities (in data.js)
  useEffect(() => {
    async function loadActivities() {
      const data = await fetchActivities();
      setActivities(data);
    }
    loadActivities();
  }, []);

  // this needs to be declared befor get user location?
  const updateActivityDistance = useCallback((activityId, newDistance) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === activityId ? { ...activity, distance: newDistance } : activity
      )
    );
  }, []);

  // Function to get the user's location when distance filter is enabled
  useEffect(() => {
    async function fetchLocation() {
      if (distanceEnabled && !userLocation) {
        const location = await getUserLocation();
        if (location) {
          setUserLocation(location);
          // Update activity distances
          activities.forEach((activity) => {
            if (activity.lat && activity.long) {
              const dist = calculateDistance(
                location.lat,
                location.long,
                activity.lat,
                activity.long
              );
              updateActivityDistance(activity.id, dist);
            }
          });
        }
      }
    }
    fetchLocation();
  }, [distanceEnabled, userLocation, activities, updateActivityDistance]);

  // to reduce calls to update when setting filter options
  const debouncedSearchTerm = useMemo(
    () => debounce((term) => {
      setFilterOptions(prev => ({
        ...prev,
        searchTerm: term
      }));
    }, 10),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    debouncedSearchTerm(term); // Debounced search directly updates filterOptions
  };
  
  // Function to toggle if activity pinned - passed as prop to each activity card 
  const handleTogglePin = (activityId) => {
    togglePin(activityId, pinnedActivities, setPinnedActivities);
  };

  // handles the input from the postcode box
  const handlePostcodeChange = async (e) => {
    const postcode = e.target.value.toUpperCase();
  
    setFilterOptions((prev) => ({
        ...prev,
        postcode,
    }));

    if (postcode === '') {
        // Reset validity and user location when the field is cleared
        setPostcodeIsValid(null);
        const browserLocation = await getUserLocation();
        if (browserLocation) {
            setUserLocation(browserLocation);
        }
    } else if (UK_POSTCODE_REGEX.test(postcode)) {
        // Start with optimistic valid state (based on regex)
        setPostcodeIsValid('validating'); // Optional: Indicates validation in progress

        const coords = await fetchCoordinatesFromPostcode(postcode);
        if (coords) {
            setPostcodeIsValid(true); // Mark as valid if API finds the postcode
            setUserLocation(coords); // Update user location to API-provided coordinates
        } else {
            setPostcodeIsValid(false); // Mark as invalid if API doesn't find it
            // Fallback to browser location
            const browserLocation = await getUserLocation();
            if (browserLocation) {
                setUserLocation(browserLocation);
            }
        }
    } else {
        // If postcode doesn't match regex, mark as invalid and fallback to browser location
        setPostcodeIsValid(false);
        const browserLocation = await getUserLocation();
        if (browserLocation) {
            setUserLocation(browserLocation);
        }
    }
  };

  const handleSliderMovement = (value) => {
    setFilterOptions((prev) => ({
      ...prev,
      maxDistance: Number(value) * 1000, // Convert km to meters
    }));
  };
  
  
  // Apply filters only when a filter changes
  const filteredActivities = useMemo(() => {
    return applyFilters({
      activities,
      searchTerm: filterOptions.searchTerm,
      filterAudience: filterOptions.audience,
      filterCost: filterOptions.cost,
      filterDays: filterOptions.days,
      isOneOff: filterOptions.isOneOff,
      maxDistance: distanceEnabled ? filterOptions.maxDistance : null,
      userLocation,
    });
  }, [activities, filterOptions, userLocation, distanceEnabled]);


  return (
    <div className="container">
      <h1>Community Activities</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search activities..."
          className="search-input"
          value={filterOptions.searchTerm}
          onChange={handleSearchChange} // Use handleSearchChange here
        />
        <button
          className="clear-search-button"
          onClick={() => resetFilters(setFilterOptions)}
        >
          Clear Search
        </button>
      </div>


      {/* Filter Section */}

      {/* Distance Slider */}
      <DistanceFilter
        distanceEnabled={distanceEnabled}
        setDistanceEnabled={setDistanceEnabled}
        maxDistance={filterOptions.maxDistance}
        handleSliderMovement={handleSliderMovement}
        postcode={filterOptions.postcode}
        handlePostcodeChange={handlePostcodeChange}
        postcodeIsValid={postcodeIsValid}
      />
      
      <FilterOptions
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        AUDIENCES={AUDIENCES}
        COSTS={COSTS}
        DAYS_OF_WEEK={DAYS_OF_WEEK}
      />

      {/* Clear Pins Button */}
      <div className="pinned-view-button-box">
        <button 
          className="clear-pins-button" 
          onClick={() => clearPinnedActivities(setPinnedActivities)}
        >
          Clear Pins
        </button>
      </div>

      {/* Tabs for Viewing Options */}
      <div className="view-tabs">
        <h3 className="event-view-title">Event View</h3>
        <button
          onClick={() => setActiveTab('days')}
          className={`tab-button tab-blue ${activeTab === 'days' ? 'active' : ''}`}
        >
          Days
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`tab-button tab-green ${activeTab === 'cards' ? 'active' : ''}`}
        >
          Cards
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`tab-button tab-purple ${activeTab === 'list' ? 'active' : ''}`}
        >
          List
        </button>
        <button
          onClick={() => setActiveTab('pinned')}
          className={`tab-button tab-yellow ${activeTab === 'pinned' ? 'active' : ''}`}
          title="See your pinned activities" // This will show on hover
         >
          Pinned
        </button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="activities">
      <TabbedView
        activeTab={activeTab}
        filteredActivities={filteredActivities}
        togglePin={handleTogglePin}
        pinnedActivities={pinnedActivities}
        distanceEnabled={distanceEnabled}
        selectedDays={filterOptions.days || []} // Pass days as selectedDays
      />
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear() }
          <a 
            href="https://portfolio.nickharding.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Nick Harding
          </a>
        </p>
      </footer>
    </div>
  );
}

export default ServiceDirectory;
