import React from "react";
import Header from "./header";
import { Link } from "react-router-dom";

function Info() {
  return (
    <div className="container">
      <Header />
      <div className="detailed-card">
        <h1>About this directory</h1>
        <p>This directory has been created to support with community connecting on the Alton. It includes activities found in online listings, magazines, flyers  and on social media. The information contained is not exhaustive and has not been quality assured by the providers.</p>
        <p className="bold-para">Please note: The information provided in this directory is for reference only. Users assume full responsibility for their use of  the services listed.</p>
        <p>Activities are not vetted before being added here, and this directory is not intended to be resident facing.</p> 
        <p>When using information from listings you should check directly with the provider that the activity is running on the expected day.</p> 
        <p>It is hoped that this is a resource that supports with communication and visit planning, analysing local activities to identify opportunities and gaps,  and supporting greater service access. </p> 
        <p>Queries? Please email Laura Bassett at: <p className="bold-para">&nbsp; bugbearworkshops@gmail.com</p></p>
        <Link to="/" className="nav-link">
          &lt;&lt; Home
        </Link>      
      </div>
    </div>
  );
}

export default Info;

