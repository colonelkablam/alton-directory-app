import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Infinity } from 'lucide-react';
import debounce from 'lodash.debounce';
import './ServiceDirectoryStyle.css';
import { fetchActivities } from './data.js';
import { toggleFilter, resetFilters, togglePin, applyFilters, clearPinnedActivities} from './utils.js';
import { DAYS_OF_WEEK, AUDIENCES, COSTS, UK_POSTCODE_REGEX, MAX_DISTANCE} from './constants.js';
import { getUserLocation, fetchCoordinatesFromPostcode, calculateDistance } from './navUtils.js';
import ActivityCard from './ActivityCard';



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
  
  // Apply filter to get only pinned activities
  const pinnedActivitiesData = activities.filter(activity => pinnedActivities.includes(activity.id));
  
  // Apply filters only when a filter changes
  const filteredActivities = useMemo(() => {
    return applyFilters({
      activities,
      searchTerm: filterOptions.searchTerm,
      filterAudience: filterOptions.audience,
      filterCost: filterOptions.cost,
      filterDays: filterOptions.days,
      isOneOff: filterOptions.isOneOff,
      maxDistance: distanceEnabled ? filterOptions.maxDistance : null, // Only filter by distance if enabled
      userLocation
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
      <div className='filter-section-distance'>
        <input
            className='enable-dist-slider'
            type="checkbox"
            title='Select to filter by maximum distance'
            checked={distanceEnabled}
            onChange={(e) => setDistanceEnabled(e.target.checked)} // Enable/disable distance filter
          />
        <h3 className={distanceEnabled ? '' : 'disabled'}>Distance</h3>

      </div>
        <div className="distance-slider-bar">
          <span className={distanceEnabled ? 'distance-slider-value' : 'disabled distance-slider-value'}>
            {filterOptions.maxDistance === MAX_DISTANCE ? (
              <Infinity title="Infinite Distance" />
            ) : (
              `${filterOptions.maxDistance / 1000} km`
            )}
          </span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filterOptions.maxDistance / 1000}
            onChange={(e) => handleSliderMovement(e.target.value)}
            disabled={!distanceEnabled || !userLocation} // Disabled when checkbox is unticked or user location is unavailable
          />
          <input
              type="text"
              placeholder="Your postcode..."
              className={distanceEnabled ? 'postcode-input' : 'disabled postcode-input'}
              title="Enter postcode for more accurate distances!"
              value={filterOptions.postcode}
              onChange={handlePostcodeChange}
              disabled={!distanceEnabled} // Disable when the distance filter is not enabled
              style={{
                  backgroundColor: 
                      postcodeIsValid === null
                          ? 'inherit' // No postcode entered
                          : postcodeIsValid === 'validating'
                          ? 'lightyellow' // Validation in progress
                          : postcodeIsValid
                          ? 'lightgreen' // Valid postcode
                          : 'orange', // Invalid postcode
              }}
          />
      </div>
      
      {/* Days */}
      <div className="filter-section-days">
        <h3>Days</h3>
        {DAYS_OF_WEEK.map(day => (
          <button
            key={day}
            className={filterOptions.days.includes(day) ? 'filter-button active' : 'filter-button'}
            onClick={() => 
              setFilterOptions(prev => ({
                ...prev,
                days: toggleFilter(prev.days, day)
              }))
            }
          >
            {day}
          </button>
        ))}
      </div>

      {/* One-Off Checkbox */}
      <label className='one-off-label'>
        <input
          type="checkbox"
          checked={filterOptions.isOneOff}
          onChange={(e) => setFilterOptions((prev) => ({
            ...prev,
            isOneOff: e.target.checked
          }))}
        />
        One-off or events that do not repeat every week or month
      </label>

      {/* Audience */}
      <div className="filter-section">
        <h3>Audience</h3>
        {AUDIENCES.map(audience => (
          <button
            key={audience}
            className={filterOptions.audience.includes(audience) ? 'filter-button active' : 'filter-button'}
            onClick={() => 
              setFilterOptions(prevOptions => ({
                ...prevOptions,
                audience: toggleFilter(prevOptions.audience, audience)
              }))
            }
          >
            {audience}
          </button>
        ))}
      </div>

      {/* Cost */}
      <div className="filter-section">
        <h3>Cost</h3>
        {COSTS.map(cost => (
          <button
            key={cost}
            className={filterOptions.cost.includes(cost) ? 'filter-button active' : 'filter-button'}
            onClick={() => 
              setFilterOptions(prev => ({
                ...prev,
                cost: toggleFilter(prev.cost, cost)
              }))
            }
          >
            {cost}
          </button>
        ))}
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

        {/* Pinned View Tab Open */}
        {activeTab === 'pinned' && (
          <div className="pinned-view tab-content-yellow">
            <div className='pinned-view-button-box'>
              <button className='clear-pins-button' onClick={() => clearPinnedActivities(setPinnedActivities)}>Clear Pins</button>
            </div>
            {pinnedActivitiesData.length > 0 ? (
              pinnedActivitiesData.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  togglePin={handleTogglePin}
                  pinnedActivities={pinnedActivities}
                  updateActivityDistance={updateActivityDistance}
                  userLocation={userLocation}

                />
              ))
            ) : (
              <p>No pinned activities!</p>
            )}
          </div>
        )}

        {/* List View Tab Open */}
        {activeTab === 'list' && (
          <div className="list-view tab-content-purple">
            <table className="list-table">
              <thead>
                <tr>
                  <th>Pin</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Audience</th>
                  <th>Venue</th>
                  <th>Dist (km)</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>One-off Date</th>
                  <th>Cost</th>
                  <th>Organiser</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={pinnedActivities.includes(activity.id)}
                        onChange={() => handleTogglePin(activity.id)}
                        title="Pin this activity"
                      />
                    </td>
                    <td>{activity.name}</td>
                    <td>{activity.description}</td>
                    <td>{activity.audience}</td>
                    <td>{activity.venue}</td>
                    <td>
                      {distanceEnabled && activity.distance != null
                        ? `${(activity.distance / 1000).toFixed(1)}` // Format distance to 1 decimal
                        : "N/A"} {/* Display N/A if slider is deactivated */}
                    </td>
                    <td>
                      {activity.daysOfWeek.map((day) => (
                        <React.Fragment key={day}>
                          {day}
                          <br />
                        </React.Fragment>
                      ))}
                    </td>
                    <td>{activity.time}</td>
                    <td>{activity.oneOffDate || 'N/A'}</td>
                    <td>{activity.cost}</td>
                    <td>{activity.organiser}</td>
                    <td>{activity.contact || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Card View Tab Open */}
        {activeTab === 'cards' && (
          <div className="cards-view tab-content-green">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  togglePin={handleTogglePin}
                  pinnedActivities={pinnedActivities}
                  updateActivityDistance={updateActivityDistance}
                  userLocation={userLocation}
                />
              ))
            ) : (
              <p>No activities match filter search!</p>
            )}
          </div>
        )}

        {/* Day View Tab Open */}
        {activeTab === 'days' && (
          <div className="day-view tab-content-blue">
            {(filterOptions.days.length > 0 ? filterOptions.days : DAYS_OF_WEEK).map(day => {
              const dayActivities = filteredActivities.filter(activity =>
                activity.daysOfWeek.includes(day)
              );
            
              return dayActivities.length > 0 ? (
                <div key={day} className="day-section">
                  <h3 className="week-day-title">{day}</h3>
                  <div className="cards-view">
                    {dayActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        togglePin={handleTogglePin}
                        pinnedActivities={pinnedActivities}
                        updateActivityDistance={updateActivityDistance}
                        userLocation={userLocation}
                      />
                    ))}
                  </div>
                  <hr className="day-view-hr" />
                </div>
              ) : null;
            })}
             {/* Fallback message if no activities match */}
            {filteredActivities.length === 0 && (
              <p>No activities match filter search!</p>
            )}
          </div>
        )}

      </div>{/* End of content based on active tab */}

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
