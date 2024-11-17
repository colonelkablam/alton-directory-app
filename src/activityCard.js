import React, { useEffect } from 'react';
import { MapPin, Clock, User, PoundSterling, Globe, Phone, Users, Footprints, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";



function ActivityCard({ activity, togglePin, pinnedActivities, distanceEnabled }) {
  // Check if this activity is pinned
  const isPinned = pinnedActivities.includes(activity.id);
  const navigate = useNavigate();

  const handleClickToDetails = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    navigate(`/activity/${activity.id}`, { state: { activity } }); // Pass activity in state
  };

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);


  // Format the time-related information into a single string
  const timeInfo = activity.timePeriod === 'One-off Event'
    ? `${activity.oneOffDate} (${activity.timePeriod})`
    : activity.timePeriod;

  return (
    <div className="card">
      <div className="card-content">

        <div className="card-title-and-checkbox">
        <button onClick={handleClickToDetails}>
        <span className="icon">
              <Info size={20} />
            </span>
        </button>

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
            {!distanceEnabled ? '-' : activity.distance != null ? `${(activity.distance / 1000).toFixed(1)} km` : 'unknown'}
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