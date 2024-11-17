import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceDirectory from "./serviceDirectory";
import DetailedActivityCard from "./detailedActivityCard";
import { ServiceDirectoryProvider } from "./serviceDirectoryContext";

function App() {
  return (
    <ServiceDirectoryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ServiceDirectory />} />
          <Route path="/activity/:id" element={<DetailedActivityCard />} />
        </Routes>
      </Router>
    </ServiceDirectoryProvider>
  );
}

export default App;
