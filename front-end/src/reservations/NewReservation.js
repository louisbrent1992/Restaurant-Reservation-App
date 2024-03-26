import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation } from "../utils/api";

export default function NewReservation({
	edit,
	loadDashboard,
	formData,
	setFormData,
}) {
	const history = useHistory();
	const { reservation_id } = useParams();
	const [errors, setErrors] = useState(null);

	function handleChange({ target }) {
		setFormData({
			...formData,
			[target.name]:
				target.name === "people" ? Number(target.value) : target.value,
		});
	}

	function onSubmit(event) {
		event.preventDefault();
		const abortController = new AbortController();
		formData.people = Number(formData.people);
		if (edit) {
			editReservation(reservation_id, formData, abortController.signal)
				.then(loadDashboard)
				.then(() =>
					history.push(`/dashboard?date=${formData.reservation_date}`)
				)
				.catch((errors) => setErrors(errors));
		} else {
			createReservation(formData, abortController.signal)
				.then(loadDashboard)
				.then(() =>
					history.push(`/dashboard?date=${formData.reservation_date}`)
				)
				.catch((errors) => setErrors(errors));
		}
		return () => abortController.abort();
	}

	return (
		<div className="container pt-5">
			<main>
				<h2 className="font-weight-bold text-center mt-4 mb-4 fs-4">
					{edit ? "Edit Reservation" : "New Reservation"}
				</h2>

				<div className="d-flex justify-content-center">
					<form className="font-weight-bold w-75">
						{errors && <ErrorAlert error={errors} />}

						<div className="mb-3">
							<label htmlFor="first_name" className="form-label fs-6">
								First Name
							</label>
							<input
								type="text"
								className="form-control"
								id="first_name"
								name="first_name"
								value={formData.first_name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="last_name" className="form-label fs-6">
								Last Name
							</label>
							<input
								type="text"
								className="form-control"
								id="last_name"
								name="last_name"
								value={formData.last_name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="mobile_number" className="form-label fs-6">
								Mobile Number
							</label>
							<input
								type="text"
								className="form-control"
								id="mobile_number"
								name="mobile_number"
								value={formData.mobile_number}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="reservation_date" className="form-label fs-6">
								Reservation Date
							</label>
							<input
								type="date"
								className="form-control"
								id="reservation_date"
								name="reservation_date"
								value={formData.reservation_date}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="reservation_time" className="form-label fs-6">
								Reservation Time
							</label>
							<input
								type="time"
								className="form-control"
								id="reservation_time"
								name="reservation_time"
								value={formData.reservation_time}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="people" className="form-label fs-6">
								Party Size
							</label>
							<input
								type="number"
								className="form-control"
								id="people"
								name="people"
								value={formData.people}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="d-flex justify-content-center">
							<button
								type="submit"
								className="btn rounded btn-success btn-outline-success m-1 text-white"
								onClick={onSubmit}
							>
								Submit
							</button>
							<button
								className="btn rounded btn-secondary m-1 text-white "
								type="button"
								onClick={history.goBack}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
