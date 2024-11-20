import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceDirectory from "./serviceDirectory";
import DetailedActivityCard from "./detailedActivityCard";
import { ServiceDirectoryProvider } from "./serviceDirectoryContext";
import About from "./about";
import SubmitActivity from "./submitActivity";
import SuggestionsBox from "./suggestionsBox";

function App() {
  return (
    <ServiceDirectoryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ServiceDirectory />} />
          <Route path="/activity/:id" element={<DetailedActivityCard />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit-activity" element={<SubmitActivity />} />
          <Route path="/suggestions" element={<SuggestionsBox />} />
        </Routes>
      </Router>
    </ServiceDirectoryProvider>
  );
}

export default App;
