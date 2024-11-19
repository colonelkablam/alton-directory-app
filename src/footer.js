import React from "react";
import "./headerStyle.css";

function Footer() {
  return (
    <footer className="footer">
    <p>
      &copy; {new Date().getFullYear() }
      <a 
        href="https://portfolio.nickharding.org/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >
        Nick Harding
      </a>
    </p>
  </footer>
  );
}

export default Footer;