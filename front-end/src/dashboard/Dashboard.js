import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import ListTables from "./ListTables";
import ListReservations from "./ListReservations";
import { Icons } from "../components/Icons";

/**
 * Lumière - Dashboard Component
 * Premium reservation dashboard with modern glass card design
 */
function Dashboard({ date, reservations, tables, loadDashboard }) {
	const history = useHistory();

	// Filter active reservations
	const activeReservations = reservations.filter(
		(r) => r.status !== "finished" && r.status !== "cancelled"
	);

	// Calculate stats
	const totalGuests = activeReservations.reduce((sum, r) => sum + r.people, 0);
	const seatedCount = activeReservations.filter(r => r.status === "seated").length;
	const availableTables = tables.filter(t => t.status === "free").length;

	// Format date for display
	const formatDate = (dateStr) => {
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
	};

	function handleClick({ target }) {
		let newDate;
		let useDate = date || today();

		if (target.name === "previous") {
			newDate = previous(useDate);
		} else if (target.name === "next") {
			newDate = next(useDate);
		} else {
			newDate = today();
		}

		history.push(`/dashboard?date=${newDate}`);
	}

	return (
		<div className="animate-fade-in-up">
			{/* Hero Section */}
			<div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
				<h1 style={{
					fontSize: 'var(--text-4xl)',
					fontWeight: 'var(--font-bold)',
					color: 'var(--color-dark-100)',
					marginBottom: 'var(--space-4)'
				}}>
					Welcome to <span style={{
						background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text'
					}}>Lumière</span>
				</h1>
				<p style={{
					fontSize: 'var(--text-lg)',
					color: 'var(--color-dark-400)',
					maxWidth: '600px',
					margin: '0 auto'
				}}>
					Your premium reservation management dashboard
				</p>
			</div>

			{/* Date Navigation */}
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				marginBottom: 'var(--space-10)'
			}}>
				<div className="date-nav">
					<button
						className="date-nav-btn"
						type="button"
						name="previous"
						onClick={handleClick}
						aria-label="Previous day"
					>
						<Icons.ChevronLeft size={20} style={{ pointerEvents: 'none' }} />
					</button>

					<div className="date-display">{formatDate(date)}</div>

					<button
						className="date-nav-btn"
						type="button"
						name="next"
						onClick={handleClick}
						aria-label="Next day"
					>
						<Icons.ChevronRight size={20} style={{ pointerEvents: 'none' }} />
					</button>

					<button
						className="date-today-btn"
						type="button"
						name="today"
						onClick={handleClick}
					>
						Today
					</button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="stats-grid">
				<div className="stat-card animate-fade-in-up stagger-1">
					<div className="stat-icon">
						<Icons.Calendar size={24} />
					</div>
					<div className="stat-value">{activeReservations.length}</div>
					<div className="stat-label">Reservations</div>
				</div>

				<div className="stat-card animate-fade-in-up stagger-2">
					<div className="stat-icon">
						<Icons.Users size={24} />
					</div>
					<div className="stat-value">{totalGuests}</div>
					<div className="stat-label">Expected Guests</div>
				</div>

				<div className="stat-card animate-fade-in-up stagger-3">
					<div className="stat-icon">
						<Icons.CheckCircle size={24} />
					</div>
					<div className="stat-value">{seatedCount}</div>
					<div className="stat-label">Currently Seated</div>
				</div>

				<div className="stat-card animate-fade-in-up stagger-4">
					<div className="stat-icon">
						<Icons.Table size={24} />
					</div>
					<div className="stat-value">{availableTables}</div>
					<div className="stat-label">Available Tables</div>
				</div>
			</div>

			{/* Reservations Section */}
			<div className="glass-card" style={{ marginBottom: 'var(--space-8)' }}>
				<div className="section-header">
					<h2 className="section-title">
						<div className="section-title-icon">
							<Icons.Calendar size={20} />
						</div>
						Today's Reservations
					</h2>
				</div>

				{activeReservations.length > 0 ? (
					<div className="table-responsive">
						<table className="data-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Guest</th>
									<th>Phone</th>
									<th>Date</th>
									<th>Time</th>
									<th>Party Size</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{activeReservations.map((reservation, index) => (
									<ListReservations
										key={reservation.reservation_id}
										reservation={reservation}
										loadDashboard={loadDashboard}
										animationDelay={index * 50}
									/>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="empty-state">
						<div className="empty-state-icon">
							<Icons.Inbox size={40} />
						</div>
						<h3 className="empty-state-title">No reservations</h3>
						<p className="empty-state-text">
							There are no reservations scheduled for this date.
						</p>
						<button
							className="btn btn-primary"
							onClick={() => history.push('/reservations/new')}
						>
							<Icons.Plus size={18} />
							Create Reservation
						</button>
					</div>
				)}
			</div>

			{/* Tables Section */}
			<div className="glass-card">
				<div className="section-header">
					<h2 className="section-title">
						<div className="section-title-icon">
							<Icons.Table size={20} />
						</div>
						Table Overview
					</h2>
				</div>

				{tables.length > 0 ? (
					<div className="table-responsive">
						<table className="data-table">
							<thead>
								<tr>
									<th>Table ID</th>
									<th>Name</th>
									<th>Capacity</th>
									<th>Status</th>
									<th>Reservation</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{tables.map((table, index) => (
									<ListTables
										key={table.table_id}
										table={table}
										loadDashboard={loadDashboard}
										animationDelay={index * 50}
									/>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="empty-state">
						<div className="empty-state-icon">
							<Icons.Table size={40} />
						</div>
						<h3 className="empty-state-title">No tables configured</h3>
						<p className="empty-state-text">
							Add tables to start managing your restaurant floor.
						</p>
						<button
							className="btn btn-primary"
							onClick={() => history.push('/tables/new')}
						>
							<Icons.Plus size={18} />
							Add Table
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Dashboard;
