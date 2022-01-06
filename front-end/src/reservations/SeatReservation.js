import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the reservation/:reservation_id/seat page.
 * Makes an API call to seat a reservation and update the seated table
 * @returns {JSX.Element}
 * Header and seat form
 */

function SeatReservation({ tables, setTables }) {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [tableId, setTableId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }, [setTables]);

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal).catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

  function changeHandler({ target: { value } }) {
    setTableId(value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateTable(tableId, reservation_id)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {`${table.table_name} - ${table.capacity}`}
    </option>
  ));

  return (
    <div>
      <h1 className="text-center my-4">Seat Reservation #{reservation_id}</h1>
      { error && <ErrorAlert error={error} />}
      <form onSubmit={handleSubmit}>
        <div className="form-row justify-content-center">
          <div className="form-group col-4">
            <label htmlFor="seat_reservation"></label>
            <select
              id="table_id"
              name="table_id"
              onChange={changeHandler}
              required
              className="form-control"
            >
              <option value="">Select a table</option>
              {tableOptions}
            </select>
          </div>
        </div>

        <div className="row justify-content-md-center">
          <button
            className="btn btn-success m-1"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-danger m-1"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeatReservation;
