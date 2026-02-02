import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Icons } from "../components/Icons";

/**
 * Lumière - Seat Reservation Component
 * Premium table selection interface
 */
function SeatReservation({ tables, setTables }) {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [tableId, setTableId] = useState("");
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }, [setTables]);

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

  function changeHandler({ target: { value } }) {
    setTableId(value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    updateTable(tableId, reservation_id)
      .then(() => history.push(`/dashboard`))
      .catch((err) => {
        setError(err);
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    history.goBack();
  };

  // Filter available tables
  const availableTables = tables.filter(t => t.status === 'free');

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-title">
        <h1>
          Seat <span style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Reservation</span>
        </h1>
        <p>Select a table for reservation #{reservation_id}</p>
      </div>

      {/* Reservation Info Card */}
      {reservation && (
        <div className="glass-card" style={{
          maxWidth: '600px',
          margin: '0 auto var(--space-8)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold-400)'
            }}>
              <Icons.User size={28} />
            </div>
            <div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-dark-100)',
                marginBottom: 'var(--space-1)'
              }}>
                {reservation.first_name} {reservation.last_name}
              </h3>
              <div style={{
                display: 'flex',
                gap: 'var(--space-6)',
                color: 'var(--color-dark-400)',
                fontSize: 'var(--text-sm)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Icons.Users size={14} />
                  {reservation.people} guests
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Icons.Clock size={14} />
                  {reservation.reservation_time?.substr(0, 5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="form-card">
        {error && <ErrorAlert error={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="table_id" className="form-label">
              <Icons.Table size={14} style={{
                display: 'inline',
                marginRight: 'var(--space-2)',
                verticalAlign: 'middle'
              }} />
              Select Table
            </label>
            <select
              id="table_id"
              name="table_id"
              onChange={changeHandler}
              value={tableId}
              required
              className="form-select"
            >
              <option value="">Choose an available table...</option>
              {availableTables.map((table) => (
                <option key={table.table_id} value={table.table_id}>
                  {table.table_name} — Capacity: {table.capacity}
                </option>
              ))}
            </select>

            {availableTables.length === 0 && (
              <p style={{
                marginTop: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-warning)'
              }}>
                No tables are currently available.
              </p>
            )}
          </div>

          {/* Table Preview Cards */}
          {availableTables.length > 0 && (
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-dark-400)',
                marginBottom: 'var(--space-4)'
              }}>
                Available tables:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 'var(--space-3)'
              }}>
                {availableTables.map((table) => (
                  <button
                    key={table.table_id}
                    type="button"
                    onClick={() => setTableId(table.table_id.toString())}
                    style={{
                      padding: 'var(--space-4)',
                      background: tableId === table.table_id.toString()
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: tableId === table.table_id.toString()
                        ? '2px solid var(--color-gold-500)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all var(--transition-base)'
                    }}
                  >
                    <Icons.Table
                      size={24}
                      style={{
                        color: tableId === table.table_id.toString()
                          ? 'var(--color-gold-400)'
                          : 'var(--color-dark-400)',
                        marginBottom: 'var(--space-2)'
                      }}
                    />
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-dark-100)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {table.table_name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-dark-400)'
                    }}>
                      {table.capacity} seats
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <Icons.X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting || !tableId}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
                  Seating...
                </>
              ) : (
                <>
                  <Icons.Check size={18} />
                  Seat Guest
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SeatReservation;
