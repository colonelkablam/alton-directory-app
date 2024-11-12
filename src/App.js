import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, PoundSterling  } from 'lucide-react';
import './App.css';
//import activities from './data'; // Import activities data
import { fetchActivities } from './data.js'; // get data from googlesheet


// Card Component
function ActivityCard({ activity }) {
  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{activity.name}</h3>
        <p className="card-description">{activity.description}</p>
        <div className="card-details">
          <div className="detail">
            <span className="icon">
              <MapPin size={16} />
            </span>
            <span>{activity.venue}</span>
          </div>
          <div className="detail2">
            <span className="icon">
              <Clock size={16} />
            </span>
            <span>
              {activity.oneOffDate && (
                <>
                  {activity.oneOffDate}
                  <br />
                </>
              )}
              {activity.time}
              <br />
              {activity.daysOfWeek.map((day) => day.toUpperCase().slice(0, 3)).join(' ')}
            </span>
          </div>
          <div className="detail">
            <span className="icon">
              <User size={16} />
            </span>
            <span>{activity.organiser}</span>
          </div>
        </div>
        <div className="detail2">
          <span className="icon">
            <PoundSterling size={16} /> {/* Pound icon from lucide-react */}
          </span>
          <span>Cost: </span>
          <span>{activity.cost}</span>
        </div>
      </div>
    </div>
  );
}



// Main Component
function EnhancedServiceDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState([]);
  const [filterCost, setFilterCost] = useState([]);
  const [filterDays, setFilterDays] = useState([]);
  const [activeTab, setActiveTab] = useState('cards'); // state for active tab
  const [isOneOff, setIsOneOff] = useState(false); // State for the one-off checkbox

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function loadActivities() {
      const data = await fetchActivities();
      setActivities(data);
    }

    loadActivities();
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const audiences = ['Children', 'Adults', 'Family', 'Everyone'];
  const costs = ['Free', 'Low Cost', 'Other'];

  const filteredActivities = activities.filter(activity => {
    // Split the search term into tokens by spaces and filter out any empty strings
    const searchTokens = searchTerm.toLowerCase().split(' ').filter(token => token);

    // Check if the search term is empty or contains only whitespace OR if each token is included in any of the fields
    const matchesSearch = searchTokens.length === 0 || searchTokens.some(token =>
      activity.name.toLowerCase().includes(token) ||
      activity.description.toLowerCase().includes(token) ||
      activity.venue.toLowerCase().includes(token) ||
      activity.organiser.toLowerCase().includes(token)
    );

    // Determine if the activity matches the audience filter:
    // - If `filterAudience` is empty (no audience filter applied), all activities match.
    // - If `filterAudience` contains specific audiences, check if `activity.audience`
    //   is one of them. If it is, `matchesAudience` will be `true`, otherwise `false`.
    const matchesAudience = filterAudience.length === 0 || filterAudience.includes(activity.audience);
    
    // Check that activity.cost is defined and not empty
    let costType = 'Other';

    if (activity.cost) {
        if (activity.cost === 'Free') {
            costType = 'Free';
        } else {
            // Use a regular expression to extract the first number in the cost string
            const costNumber = parseFloat(activity.cost.match(/\d+(\.\d+)?/));
            
            if (!isNaN(costNumber) && costNumber < 10) {
                costType = 'Low Cost';
            }
        }
    }

    const matchesCost = filterCost.length === 0 || filterCost.includes(costType);
    const matchesDay = filterDays.length === 0 || filterDays.some(day => activity.daysOfWeek.includes(day));

    // Add check for one-off or irregular events based on the checkbox state
    const matchesOneOff = isOneOff
        ? activity.timePeriod === 'One-off Event' || activity.timePeriod === 'Other (irregular)'
        : true;

    return matchesSearch && matchesAudience && matchesCost && matchesDay && matchesOneOff;
  });

  function toggleFilter(setFilter, value) {
    setFilter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  }

  return (
    <div className="container">
      <h1>Community Activities</h1>
      <input
        type="text"
        placeholder="Search activities..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* One-Off Checkbox */}
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={isOneOff}
            onChange={(e) => setIsOneOff(e.target.checked)}
          />
          One-off or Irregular Events
        </label>
      </div>

      <div className="filter-section">
        <h3>Days</h3>
        {daysOfWeek.map(day => (
          <button
            key={day}
            className={filterDays.includes(day) ? 'filter-button active' : 'filter-button'}
            onClick={() => toggleFilter(setFilterDays, day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="filter-section">
        <h3>Audience</h3>
        {audiences.map(audience => (
          <button
            key={audience}
            className={filterAudience.includes(audience) ? 'filter-button active' : 'filter-button'}
            onClick={() => toggleFilter(setFilterAudience, audience)}
          >
            {audience}
          </button>
        ))}
      </div>

      <div className="filter-section">
        <h3>Cost</h3>
        {costs.map(cost => (
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
          onClick={() => setActiveTab('cards')}
          className={`tab-button tab-blue ${activeTab === 'cards' ? 'active' : ''}`}
        >
          Card
        </button>
        <button
          onClick={() => setActiveTab('day')}
          className={`tab-button tab-purple ${activeTab === 'day' ? 'active' : ''}`}
        >
          Week Day
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`tab-button tab-green ${activeTab === 'list' ? 'active' : ''}`}
        >
          List
        </button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="activities">
        {activeTab === 'cards' && (
          <div className="cards-view tab-content-blue">
            {filteredActivities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        )}

        {activeTab === 'list' && (
          <div className="list-view tab-content-green">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Audience</th>
                  <th>Venue</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>One Off Date</th>
                  <th>Cost</th>
                  <th>Organiser</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.name}</td>
                    <td>{activity.description}</td>
                    <td>{activity.audience}</td>
                    <td>{activity.venue}</td>
                    <td>
                      {activity.daysOfWeek.map((day, idx) => (
                        <React.Fragment key={idx}>
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

        {activeTab === 'day' && (
          <div className="day-view tab-content-purple">
            {(filterDays.length > 0 ? filterDays : daysOfWeek).map(day => {
              // Show activities only on the filtered days if filterDays has selections
              const dayActivities = filteredActivities.filter(activity =>
                activity.daysOfWeek.includes(day) // Only include activities available on the selected day
              );
            
              // Render only if there are activities for the specific day
              return dayActivities.length > 0 ? (
                <div key={day} className="day-section">
                  <h3 class="week-day-title">{day}</h3>
                  {dayActivities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                  ))}
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// App Component
function App() {
  return <EnhancedServiceDirectory />;
}

export default App;

