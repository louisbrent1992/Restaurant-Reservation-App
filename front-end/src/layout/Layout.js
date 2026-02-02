import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import "../styles/index.css";

/**
 * Lumière - Main Layout Component
 * Modern restaurant reservation system layout with premium dark theme
 */
function Layout() {
  return (
    <div className="app-layout">
      <Menu />
      <main className="main-content animate-fade-in">
        <Routes />
      </main>
    </div>
  );
}

export default Layout;
