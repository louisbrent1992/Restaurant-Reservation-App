import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";
import { Icons } from "../components/Icons";

/**
 * Lumière - Reservation List Item
 * Modern table row with status badges and action buttons
 */
export default function ListReservations({ reservation, loadDashboard, animationDelay = 0 }) {
  if (!reservation || reservation.status === "finished") return null;

  /** Handles reservation cancellation with confirmation */
  function handleCancel() {
    if (
      window.confirm(
        "Are you sure you want to cancel this reservation? This action cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      const reservationToCancel = reservation.reservation_id;

      updateReservationStatus(
        reservationToCancel,
        "cancelled",
        abortController.signal
      ).then(loadDashboard);

      return () => abortController.abort();
    }
  }

  // Format time for display (12-hour format)
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.substr(0, 5).split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusClasses = {
      booked: 'badge badge-booked',
      seated: 'badge badge-seated',
      finished: 'badge badge-finished',
      cancelled: 'badge badge-cancelled',
    };
    return statusClasses[status] || 'badge';
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
          #{reservation.reservation_id}
        </span>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-gold-400)'
          }}>
            <Icons.User size={18} />
          </div>
          <div>
            <div style={{
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-dark-100)'
            }}>
              {reservation.first_name} {reservation.last_name}
            </div>
          </div>
        </div>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icons.Phone size={14} style={{ color: 'var(--color-dark-500)' }} />
          {reservation.mobile_number}
        </div>
      </td>

      <td>{reservation.reservation_date.substr(0, 10)}</td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icons.Clock size={14} style={{ color: 'var(--color-dark-500)' }} />
          {formatTime(reservation.reservation_time)}
        </div>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icons.Users size={14} style={{ color: 'var(--color-dark-500)' }} />
          {reservation.people} {reservation.people === 1 ? 'guest' : 'guests'}
        </div>
      </td>

      <td data-reservation-id-status={reservation.reservation_id}>
        <span className={getStatusBadge(reservation.status)}>
          <span className={`status-dot ${reservation.status}`}></span>
          {reservation.status}
        </span>
      </td>

      <td>
        {reservation.status === "booked" && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-secondary btn-sm" type="button" title="Edit">
                <Icons.Edit size={14} />
              </button>
            </Link>

            <button
              className="btn btn-danger btn-sm"
              type="button"
              onClick={handleCancel}
              data-reservation-id-cancel={reservation.reservation_id}
              title="Cancel"
            >
              <Icons.X size={14} />
            </button>

            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-success btn-sm" type="button" title="Seat">
                <Icons.Check size={14} />
                Seat
              </button>
            </a>
          </div>
        )}
      </td>
    </tr>
  );
}
