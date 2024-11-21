import React, { createContext, useState, useMemo } from "react";
import { MAX_DISTANCE } from "./constants";

export const ServiceDirectoryContext = createContext();

export const ServiceDirectoryProvider = ({ children }) => {
  const [filterOptions, setFilterOptions] = useState({
    audience: [],
    cost: [],
    days: [],
    isOneOff: false,
    noSetDay: false,
    maxDistance: MAX_DISTANCE,
    searchTerm: "",
    postcode: "",
  });

  const [pinnedActivities, setPinnedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("days");
  const [showFilters, setShowFilters] = useState(false);
  const [distanceEnabled, setDistanceEnabled] = useState(false);
  const [activities, setActivities] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [postcodeIsValid, setPostcodeIsValid] = useState(null);

  const value = useMemo(
    () => ({
      filterOptions,
      setFilterOptions,
      pinnedActivities,
      setPinnedActivities,
      activeTab,
      setActiveTab,
      showFilters,
      setShowFilters,
      distanceEnabled,
      setDistanceEnabled,
      activities,
      setActivities,
      userLocation,
      setUserLocation,
      postcodeIsValid,
      setPostcodeIsValid,
    }),
    [
      filterOptions,
      pinnedActivities,
      activeTab,
      showFilters,
      distanceEnabled,
      activities,
      userLocation,
      postcodeIsValid,
    ]
  );

  return (
    <ServiceDirectoryContext.Provider value={value}>
      {children}
    </ServiceDirectoryContext.Provider>
  );
};
