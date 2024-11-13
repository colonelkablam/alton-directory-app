// ActivityCard.js
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, PoundSterling, Globe, Phone, Users, Footprints } from 'lucide-react';
import { getUserLocation, calculateDistance } from './navUtils';


function ActivityCard({ activity, togglePin, pinnedActivities }) {
  // Check if this activity is pinned
  const isPinned = pinnedActivities.includes(activity.id);
  // State to store the distance
  const [distance, setDistance] = useState(null);

  // Format the time-related information into a single string
  const timeInfo = activity.timePeriod === 'One-off Event'
    ? `${activity.oneOffDate} (${activity.timePeriod})`
    : activity.timePeriod;

// Fetch user location and calculate distance to the activity if it has latitude/longitude
useEffect(() => {
  if (activity.locationLat && activity.locationLong) {
    getUserLocation()
      .then(userLocation => {
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.long,
          activity.locationLat,
          activity.locationLong
        );

        // Uncomment if needed for debugging
        // console.log("User location:", userLocation);
        // console.log("Activity location:", activity.locationLat, activity.locationLong);
        // console.log("Calculated distance:", dist);

        setDistance(dist); // Set the calculated distance
      })
      .catch(error => {
        console.error("Error getting user location:", error);
        setDistance(null); // Set distance to null if there's an error in fetching location
      });
  } else {
    setDistance(null); // Set distance to null if latitude or longitude is missing
  }
}, [activity.locationLat, activity.locationLong]);

  return (
    <div className="card">
      <div className="card-content">

        <div className="card-title-and-checkbox">
          <h3 className="card-title two-line-textbox">{activity.name}</h3>
          <div className="pin-checkbox">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={() => togglePin(activity.id)}
              title="Pin this activity"
            />
          </div>
        </div>

        <p className="card-description scrollable-textbox">{activity.description}</p>

        <div className="card-details">

          <div className="detail detail-highlight">
            <span className="icon">
              <MapPin size={16} />
            </span>
            <span className="two-line-textbox">{activity.venue}</span>
          </div>

          <div className="detail">
            <span className="icon">
              <Footprints size={16} />
            </span>
            <span>{distance === null ? "unknown" : `${(distance / 1000).toFixed(1)} km`}</span>
          </div>

          <div className="detail">
            <span className="icon">
              <Users size={16} />
            </span>
            <span>
              {activity.audience}
              {activity.ageRange ? ` ( ${activity.ageRange} )` : ''} {/* Adds ageRange if present */}
            </span>
          </div>

          <div className="detail">
            <span className="icon">
              <Clock size={16} />
            </span>
            <span>
              <div className="one-line-textbox">{timeInfo}</div>
              <div className="one-line-textbox">{activity.time}</div>
              <div className="one-line-textbox">
                {activity.daysOfWeek.map(day => day.toUpperCase().slice(0, 3)).join(' ')}
              </div>
            </span>
          </div>

          <div className="detail">
            <span className="icon">
              <User size={16} />
            </span>
            <span>{activity.organiser}</span>
          </div>

          <div className="detail">
            <span className="icon">
              <PoundSterling size={16} />
            </span>
            <span>Cost: </span>
            <span>{activity.cost}</span>
          </div>

          <div className="detail">
            <span className="icon">
              <Phone size={16} />
            </span>
            <span>{activity.contact}</span>
          </div>

          <div className="detail">
            <span className="icon">
              <Globe size={16} />
            </span>
            {activity.fisLink ? (
              <a href={activity.fisLink} target="_blank" rel="noopener noreferrer">
                Family Information Service Link
              </a>
            ) : (
              <span>No FIS link provided</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
