import React, { useState, useEffect } from 'react';
import './ServiceDirectoryStyle.css';
import { fetchActivities } from './data.js';
import { toggleFilter, resetFilters, togglePin, applyFilters, clearPinnedActivities} from './utils.js';
import { DAYS_OF_WEEK, ADUDIENCES, COSTS } from './constants.js';
import ActivityCard from './ActivityCard'; // Assuming ActivityCard is in its own file now


// Main Component
function ServiceDirectory() {

  // define the states for my search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState([]);
  const [filterCost, setFilterCost] = useState([]);
  const [filterDays, setFilterDays] = useState([]);
  const [isOneOff, setIsOneOff] = useState(false); // State for the one-off checkbox
  
  // Store pinned activity IDs
  const [pinnedActivities, setPinnedActivities] = useState([]);
   // state for active tab view
  const [activeTab, setActiveTab] = useState('days');
   // initialise activities array
  const [activities, setActivities] = useState([]);
  
  // Function to toggle if activity pinned - passed as prop to each activity card 
  // Use `togglePin` from utils.js
  const handleTogglePin = (activityId) => {
    togglePin(activityId, pinnedActivities, setPinnedActivities);
  };

  // load in the activities from the googlesheet using fetchActivities (in data.js)
  useEffect(() => {
    async function loadActivities() {
      const data = await fetchActivities();
      setActivities(data);
    }
    loadActivities();
  }, []);
  
  // Apply filter to get only pinned activities
  const pinnedActivitiesData = activities.filter(activity => pinnedActivities.includes(activity.id));
  
  // Apply filters to activities
  const filteredActivities = applyFilters({
    activities,
    searchTerm,
    filterAudience,
    filterCost,
    filterDays,
    isOneOff,
  });

  // needed to update the distance within the activity object  - passed as prop to each activity card
  function updateActivityDistance(activityId, newDistance) {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId ? { ...activity, distance: newDistance } : activity
      )
    );
  }
  
  return (
    <div className="container">
      <h1>Community Activities</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search activities..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="clear-search-button"
          onClick={() => {
            resetFilters(setSearchTerm, setFilterAudience, setFilterCost, setFilterDays, setIsOneOff);
          }}
        >
          Clear Search
        </button>
      </div>

      {/* One-Off Checkbox */}
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={isOneOff}
            onChange={(e) => setIsOneOff(e.target.checked)}
          />
          One-off or events that do not repeat every week or month
        </label>
      </div>

      {/* Filter Section */}
      
      {/* Days */}
      <div className="filter-section-days">
        <h3>Days</h3>
        {DAYS_OF_WEEK.map(day => (
          <button
            key={day}
            className={filterDays.includes(day) ? 'filter-button active' : 'filter-button'}
            onClick={() => toggleFilter(setFilterDays, day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Audience */}
      <div className="filter-section">
        <h3>Audience</h3>
        {ADUDIENCES.map(audience => (
          <button
            key={audience}
            className={filterAudience.includes(audience) ? 'filter-button active' : 'filter-button'}
            onClick={() => toggleFilter(setFilterAudience, audience)}
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
            className={filterCost.includes(cost) ? 'filter-button active' : 'filter-button'}
            onClick={() => toggleFilter(setFilterCost, cost)}
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
                  <th>Pin</th> {/* New column for the pin checkbox */}
                  <th>Name</th>
                  <th>Description</th>
                  <th>Audience</th>
                  <th>Venue</th>
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
                        title="Pin this activity" // Tooltip on hover
                      />
                    </td>
                    <td>{activity.name}</td>
                    <td>{activity.description}</td>
                    <td>{activity.audience}</td>
                    <td>{activity.venue}</td>
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
                  key={activity.id} // Use activity.id
                  activity={activity}
                  togglePin={handleTogglePin}
                  pinnedActivities={pinnedActivities}
                  updateActivityDistance={updateActivityDistance}
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
            {(filterDays.length > 0 ? filterDays : DAYS_OF_WEEK).map(day => {
              const dayActivities = filteredActivities.filter(activity =>
                activity.daysOfWeek.includes(day)
              );
            
              return dayActivities.length > 0 ? (
                <div key={day} className="day-section">
                  <h3 className="week-day-title">{day}</h3>
                  <div className="cards-view">
                    {dayActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id} // Use activity.id
                        activity={activity}
                        togglePin={handleTogglePin}
                        pinnedActivities={pinnedActivities}
                        updateActivityDistance={updateActivityDistance}
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
    </div>
  );
}

export default ServiceDirectory;
