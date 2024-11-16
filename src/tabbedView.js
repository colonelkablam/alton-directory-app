// TabbedView.js
import React from 'react';
import ActivityCard from './activityCard';
import { DAYS_OF_WEEK } from './constants.js';


const TabbedView = ({ 
  activeTab, 
  filteredActivities, 
  togglePin, 
  pinnedActivities, 
  distanceEnabled,
  selectedDays

}) => {

  const daysToDisplay = selectedDays ?? []; // Fallback to an empty array if undefined

  switch (activeTab) {
    case 'pinned':
      return (
        <div className="pinned-view tab-content-yellow">
        
          {/* Render Pinned Activities */}
          {pinnedActivities.length > 0 ? (
            filteredActivities
              .filter(activity => pinnedActivities.includes(activity.id)) // Filter activities based on pinned IDs
              .map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  togglePin={togglePin}
                  pinnedActivities={pinnedActivities}
                  distanceEnabled={distanceEnabled}
                />
              ))
          ) : (
            <p>No pinned activities!</p>
          )}
        </div>
      );
      

    case 'list':
      return (
        <div className="list-view tab-content-purple">

          {/* Render filtered activities in a list */}
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
              {filteredActivities.map(activity => (
                <tr key={activity.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={pinnedActivities.includes(activity.id)}
                      onChange={() => togglePin(activity.id)}
                    />
                  </td>
                  <td>{activity.name}</td>
                  <td>{activity.description}</td>
                  <td>{activity.audience}</td>
                  <td>{activity.venue}</td>
                  <td>
                    {distanceEnabled && activity.distance != null
                      ? `${(activity.distance / 1000).toFixed(1)} km`
                      : "N/A"}
                  </td>
                  <td>{activity.daysOfWeek.join(', ')}</td>
                  <td>{activity.time}</td>
                  <td>{activity.oneOffDate || "N/A"}</td>
                  <td>{activity.cost}</td>
                  <td>{activity.organiser}</td>
                  <td>{activity.contact || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'cards':
      return (
        <div className="cards-view tab-content-green">

          {/* Render list of Activities after filter */}
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                togglePin={togglePin}
                pinnedActivities={pinnedActivities}
                distanceEnabled={distanceEnabled}
              />
            ))
          ) : (
            <p>No activities match filter search!</p>
          )}
        </div>
      );

      case 'days':
        return (
          <div className="day-view tab-content-blue">
            {DAYS_OF_WEEK.filter(day =>
              daysToDisplay.length === 0 || daysToDisplay.includes(day)
            ).map(day => {
              const dayActivities = filteredActivities.filter(activity =>
                activity.daysOfWeek.includes(day)
              );
  
              return dayActivities.length > 0 ? (
                <div key={day} className="day-section">
                  <h3 className="week-day-title">{day}</h3>
                  <div className="cards-view">
                    {dayActivities.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        togglePin={togglePin}
                        pinnedActivities={pinnedActivities}
                        distanceEnabled={distanceEnabled}
                      />
                    ))}
                  </div>
                  <hr className="day-view-hr" />
                </div>
              ) : null;
            })}
            {filteredActivities.length === 0 && <p>No activities match filter search!</p>}
          </div>
        );
  
      default:
        return null;
    }
  };

export default TabbedView;
