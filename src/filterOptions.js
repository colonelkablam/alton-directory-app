// FilterOptions.js
import React from 'react';
import { toggleFilter } from './utils';
import { DAYS_OF_WEEK, AUDIENCES, COSTS } from './constants.js';

const FilterOptions = ({ filterOptions, setFilterOptions }) => {
  
  // checks if all the days in DAYS_OF_WEEK are currently selected by comparing them to filterOptions.days
  // const areAllDaysSelected = DAYS_OF_WEEK.every(day => filterOptions.days.includes(day));

  // sets filterOptions.days to an empty array ([]) if all days are selected, or sets it to DAYS_OF_WEEK if not
  // const toggleAllDays = () => {
  //   setFilterOptions(prev => ({
  //     ...prev,
  //     days: areAllDaysSelected ? [] : [...DAYS_OF_WEEK],
  //   }));
  // };

  return (
    <div className="filters">

      {/* Days Filter */}
      <div className="filter-section-days">
        <h3>Days</h3>

        {/* Toggle All Button
        <button
          className="filter-button-all"
          onClick={toggleAllDays}
        >
          {areAllDaysSelected ? 'Deselect All' : 'Select All'}
        </button>
        <br /> */}
        {DAYS_OF_WEEK.map(day => (
          <button
            key={day}
            className={filterOptions.days.includes(day) ? 'filter-button active' : 'filter-button'}
            onClick={() =>
              setFilterOptions(prev => ({
                ...prev,
                days: toggleFilter(prev.days, day),
              }))
            }
          >
            {day}
          </button>
        ))}
      </div>

      {/* No Set Day Filter */}
      <div className="no-set-day-box">
        <input
          type="checkbox"
          checked={filterOptions.noSetDay}
          onChange={(e) =>
            setFilterOptions(prev => ({
              ...prev,
              noSetDay: e.target.checked, // Update the noSetDay state
              isOneOff: e.target.checked ? false : prev.isOneOff, // Deselect isOneOff if noSetDay is selected
            }))
          }
        />
        Activities with NO SET DAY or do not repeat every week or month
      </div>
      {/* One-Off Filter */}
      <div className="one-off-box">
        <input
          type="checkbox"
          checked={filterOptions.isOneOff}
          onChange={(e) =>
            setFilterOptions(prev => ({
              ...prev,
              isOneOff: e.target.checked, // Update the isOneOff state
              noSetDay: e.target.checked ? false : prev.noSetDay, // Deselect noSetDay if isOneOff is selected
            }))
          }
        />
        ONE-OFF activities 
      </div>
      {/* Audience Filter */}
      <div className="filter-section">
        <h3>Audience</h3>
        {AUDIENCES.map(audience => (
          <button
            key={audience}
            className={filterOptions.audience.includes(audience) ? 'filter-button active' : 'filter-button'}
            onClick={() =>
              setFilterOptions(prev => ({
                ...prev,
                audience: toggleFilter(prev.audience, audience),
              }))
            }
          >
            {audience}
          </button>
        ))}
      </div>

      {/* Cost Filter */}
      <div className="filter-section">
        <h3>Cost</h3>
        {COSTS.map(cost => (
          <button
            key={cost}
            className={filterOptions.cost.includes(cost) ? 'filter-button active' : 'filter-button'}
            onClick={() =>
              setFilterOptions(prev => ({
                ...prev,
                cost: toggleFilter(prev.cost, cost),
              }))
            }
          >
            {cost}
          </button>
        ))}
      </div>

    </div>
  );
};

export default FilterOptions;
