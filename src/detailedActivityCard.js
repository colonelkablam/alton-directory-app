import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div className="detailed-card">
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      {/* Render additional activity details */}
    </div>
  );
}

export default DetailedActivityCard;
