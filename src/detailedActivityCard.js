import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Clock, User, PoundSterling, Phone, Users, Globe, Info, Calendar, Map } from "lucide-react";
import './detailedActivityCardStyle.css';


function DetailedActivityCard() {
  const { state } = useLocation(); // Access the state passed during navigation
  const navigate = useNavigate();
  const activity = state?.activity; // Retrieve activity from state

  if (!activity) {
    return (
      <div className="detailed-card">
        <button onClick={() => navigate(-1)}>Back</button>
        <p>Activity not found!</p>
      </div>
    );
  }

  const timeInfo = activity.timePeriod === "One-off Event"
    ? `${activity.oneOffDate} (${activity.timePeriod})`
    : activity.timePeriod;

  return (
    <div className="detailed-card">
      <div className="detailed-card-header">
        <button onClick={() => navigate(-1)} className="detailed-back-button">
          Back
        </button>
        <h1 className="detailed-title">{activity.name}</h1>
        <div className="detailed-pin-checkbox">
          <input
            type="checkbox"
            checked={false} // Placeholder for pin functionality
            onChange={() => {}}
            title="Pin this activity"
          />
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="detailed-map-placeholder">
        <Map size={64} />
        <p>Map will be displayed here.</p>
      </div>

      <div className="detailed-content">
        {/* Description */}
        <p className="detailed-description">{activity.description}</p>

        {/* Details */}
        <div className="detailed-info">
          {/* Venue */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <MapPin size={20} />
            </span>
            <span>{activity.venue}</span>
          </div>
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Map size={20} />
            </span>
            <span>Coordinates: {activity.lat}, {activity.long}</span>
          </div>

          {/* Audience */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Users size={20} />
            </span>
            <span>
              {activity.audience}
              {activity.ageRange ? ` (Age: ${activity.ageRange})` : ""}
              {activity.audienceOther && ` - Notes: ${activity.audienceNotes}`}
            </span>
          </div>

          {/* Audience details*/}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Info size={20} />
            </span>
            <span>
              {activity.audience}
              {activity.ageRange ? ` (Age: ${activity.ageRange})` : ""}
              {activity.audienceNotes && ` - Notes: ${activity.audienceNotes}`}
            </span>
          </div>

          {/* Time and Date */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Clock size={20} />
            </span>
            <span>
              {timeInfo} <br />
              {activity.time} <br />
              {activity.daysOfWeek && `Days: ${activity.daysOfWeek.join(", ")}`} <br />
              {activity.additionalDates && `Additional Dates: ${activity.additionalDates}`}
            </span>
          </div>

          {/* Organiser */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <User size={20} />
            </span>
            <span>{activity.organiser}</span>
          </div>

          {/* Cost */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <PoundSterling size={20} />
            </span>
            <span>{activity.cost || "Free"}</span>
          </div>

          {/* Contact */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Phone size={20} />
            </span>
            <span>{activity.contact || "No contact details provided"}</span>
          </div>

          {/* FIS Link */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Globe size={20} />
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

export default DetailedActivityCard;
