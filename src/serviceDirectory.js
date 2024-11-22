import React, { useEffect, useMemo, useContext, useCallback } from 'react';
import { ServiceDirectoryContext } from "./serviceDirectoryContext.js";
import './serviceDirectoryStyle.css';
import { fetchActivities } from './data.js';
import { resetFilters, togglePin, applyFilters, clearPinnedActivities} from './utils.js';
import { UK_POSTCODE_REGEX} from './constants.js';
import { getUserLocation, fetchCoordinatesFromPostcode, calculateDistance } from './navUtils.js';
import DistanceFilter from './distanceFilter.js';
import FilterOptions from './filterOptions.js';
import TabbedView from './tabbedView.js';
import Header from "./header";
import Footer from "./footer";




// Main Component
function ServiceDirectory() {

  // Access state and setters from the ServiceDirectoryContext
  const {
    activeTab,
    setActiveTab,
    filterOptions,
    setFilterOptions,
    pinnedActivities,
    setPinnedActivities,
    showFilters,
    setShowFilters,
    distanceEnabled,
    setDistanceEnabled,
    activities,
    setActivities,
    userLocation,
    setUserLocation,
    postcodeIsValid,
    setPostcodeIsValid,
  } = useContext(ServiceDirectoryContext);


  // load in the activity data from the googlesheet using fetchActivities (in data.js)
  useEffect(() => {
    async function loadActivities() {
      const data = await fetchActivities();
      setActivities(data);
    }
    loadActivities();
  }, [setActivities]);

  // this needs to be declared befor get user location?
  const updateActivityDistance = useCallback((activityId, newDistance) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === activityId ? { ...activity, distance: newDistance } : activity
      )
    );
  }, [setActivities]);

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
  }, [distanceEnabled, userLocation, activities, updateActivityDistance, setUserLocation]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setFilterOptions((prev) => ({
      ...prev,
      searchTerm: term, // Update search term immediately on every keystroke
    }));
  };
  
  // Function to toggle if activity pinned - passed as prop to each activity card 
  const handleTogglePin = (activityId) => {
    togglePin(activityId, setPinnedActivities);
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
    noSetDay: filterOptions.noSetDay,
    maxDistance: distanceEnabled ? filterOptions.maxDistance : null,
    userLocation: distanceEnabled ? userLocation : null,
    useFilters: showFilters // Control whether filters are applied
  });
}, [activities, filterOptions, userLocation, distanceEnabled, showFilters]);


  return (
    <div className="container">
      <Header /> {/* Add the Header */}

      <h1>Alton Community Activity Directory</h1>

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
          onClick={() => resetFilters(setFilterOptions, setDistanceEnabled)}
        >
          Clear Search
        </button>
      </div>

      {/* Toggle Filters Checkbox */}
      <label className="filter-section-checkbox">
        <input
          className="enable-content"
          type="checkbox"
          title="Use all search filters"
          checked={!!showFilters} // Ensure it's always a boolean
          onChange={(e) => setShowFilters(e.target.checked)} // Update context state
        />
        <h3 className={showFilters ? '' : 'disabled'}>
          {showFilters ? 'Filters Enabled' : 'Use All Search Filters'}
        </h3>
        <span
          className={`activity-count ${
            filteredActivities.length === 0
              ? filterOptions.searchTerm || showFilters
                ? 'none-found'
                : 'no-search'
              : 'found'
          }`}
        >
          {filteredActivities.length === 0
            ? (filterOptions.searchTerm || showFilters)
              ? 'No matches'
              : `${activities.length} activities in total`
            : `${filteredActivities.length} activities found`}
        </span>
      </label>

      {/* Filter Section */}

      {showFilters && (
      <>

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
      />

      </>
      )}

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
        clearPinnedActivities={clearPinnedActivities} // Pass the function
        setPinnedActivities={setPinnedActivities} // Pass the state setter
        
      />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ServiceDirectory;
