import React from "react";
import { Icons } from "../components/Icons";

/**
 * Lumière - Error Alert Component
 * Modern styled error alert with icon
 */
function ErrorAlert({ error }) {
  if (!error) return null;

  const message = error.message ||
    (error.error ? error.error.message : "An unexpected error occurred");

  return (
    <div className="alert alert-error" role="alert">
      <div className="alert-icon">
        <Icons.AlertCircle size={20} />
      </div>
      <div className="alert-content">
        <p className="alert-title">Error</p>
        <p className="alert-message">{message}</p>
      </div>
    </div>
  );
}

export default ErrorAlert;
