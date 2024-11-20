import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Clock, User, PoundSterling, Phone, Users, Globe, Map, Pin, ArrowBigLeft, MessageSquareWarning } from "lucide-react";
import { ServiceDirectoryContext } from "./serviceDirectoryContext"; // Import the context
import { togglePin } from './utils.js';
import './detailedActivityCardStyle.css';
import { GOOGLEMAP_API_KEY } from "./config.js";


function DetailedActivityCard() {
  const { state } = useLocation(); // Access the state passed during navigation
  const navigate = useNavigate();
  const activity = state?.activity; // Retrieve activity from state

  // Scroll to the top when this component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Access the context
  const { pinnedActivities, setPinnedActivities } = useContext(ServiceDirectoryContext);
  // Check if this activity is pinned
  const isPinned = pinnedActivities.includes(activity.id);

  // handle no activity loaded
  if (!activity) {
    return (
      <div className="detailed-card">

      <div className="detailed-card-header">
        <button className="detailed-back-button" onClick={() => navigate(-1)}>
            &lt;&lt;&lt; Back
        </button>
        <h1 className="detailed-title">Activity not found! Please try refreshing the browser</h1>
      </div>

      </div>
    );
  }

  const timePeriod = activity.timePeriod === "One-off Event"
    ? activity.timePeriod + ": "
    : "Time period: ";

  const timeInfo = activity.timePeriod === "One-off Event"
    ? activity.oneOffDate
    : activity.timePeriod;

  return (
    <div className="detailed-card">
      <div className="detailed-card-header">
        <div onClick={() => navigate(-1)} className="detailed-back-button">
        <ArrowBigLeft size={42} />
        </div>
        <h1 className="detailed-title">{activity.name}</h1>
        <div className="detailed-pin-checkbox">
          <Pin
            size={30}
            className={`pin-icon ${isPinned ? 'pinned' : ''}`} // Conditionally apply style
            onClick={() => togglePin(activity.id, setPinnedActivities)} // Call the pin function
            title={isPinned ? 'Unpin this activity' : 'Pin this activity'}
          />
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="detailed-map-placeholder">
        {activity.lat && activity.long ? (
          <iframe
            title="Activity Location Map"
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLEMAP_API_KEY}&q=${activity.lat},${activity.long}&zoom=15`}
            allowFullScreen
            loading="lazy"
            style={{ border: 0, width: "100%", height: "300px" }}
          ></iframe>
        ) : (
          <p>
            <Map className="unloaded-map-icon" size={64} /><br />
            Map currently unavailable - no location details.
          </p>
        )}
      </div>
      <div className="warning-text-box">
          <MessageSquareWarning className="warning-icon" size={20}/>
          <p>pin locations are based on a postcode or location data provided by users, please check location is correct before attending</p>
      </div>


      <div className="detailed-content">
        {/* Detailed Description */}
        <h3>Description</h3>

        <div className="detailed-description-container">
          <p className="detailed-description">{activity.description}</p>
        </div>

        {/* Detailed Info */}
        <div className="detailed-info">
          {/* Venue */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <MapPin size={20} />
            </span>
            <span>
              {"Address: "} <span className="detailed-bold">{activity.venue}</span>
            </span>
          </div>

          {/* Audience */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Users size={20} />
            </span>
            <span>
              {"Audience: "} <span className="detailed-bold"> {activity.audience} 
              {activity.ageRange ? ` (Age: ${activity.ageRange})` : ""} </span>
            <br />
            {"Further info: "} <span className="detailed-bold"> {activity.audienceOther} </span>
            </span>
          </div>

          {/* Time and Date */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Clock size={20} />
            </span>
            <span>
              {"Time: "} <span className="detailed-bold"> {activity.time} </span> <br />
              {"Days: "} <span className="detailed-bold"> {activity.daysOfWeek.join(", ")} </span> <br />
              {timePeriod} <span className="detailed-bold">{timeInfo} </span><br />
              {activity.extraDatesDetails && (<span> Further info: <span className="detailed-bold"> {activity.extraDatesDetails} </span> </span> )}
            </span>
          </div>

          {/* Organiser */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <User size={20} />
            </span>
            <span>
              {"Organiser: "} <span className="detailed-bold"> {activity.organiser} </span> <br />
              {"Booking required: "} <span className="detailed-bold"> {activity.bookingRequired} </span>
            </span>
          </div>

          {/* Cost */}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <PoundSterling size={20} />
            </span>
            <span>
              {"Cost: "} <span className="detailed-bold"> {activity.cost} </span>
            </span>
          </div>

          {/* Contact - this will print free text added*/}
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Phone size={20} />
            </span>
            <span>
              {"Contact info: "}<span className="detailed-bold"> {activity.contacts[0] || "No contact details provided"} </span>
            </span>
          </div>

          {/* This will print out all the contact details if ever needed
          <div className="detailed-detail">
            <span className="detailed-icon">
              <Phone size={20} />
            </span>
            <div>
              {activity.contacts && activity.contacts.length > 0 ? (
                activity.contacts.map((contact, index) => (
                  <div key={index}>{contact}</div>
                ))
              ) : (
                <span>No contact details provided</span>
              )}
            </div>
          </div>
          */}

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
