import React from "react";
import { Link } from "react-router-dom";
import "./headerStyle.css";
import { GOOGLE_FORM_INPUT_LINK, GOOGLE_FORM_SUGGESTION_LINK} from "./constants";

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to={GOOGLE_FORM_INPUT_LINK} className="nav-link">
          Submit Activity
        </Link>
        <Link to={GOOGLE_FORM_SUGGESTION_LINK} className="nav-link">
          Suggestions
        </Link>
      </nav>
    </header>
  );
}

export default Header;
