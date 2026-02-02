import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";

/**
 * Lumière - 404 Not Found Page
 * Premium styled error page
 */
function NotFound() {
  return (
    <div className="animate-fade-in-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: 'var(--space-8)'
    }}>
      {/* 404 Display */}
      <h1 style={{
        fontSize: 'clamp(80px, 20vw, 180px)',
        fontWeight: 'var(--font-extrabold)',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
        marginBottom: 'var(--space-4)'
      }}>
        404
      </h1>

      <h2 style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--color-dark-100)',
        marginBottom: 'var(--space-4)'
      }}>
        Page Not Found
      </h2>

      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-dark-400)',
        maxWidth: '400px',
        marginBottom: 'var(--space-10)'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/dashboard">
        <button className="btn btn-primary btn-lg">
          <Icons.Dashboard size={20} />
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
