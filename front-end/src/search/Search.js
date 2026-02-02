import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ListReservations from "../dashboard/ListReservations";
import { Icons } from "../components/Icons";

/**
 * Lumière - Search Component
 * Premium search interface with phone number lookup
 */
export default function Search() {
	const [mobileNumber, setMobileNumber] = useState("");
	const [reservations, setReservations] = useState([]);
	const [error, setError] = useState(null);
	const [hasSearched, setHasSearched] = useState(false);
	const [isSearching, setIsSearching] = useState(false);

	function handleChange({ target }) {
		setMobileNumber(target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();
		setIsSearching(true);
		setHasSearched(true);
		const abortController = new AbortController();
		setError(null);

		listReservations({ mobile_number: mobileNumber }, abortController.signal)
			.then((data) => {
				setReservations(data);
				setIsSearching(false);
			})
			.catch((err) => {
				setError(err);
				setIsSearching(false);
			});

		return () => abortController.abort();
	}

	return (
		<div className="animate-fade-in-up">
			{/* Page Header */}
			<div className="page-title">
				<h1>
					Search <span style={{
						background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text'
					}}>Reservations</span>
				</h1>
				<p>Find reservations by customer phone number</p>
			</div>

			{/* Search Form */}
			<div style={{
				maxWidth: '600px',
				margin: '0 auto var(--space-10)'
			}}>
				{error && <ErrorAlert error={error} />}

				<form onSubmit={handleSubmit}>
					<div className="search-container" style={{ maxWidth: '100%' }}>
						<Icons.Search
							size={20}
							className="search-icon"
						/>
						<input
							className="search-input"
							name="mobile_number"
							id="mobile_number"
							type="tel"
							placeholder="Enter customer's phone number..."
							onChange={handleChange}
							value={mobileNumber}
							required
							style={{ paddingRight: '120px' }}
						/>
						<button
							className="btn btn-primary search-btn"
							type="submit"
							disabled={isSearching || !mobileNumber}
							style={{
								position: 'absolute',
								right: 'var(--space-2)',
								top: '50%',
								transform: 'translateY(-50%)'
							}}
						>
							{isSearching ? (
								<>
									<div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
								</>
							) : (
								<>
									<Icons.Search size={16} />
									Search
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			{/* Search Results */}
			{hasSearched && (
				<div className="glass-card animate-fade-in-up">
					<div className="section-header">
						<h2 className="section-title">
							<div className="section-title-icon">
								<Icons.Search size={20} />
							</div>
							Search Results
						</h2>
						<span style={{
							fontSize: 'var(--text-sm)',
							color: 'var(--color-dark-400)'
						}}>
							{reservations.length} {reservations.length === 1 ? 'result' : 'results'} found
						</span>
					</div>

					{reservations.length > 0 ? (
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
									{reservations.map((reservation, index) => (
										<ListReservations
											key={reservation.reservation_id}
											reservation={reservation}
											animationDelay={index * 50}
										/>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="empty-state">
							<div className="empty-state-icon">
								<Icons.Search size={40} />
							</div>
							<h3 className="empty-state-title">No reservations found</h3>
							<p className="empty-state-text">
								No reservations match the phone number "{mobileNumber}"
							</p>
						</div>
					)}
				</div>
			)}

			{/* Initial State */}
			{!hasSearched && (
				<div className="glass-card" style={{ textAlign: 'center' }}>
					<div className="empty-state">
						<div className="empty-state-icon" style={{
							background: 'rgba(245, 158, 11, 0.1)',
							color: 'var(--color-gold-400)'
						}}>
							<Icons.Phone size={40} />
						</div>
						<h3 className="empty-state-title">Search by Phone Number</h3>
						<p className="empty-state-text">
							Enter a customer's phone number above to find their reservations
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
