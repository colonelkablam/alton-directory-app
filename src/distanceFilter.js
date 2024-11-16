// DistanceFilter.js
import React from 'react';
import { Infinity } from 'lucide-react';
import {MAX_DISTANCE} from './constants.js';

const DistanceFilter = ({ 
  distanceEnabled, 
  setDistanceEnabled, 
  maxDistance, 
  handleSliderMovement, 
  postcode, 
  handlePostcodeChange, 
  postcodeIsValid 
}) => (
  <div className="distance-filter">
    <label className="filter-section-checkbox">
      <input
        className="enable-content"
        type="checkbox"
        title="Select to filter by maximum distance"
        checked={!!distanceEnabled} // Ensure it's always a boolean
        onChange={(e) => setDistanceEnabled(e.target.checked)}
      />
      <h3 className={distanceEnabled ? '' : 'disabled'}>Distance</h3>
    </label>
    <div className="distance-slider-bar">
      <span className={distanceEnabled ? 'distance-slider-value' : 'disabled distance-slider-value'}>
        {maxDistance === MAX_DISTANCE ? (
          <Infinity title="Infinite Distance" />
        ) : (
          `${maxDistance / 1000} km`
        )}
      </span>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={(maxDistance || 0) / 1000} // Ensure it has a fallback value
        onChange={(e) => handleSliderMovement(e.target.value)}
        disabled={!distanceEnabled}
      />
      <input
        type="text"
        placeholder="Your postcode..."
        className={distanceEnabled ? 'postcode-input' : 'disabled postcode-input'}
        title="Enter postcode for more accurate distances!"
        value={postcode || ''} // Default to empty string
        onChange={handlePostcodeChange}
        disabled={!distanceEnabled}
        style={{
          backgroundColor: postcodeIsValid === null
            ? 'inherit'
            : postcodeIsValid === 'validating'
            ? 'lightyellow'
            : postcodeIsValid
            ? 'lightgreen'
            : 'orange',
        }}
      />
    </div>
  </div>
);

export default DistanceFilter;
