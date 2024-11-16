// utils.js
import { calculateDistance } from './navUtils';
import { MAX_DISTANCE } from "./constants";

// Toggle a filter on or off
export function toggleFilter(array = [], value) {
  return array.includes(value)
    ? array.filter(item => item !== value)
    : [...array, value];
}

export function togglePin(activityId, setPinnedActivities) {
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
export function resetFilters(setFilterOptions) {
  setFilterOptions({
    audience: [],
    cost: [],
    days: [],
    isOneOff: false,
    maxDistance: MAX_DISTANCE, // Reset to default
    searchTerm: ''
  });
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
  activities = [], 
  searchTerm = '', 
  filterAudience = [], 
  filterCost = [], 
  filterDays = [], 
  isOneOff = false, 
  maxDistance, 
  userLocation 
}) {
  const searchTokens = searchTerm.toLowerCase().split(' ').filter(Boolean);

  return activities.map(activity => {
    // Calculate distance if userLocation exists and activity has coordinates
    if (userLocation && activity.lat && activity.long) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.long,
        activity.lat,
        activity.long
      );
      activity.distance = distance; // Update the activity object with the new distance
    }

    const name = activity.name || '';
    const description = activity.description || '';
    const venue = activity.venue || '';
    const organiser = activity.organiser || '';

    // Search term matching
    const matchesSearch = searchTokens.length === 0 || searchTokens.some(token =>
      name.toLowerCase().includes(token) ||
      description.toLowerCase().includes(token) ||
      venue.toLowerCase().includes(token) ||
      organiser.toLowerCase().includes(token)
    );

    // Audience matching: only check if there are selected audiences
    const matchesAudience = filterAudience.length === 0 || filterAudience.includes(activity.audience);
    
    // Cost matching: only check if there are selected cost types
    const costType = getCostType(activity.cost);
    const matchesCost = filterCost.length === 0 || filterCost.includes(costType);

    // Day matching: only check if there are selected days
    const matchesDay = filterDays.length === 0 || filterDays.some(day => activity.daysOfWeek.includes(day));

    // One-off event matching: only apply if `isOneOff` is true
    const matchesOneOff = !isOneOff || (activity.timePeriod === 'One-off Event' || activity.timePeriod === 'Other (non-repeating)');

    // Distance matching: check if activity.distance is within the maxDistance
    const matchesDistance = 
      maxDistance >= MAX_DISTANCE || 
      maxDistance === null ||
      activity.distance == null || 
      (activity.distance != null && activity.distance <= maxDistance);

    return matchesSearch && matchesAudience && matchesCost && matchesDay && matchesOneOff && matchesDistance
      ? activity
      : null; // Exclude activities that don't match all filters
  }).filter(Boolean); // Remove nulls
}



  