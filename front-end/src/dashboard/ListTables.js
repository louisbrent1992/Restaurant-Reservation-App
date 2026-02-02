import React from "react";
import { finishTable } from "../utils/api";
import { Icons } from "../components/Icons";

/**
 * Lumière - Table List Item
 * Modern table row with capacity indicators and status badges
 */
export default function ListTables({ table, loadDashboard, animationDelay = 0 }) {
  if (!table) return null;

  /** Handles finishing a seated table */
  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This action cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      finishTable(table.table_id, abortController.signal).then(loadDashboard);
      return () => abortController.abort();
    }
  }

  // Get status badge class
  const getStatusBadge = (status) => {
    return status === "free" ? "badge badge-free" : "badge badge-occupied";
  };

  // Generate capacity indicator dots
  const renderCapacityDots = (capacity) => {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[...Array(Math.min(capacity, 8))].map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-gold-400)',
              opacity: 0.6 + (i * 0.05)
            }}
          />
        ))}
        {capacity > 8 && (
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-dark-400)',
            marginLeft: '4px'
          }}>
            +{capacity - 8}
          </span>
        )}
        <span style={{
          marginLeft: 'var(--space-2)',
          color: 'var(--color-dark-300)'
        }}>
          {capacity}
        </span>
      </div>
    );
  };

  return (
    <tr
      className="animate-fade-in-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <td>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--color-gold-400)'
        }}>
          #{table.table_id}
        </span>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-lg)',
            background: table.status === 'free'
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: table.status === 'free'
              ? 'var(--color-success)'
              : 'var(--color-gold-400)'
          }}>
            <Icons.Table size={18} />
          </div>
          <span style={{
            fontWeight: 'var(--font-medium)',
            color: 'var(--color-dark-100)'
          }}>
            {table.table_name}
          </span>
        </div>
      </td>

      <td>{renderCapacityDots(table.capacity)}</td>

      <td data-table-id-status={table.table_id}>
        <span className={getStatusBadge(table.status)}>
          <span className={`status-dot ${table.status}`}></span>
          {table.status === 'free' ? 'Available' : 'Occupied'}
        </span>
      </td>

      <td>
        {table.reservation_id ? (
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--color-dark-200)'
          }}>
            #{table.reservation_id}
          </span>
        ) : (
          <span style={{ color: 'var(--color-dark-500)' }}>—</span>
        )}
      </td>

      <td>
        {table.status === "occupied" ? (
          <button
            className="btn btn-danger btn-sm"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
            type="button"
          >
            <Icons.Check size={14} />
            Finish
          </button>
        ) : (
          <span style={{ color: 'var(--color-dark-500)' }}>—</span>
        )}
      </td>
    </tr>
  );
}
