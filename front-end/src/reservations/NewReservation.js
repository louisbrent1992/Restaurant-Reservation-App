import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {
  createReservation,
  editReservation,
} from "../utils/api";

export default function NewReservation({
  edit,
  loadDashboard,
  formData,
  setFormData,
}) {
  const history = useHistory();

  const { reservation_id } = useParams();
  const [errors, setErrors] = useState(null);

  /** updates the state of the form when the user makes any changes to it */
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "people" ? Number(target.value) : target.value,
    });
  }

  /** if a reservation was created or edited, clicking the "submit" button will do the following:
   * save the reservation
   * display the previous page
   */
  function onSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    formData.people = Number(formData.people);
    if (edit) {
      editReservation(reservation_id, formData, abortController.signal)
        .then(setFormData(formData))
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

  /** displays the reservation form to the user */
  return (
    <div style={{ fontFamily: "Rubik" }}>
      <h2 className="font-weight-bold d-flex justify-content-center mt-4">
        {edit ? "Edit Reservation" : "New Reservation"}
      </h2>
      <div className="d-flex justify-content-center">
        <form className="font-weight-bold mt-3 m-3 w-75">
          {errors && <ErrorAlert error={errors} />}
          <label className="form-label" htmlFor="first_name">
            First Name
          </label>
          <input
            name="first_name"
            id="first_name"
            className="form-control mb-3 border-dark"
            type="text"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
          <label className="form-label" htmlFor="last_name">
            Last Name
          </label>
          <input
            name="last_name"
            id="last_name"
            className="form-control mb-3 border-dark"
            type="text"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
          <label className="form-label" htmlFor="mobile_number">
            Mobile Number
          </label>
          <input
            className="form-control mb-3 border-dark"
            name="mobile_number"
            id="mobile_number"
            type="text"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />

          <label className="form-label" htmlFor="reservation_date">
            Reservation Date
          </label>
          <input
            name="reservation_date"
            id="reservation_date"
            type="date"
            className="form-control mb-3 border-dark"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
          <label className="form-label" htmlFor="reservation_time">
            Reservation Time
          </label>
          <input
            name="reservation_time"
            id="reservation_time"
            className="form-control mb-3 border-dark"
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
          <label className="form-label" htmlFor="people">
            Party Size
          </label>
          <input
            name="people"
            id="people"
            className="form-control mb-3 border-dark"
            type="number"
            min="1"
            onChange={handleChange}
            value={formData.people}
            required
          />
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-outline-0 btn-success border-dark m-1"
              // style={{color: "white"}}
              type="submit"
              onClick={onSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-danger m-1"
              type="button"
              onClick={history.goBack}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
