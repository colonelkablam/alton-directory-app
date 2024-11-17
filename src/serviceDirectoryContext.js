import React, { createContext, useState, useMemo } from "react";
import { MAX_DISTANCE } from "./constants";

export const ServiceDirectoryContext = createContext();

export const ServiceDirectoryProvider = ({ children }) => {
  const [filterOptions, setFilterOptions] = useState({
    audience: [],
    cost: [],
    days: [],
    isOneOff: false,
    maxDistance: MAX_DISTANCE, // default to MAX_DISTANCE
    searchTerm: "",
    postcode: "",
  });

  const [pinnedActivities, setPinnedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("days");
  const [showFilters, setShowFilters] = useState(false);
  const [distanceEnabled, setDistanceEnabled] = useState(false);

  const value = useMemo(
    () => ({
      filterOptions,
      setFilterOptions,
      pinnedActivities,
      setPinnedActivities,
      showFilters,
      setShowFilters,
      distanceEnabled,
      setDistanceEnabled,
      activeTab,
      setActiveTab,
    }),
    [filterOptions, pinnedActivities, showFilters, distanceEnabled, activeTab]
  );

  return (
    <ServiceDirectoryContext.Provider value={value}>
      {children}
    </ServiceDirectoryContext.Provider>
  );
};
