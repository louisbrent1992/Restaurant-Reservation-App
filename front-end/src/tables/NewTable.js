import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import { Icons } from "../components/Icons";

/**
 * Lumière - New Table Form
 * Premium glass card form for adding restaurant tables
 */
export default function NewTable({ loadDashboard }) {
	const history = useHistory();
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		table_name: "",
		capacity: 2,
	});

	function handleChange({ target }) {
		setFormData({
			...formData,
			[target.name]:
				target.name === "capacity" ? Number(target.value) : target.value,
		});
	}

	function handleSubmit(event) {
		event.preventDefault();
		setIsSubmitting(true);
		const abortController = new AbortController();

		if (validateFields()) {
			createTable(formData, abortController.signal)
				.then(loadDashboard)
				.then(() => history.push(`/dashboard`))
				.catch((err) => {
					setError(err);
					setIsSubmitting(false);
				});
		} else {
			setIsSubmitting(false);
		}

		return () => abortController.abort();
	}

	function validateFields() {
		let foundError = null;

		if (formData.table_name === "" || formData.capacity === "") {
			foundError = {
				message: "Please provide both table name and capacity.",
			};
		} else if (formData.table_name.length < 2) {
			foundError = {
				message: "Table name must contain at least 2 characters.",
			};
		}

		setError(foundError);
		return foundError === null;
	}

	// Capacity presets
	const capacityPresets = [2, 4, 6, 8];

	return (
		<div className="animate-fade-in-up">
			{/* Page Header */}
			<div className="page-title">
				<h1>
					New <span style={{
						background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text'
					}}>Table</span>
				</h1>
				<p>Add a new table to your restaurant floor</p>
			</div>

			{/* Form Card */}
			<div className="form-card">
				{error && <ErrorAlert error={error} />}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="table_name" className="form-label">
							<Icons.Table size={14} style={{
								display: 'inline',
								marginRight: 'var(--space-2)',
								verticalAlign: 'middle'
							}} />
							Table Name
						</label>
						<input
							type="text"
							className="form-input"
							id="table_name"
							name="table_name"
							placeholder="e.g., Bar #1, Patio Table, VIP Booth"
							value={formData.table_name}
							onChange={handleChange}
							required
						/>
						<p style={{
							marginTop: 'var(--space-2)',
							fontSize: 'var(--text-xs)',
							color: 'var(--color-dark-500)'
						}}>
							Use a descriptive name to easily identify the table
						</p>
					</div>

					<div className="form-group">
						<label htmlFor="capacity" className="form-label">
							<Icons.Users size={14} style={{
								display: 'inline',
								marginRight: 'var(--space-2)',
								verticalAlign: 'middle'
							}} />
							Seating Capacity
						</label>

						{/* Capacity Quick Select */}
						<div style={{
							display: 'flex',
							gap: 'var(--space-3)',
							marginBottom: 'var(--space-4)'
						}}>
							{capacityPresets.map((preset) => (
								<button
									key={preset}
									type="button"
									onClick={() => setFormData({ ...formData, capacity: preset })}
									style={{
										width: '52px',
										height: '52px',
										borderRadius: 'var(--radius-lg)',
										background: formData.capacity === preset
											? 'var(--gradient-gold)'
											: 'rgba(255, 255, 255, 0.03)',
										border: formData.capacity === preset
											? 'none'
											: '1px solid rgba(255, 255, 255, 0.1)',
										color: formData.capacity === preset
											? 'var(--color-dark-900)'
											: 'var(--color-dark-300)',
										fontSize: 'var(--text-lg)',
										fontWeight: 'var(--font-semibold)',
										cursor: 'pointer',
										transition: 'all var(--transition-base)'
									}}
								>
									{preset}
								</button>
							))}
						</div>

						<input
							type="number"
							className="form-input"
							id="capacity"
							name="capacity"
							value={formData.capacity}
							onChange={handleChange}
							min="1"
							max="20"
							required
						/>
						<p style={{
							marginTop: 'var(--space-2)',
							fontSize: 'var(--text-xs)',
							color: 'var(--color-dark-500)'
						}}>
							Maximum number of guests this table can accommodate
						</p>
					</div>

					{/* Visual Preview */}
					<div style={{
						background: 'rgba(255, 255, 255, 0.02)',
						borderRadius: 'var(--radius-xl)',
						padding: 'var(--space-6)',
						textAlign: 'center',
						marginBottom: 'var(--space-8)',
						border: '1px solid rgba(255, 255, 255, 0.05)'
					}}>
						<p style={{
							fontSize: 'var(--text-xs)',
							color: 'var(--color-dark-500)',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
							marginBottom: 'var(--space-4)'
						}}>
							Preview
						</p>
						<div style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 'var(--space-4)',
							padding: 'var(--space-4) var(--space-6)',
							background: 'rgba(245, 158, 11, 0.1)',
							borderRadius: 'var(--radius-lg)',
							border: '1px solid rgba(245, 158, 11, 0.2)'
						}}>
							<Icons.Table size={24} style={{ color: 'var(--color-gold-400)' }} />
							<div style={{ textAlign: 'left' }}>
								<div style={{
									fontWeight: 'var(--font-semibold)',
									color: 'var(--color-dark-100)'
								}}>
									{formData.table_name || 'Table Name'}
								</div>
								<div style={{
									fontSize: 'var(--text-sm)',
									color: 'var(--color-dark-400)'
								}}>
									{formData.capacity} {formData.capacity === 1 ? 'seat' : 'seats'}
								</div>
							</div>
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
									Creating...
								</>
							) : (
								<>
									<Icons.Plus size={18} />
									Create Table
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
