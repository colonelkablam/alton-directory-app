import React from "react";
import { Link, useLocation  } from "react-router-dom";
import "./headerStyle.css";
import { GOOGLE_FORM_INPUT_LINK, GOOGLE_FORM_SUGGESTION_LINK} from "./constants";

function Header() {

  const location = useLocation(); // Get the current URL

  const isActive = (path) => location.pathname === path; // Check if the path matches the current URL

  return (
    <header className="header">
      <nav className="nav">
        <Link
          to="/" 
          className={`nav-link ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${isActive("/about") ? "active" : ""}`}
        >
          About
        </Link>
        <Link 
          to={GOOGLE_FORM_INPUT_LINK} className="nav-link"
        >
          Submit Activity
        </Link>
        <Link
          to={GOOGLE_FORM_SUGGESTION_LINK} className="nav-link"
        >
          Suggestions
        </Link>
      </nav>
    </header>
  );
}

export default Header;
