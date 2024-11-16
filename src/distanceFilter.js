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
    <div className="filter-section-distance">
      <input
        className="enable-dist-slider"
        type="checkbox"
        title="Select to filter by maximum distance"
        checked={distanceEnabled}
        onChange={(e) => setDistanceEnabled(e.target.checked)}
      />
      <h3 className={distanceEnabled ? '' : 'disabled'}>Distance</h3>
    </div>
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
        value={maxDistance / 1000}
        onChange={(e) => handleSliderMovement(e.target.value)}
        disabled={!distanceEnabled}
      />
      <input
        type="text"
        placeholder="Your postcode..."
        className={distanceEnabled ? 'postcode-input' : 'disabled postcode-input'}
        title="Enter postcode for more accurate distances!"
        value={postcode}
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
