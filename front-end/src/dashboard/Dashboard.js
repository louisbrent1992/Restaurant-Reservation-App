import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import ListTables from "./ListTables";
import ListReservations from "./ListReservations";

function Dashboard({ date, reservations, tables, loadDashboard }) {
	const history = useHistory();

	const reservationsMap = () => {
		return reservations.map(
			(reservation) =>
				reservation.status !== "finished" &&
				reservation.status !== "cancelled" && (
					<ListReservations
						key={reservation.reservation_id}
						reservation={reservation}
						loadDashboard={loadDashboard}
					/>
				)
		);
	};

	const tablesJSX = () => {
		return tables.map((table) => (
			<ListTables
				key={table.table_id}
				table={table}
				loadDashboard={loadDashboard}
			/>
		));
	};

	function handleClick({ target }) {
		let newDate;
		let useDate;

		if (!date) {
			useDate = today();
		} else {
			useDate = date;
		}

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
		<div className="container pt-5">
			<main>
				<h1 className="font-weight-bold text-center mb-4">
					Welcome to Your Reservation Dashboard
				</h1>

				<div className="d-flex justify-content-center mb-4">
					<button
						className="btn btn-outline-secondary mx-1"
						type="button"
						name="previous"
						onClick={handleClick}
					>
						Previous
					</button>
					<button
						className="btn btn-outline-success mx-1"
						type="button"
						name="today"
						onClick={handleClick}
					>
						Today
					</button>
					<button
						className="btn btn-outline-secondary mx-1"
						type="button"
						name="next"
						onClick={handleClick}
					>
						Next
					</button>
				</div>

				<h4 className="mb-4 text-start font-weight-normal">
					Today's Reservations ({date}):
				</h4>

				<div className="table-responsive">
					<table className="table table-striped table-hover">
						<thead className="thead-dark">
							<tr>
								<th scope="col">ID</th>
								<th scope="col">First Name</th>
								<th scope="col">Last Name</th>
								<th scope="col">Mobile Number</th>
								<th scope="col">Date</th>
								<th scope="col">Time</th>
								<th scope="col">People</th>
								<th scope="col">Status</th>
								<th scope="col">Edit</th>
								<th scope="col">Cancel</th>
								<th scope="col">Seat</th>
							</tr>
						</thead>
						<tbody>{reservationsMap()}</tbody>
					</table>
				</div>

				{/* Increased margin for the heading to add more space */}
				<h4 className="mb-4 font-weight-normal" style={{ marginTop: "2rem" }}>
					Current Table Status:
				</h4>

				<div className="table-responsive">
					<table className="table table-striped table-hover">
						<thead className="thead-dark">
							<tr>
								<th scope="col">Table ID</th>
								<th scope="col">Table Name</th>
								<th scope="col">Capacity</th>
								<th scope="col">Status</th>
								<th scope="col">Reservation ID</th>
								<th scope="col">Finish</th>
							</tr>
						</thead>
						<tbody>{tablesJSX()}</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

export default Dashboard;
