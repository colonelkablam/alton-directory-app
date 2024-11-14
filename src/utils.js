// utils.js

// Toggle a filter on or off
export function toggleFilter(setFilter, value) {
  setFilter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
}

export function togglePin(activityId, pinnedActivities, setPinnedActivities) {
  setPinnedActivities(prevPinned =>
    prevPinned.includes(activityId)
      ? prevPinned.filter(id => id !== activityId) // Unpin if already pinned
      : [...prevPinned, activityId] // Pin if not already pinned
  );
}

export function clearPinnedActivities(setPinnedActivities) {
  setPinnedActivities([]);
}
  
// Reset all filters to their default state
export function resetFilters(setSearchTerm, setFilterAudience, setFilterCost, setFilterDays, setIsOneOff) {
  setSearchTerm('');
  setFilterAudience([]);
  setFilterCost([]);
  setFilterDays([]);
  setIsOneOff(false);
}
  
// Function to check if an activity matches search criteria
export function matchesSearch(activity, searchTokens) {
  return searchTokens.length === 0 || searchTokens.some(token =>
    activity.name.toLowerCase().includes(token) ||
    activity.description.toLowerCase().includes(token) ||
    activity.venue.toLowerCase().includes(token) ||
    activity.organiser.toLowerCase().includes(token)
  );
}
  
// Get cost type based on activity cost
export function getCostType(cost) {
  if (!cost) return 'Other';
  if (cost === 'Free') return 'Free';
  const costNumber = parseFloat(cost.match(/\d+(\.\d+)?/));
  return !isNaN(costNumber) && costNumber < 10 ? 'Low Cost' : 'Other';
}

// Main filtering function
export function applyFilters({ 
  activities, 
  searchTerm, 
  filterAudience, 
  filterCost, 
  filterDays, 
  isOneOff, 
  maxDistance 
}) {
  const searchTokens = searchTerm.toLowerCase().split(' ').filter(Boolean);

  return activities.filter(activity => {
    const matchesSearch = searchTokens.length === 0 || searchTokens.some(token =>
      activity.name.toLowerCase().includes(token) ||
      activity.description.toLowerCase().includes(token) ||
      activity.venue.toLowerCase().includes(token) ||
      activity.organiser.toLowerCase().includes(token)
    );

    const matchesAudience = filterAudience.length === 0 || filterAudience.includes(activity.audience);
    const costType = getCostType(activity.cost);
    const matchesCost = filterCost.length === 0 || filterCost.includes(costType);
    const matchesDay = filterDays.length === 0 || filterDays.some(day => activity.daysOfWeek.includes(day));
    const matchesOneOff = isOneOff
      ? activity.timePeriod === 'One-off Event' || activity.timePeriod === 'Other (non-repeating)'
      : true;
    // Ensure distance filter works correctly even if activity.distance is undefined
    const matchesDistance = activity.distance == null || activity.distance <= maxDistance;


    return matchesSearch && matchesAudience && matchesCost && matchesDay && matchesOneOff && matchesDistance;
  });
}
  