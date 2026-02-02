import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation } from "../utils/api";
import { Icons } from "../components/Icons";

/**
 * Lumière - New/Edit Reservation Form
 * Premium glass card form with modern inputs
 */
export default function NewReservation({
	edit,
	loadDashboard,
	formData,
	setFormData,
}) {
	const history = useHistory();
	const { reservation_id } = useParams();
	const [errors, setErrors] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function handleChange({ target }) {
		setFormData({
			...formData,
			[target.name]:
				target.name === "people" ? Number(target.value) : target.value,
		});
	}

	function onSubmit(event) {
		event.preventDefault();
		setIsSubmitting(true);
		const abortController = new AbortController();
		formData.people = Number(formData.people);

		const action = edit
			? editReservation(reservation_id, formData, abortController.signal)
			: createReservation(formData, abortController.signal);

		action
			.then(loadDashboard)
			.then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
			.catch((errors) => {
				setErrors(errors);
				setIsSubmitting(false);
			});

		return () => abortController.abort();
	}

	return (
		<div className="animate-fade-in-up">
			{/* Page Header */}
			<div className="page-title">
				<h1>
					{edit ? (
						<>
							Edit <span style={{
								background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text'
							}}>Reservation</span>
						</>
					) : (
						<>
							New <span style={{
								background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text'
							}}>Reservation</span>
						</>
					)}
				</h1>
				<p>
					{edit
						? "Update the reservation details below"
						: "Fill in the details to create a new reservation"}
				</p>
			</div>

			{/* Form Card */}
			<div className="form-card">
				{errors && <ErrorAlert error={errors} />}

				<form onSubmit={onSubmit}>
					{/* Guest Information */}
					<div style={{ marginBottom: 'var(--space-8)' }}>
						<h3 style={{
							fontSize: 'var(--text-sm)',
							fontWeight: 'var(--font-semibold)',
							color: 'var(--color-gold-400)',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
							marginBottom: 'var(--space-4)'
						}}>
							Guest Information
						</h3>

						<div className="form-row">
							<div className="form-group">
								<label htmlFor="first_name" className="form-label">
									First Name
								</label>
								<input
									type="text"
									className="form-input"
									id="first_name"
									name="first_name"
									placeholder="John"
									value={formData.first_name}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="last_name" className="form-label">
									Last Name
								</label>
								<input
									type="text"
									className="form-input"
									id="last_name"
									name="last_name"
									placeholder="Doe"
									value={formData.last_name}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="mobile_number" className="form-label">
								<Icons.Phone size={14} style={{
									display: 'inline',
									marginRight: 'var(--space-2)',
									verticalAlign: 'middle'
								}} />
								Mobile Number
							</label>
							<input
								type="tel"
								className="form-input"
								id="mobile_number"
								name="mobile_number"
								placeholder="555-555-5555"
								value={formData.mobile_number}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					{/* Reservation Details */}
					<div style={{ marginBottom: 'var(--space-8)' }}>
						<h3 style={{
							fontSize: 'var(--text-sm)',
							fontWeight: 'var(--font-semibold)',
							color: 'var(--color-gold-400)',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
							marginBottom: 'var(--space-4)'
						}}>
							Reservation Details
						</h3>

						<div className="form-row">
							<div className="form-group">
								<label htmlFor="reservation_date" className="form-label">
									<Icons.Calendar size={14} style={{
										display: 'inline',
										marginRight: 'var(--space-2)',
										verticalAlign: 'middle'
									}} />
									Date
								</label>
								<input
									type="date"
									className="form-input"
									id="reservation_date"
									name="reservation_date"
									value={formData.reservation_date}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="reservation_time" className="form-label">
									<Icons.Clock size={14} style={{
										display: 'inline',
										marginRight: 'var(--space-2)',
										verticalAlign: 'middle'
									}} />
									Time
								</label>
								<input
									type="time"
									className="form-input"
									id="reservation_time"
									name="reservation_time"
									value={formData.reservation_time}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="people" className="form-label">
								<Icons.Users size={14} style={{
									display: 'inline',
									marginRight: 'var(--space-2)',
									verticalAlign: 'middle'
								}} />
								Party Size
							</label>
							<input
								type="number"
								className="form-input"
								id="people"
								name="people"
								min="1"
								placeholder="2"
								value={formData.people}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					{/* Form Actions */}
					<div className="form-actions">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={history.goBack}
							disabled={isSubmitting}
						>
							<Icons.X size={18} />
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
									Saving...
								</>
							) : (
								<>
									<Icons.Check size={18} />
									{edit ? "Update Reservation" : "Create Reservation"}
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
