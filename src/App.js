import React, { useState } from 'react';
import { MapPin, Clock, User } from 'lucide-react';
import './App.css';
import activities from './data'; // Import activities data


// Card Component
function ActivityCard({ activity }) {
  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{activity.name}</h3>
        <p className="card-description">{activity.description}</p>
        <div className="card-details">
          <div className="detail">
            <span className="icon"><MapPin size={16} /></span>
            <span>{activity.venue}</span>
          </div>
          <div className="detail">
            <span className="icon"><Clock size={16} /></span>
            <span>{activity.time}</span>
          </div>
          <div className="detail">
            <span className="icon"><User size={16} /></span>
            <span>{activity.organiser}</span>
          </div>
        </div>
        <div className="card-cost">
          <span className="font-medium">Cost: </span>
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


  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const audiences = ['Children', 'Adults', 'Everyone'];
  const costs = ['Free', 'Low Cost', 'Other'];


  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = filterAudience.length === 0 || filterAudience.includes(activity.audience);
    const costType = activity.cost === 'Free' ? 'Free' : activity.cost.startsWith('£') && parseFloat(activity.cost.slice(1)) < 10 ? 'Low Cost' : 'Other';
    const matchesCost = filterCost.length === 0 || filterCost.includes(costType);
    const day = daysOfWeek.find(day => activity.time.toLowerCase().includes(day.toLowerCase()));
    const matchesDay = filterDays.length === 0 || (day && filterDays.includes(day));
    return matchesSearch && matchesAudience && matchesCost && matchesDay;
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
      <h3>Event View</h3>

        <button
          onClick={() => setActiveTab('cards')}
          className={activeTab === 'cards' ? 'tab-button active' : 'tab-button'}
        >
          Cards
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={activeTab === 'list' ? 'tab-button active' : 'tab-button'}
        >
          List
        </button>
        <button
          onClick={() => setActiveTab('day')}
          className={activeTab === 'day' ? 'tab-button active' : 'tab-button'}
        >
          Day of the Week
        </button>
      </div>

{/* Content Based on Active Tab */}
<div className="activities">
        {activeTab === 'cards' && (
          <div className="cards-view">
            {filteredActivities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        )}

        {activeTab === 'list' && (
          <table className="list-view">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Audience</th>
                <th>Venue</th>
                <th>Time</th>
                <th>Organiser</th>
                <th>Cost</th>
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
                  <td>{activity.time}</td>
                  <td>{activity.organiser}</td>
                  <td>{activity.cost}</td>
                  <td>{activity.contact || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'day' && (
          <div className="day-view">
            {daysOfWeek.map(day => {
              const dayActivities = filteredActivities.filter(activity =>
                activity.time.toLowerCase().includes(day.toLowerCase())
              );
              return dayActivities.length > 0 ? (
                <div key={day} className="day-section">
                  <h3>{day}</h3>
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

