// FilterOptions.js
import React from 'react';
import { toggleFilter } from './utils';

const FilterOptions = ({ filterOptions, setFilterOptions, AUDIENCES, COSTS, DAYS_OF_WEEK }) => (

  <div className="filters">

        {/* Days Filter */}
        <div className="filter-section-days">
      <h3>Days</h3>
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

    {/* One-Off Filter */}
    <label className="one-off-label">
      <input
        type="checkbox"
        checked={filterOptions.isOneOff}
        onChange={(e) =>
          setFilterOptions(prev => ({
            ...prev,
            isOneOff: e.target.checked,
          }))
        }
      />
      One-off or events that do not repeat every week or month
    </label>
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

export default FilterOptions;
