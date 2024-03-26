import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable({ loadDashboard }) {
	const history = useHistory();
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		table_name: "",
		capacity: 1,
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
		const abortController = new AbortController();

		if (validateFields()) {
			createTable(formData, abortController.signal)
				.then(loadDashboard)
				.then(() => history.push(`/dashboard`))
				.catch(setError);
		}

		return () => abortController.abort();
	}

	function validateFields() {
		let foundError = null;

		if (formData.table_name === "" || formData.capacity === "") {
			foundError = {
				message:
					"Invalid form: table name & capacity must be provided to create table",
			};
		} else if (formData.table_name.length < 2) {
			foundError = {
				message:
					"Invalid table name: table name must contain at least two characters",
			};
		}

		setError(foundError);
		return foundError === null;
	}

	return (
		<div className="container pt-5">
			<main>
				<h2 className="font-weight-bold text-center mt-4 mb-4">New Table</h2>

				<div className="d-flex justify-content-center">
					<form className="font-weight-bold w-75">
						{error && <ErrorAlert error={error} />}

						<div className="mb-3">
							<label htmlFor="table_name" className="form-label">
								Table Name
							</label>
							<input
								type="text"
								className="form-control"
								id="table_name"
								name="table_name"
								value={formData.table_name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="capacity" className="form-label">
								Capacity
							</label>
							<input
								type="number"
								className="form-control"
								id="capacity"
								name="capacity"
								value={formData.capacity}
								onChange={handleChange}
								min="1"
								required
							/>
						</div>

						<div className="d-flex justify-content-center">
							<button
								type="submit"
								className="btn rounded btn-success btn-outline-success m-1 text-white"
								onClick={handleSubmit}
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
