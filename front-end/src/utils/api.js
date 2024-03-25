const {
	REACT_APP_NODE_ENV,
	REACT_APP_API_BASE_URL_DEVELOPMENT,
	REACT_APP_API_BASE_URL_PRODUCTION,
} = process.env;

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-time";

const API_BASE_URL =
	REACT_APP_NODE_ENV === "production"
		? REACT_APP_API_BASE_URL_PRODUCTION
		: REACT_APP_API_BASE_URL_DEVELOPMENT;

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the request.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
	try {
		const response = await fetch(url, options);

		if (response.status === 204) {
			return null;
		}

		const payload = await response.json();

		if (payload.error) {
			return Promise.reject({ message: payload.error });
		}
		return payload.data;
	} catch (error) {
		if (error.name !== "AbortError") {
			console.error(error.stack);
			throw error;
		}
		return Promise.resolve(onCancel);
	}
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
	const url = new URL(`${API_BASE_URL}/reservations`);

	if (params) {
		Object.entries(params).forEach(([key, value]) =>
			url.searchParams.append(key, value.toString())
		);
	}

	return await fetchJson(url, { headers, signal, method: "GET" }, []);
}

/** posts a new reservation to the reservations page */
export async function createReservation(reservation, signal) {
	const url = `${API_BASE_URL}/reservations`;
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify({ data: reservation }),
		signal,
	};
	return await fetchJson(url, options, reservation);
}

/** returns all tables on the tables page */
export async function listTables(signal) {
	const url = `${API_BASE_URL}/tables`;
	return await fetchJson(url, { headers, signal, method: "GET" }, []);
}

export async function readReservation(reservation_id, signal) {
	const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
	return await fetchJson(url, { headers, signal }, [])
		.then(formatReservationDate)
		.then(formatReservationTime);
}

/** posts a new table to the tables page */
export async function createTable(table, signal) {
	const url = `${API_BASE_URL}/tables`;

	const body = JSON.stringify({ data: table });

	return await fetchJson(url, { headers, signal, method: "POST", body }, []);
}

export async function editReservation(reservation_id, reservation, signal) {
	const url = `${API_BASE_URL}/reservations/${reservation_id}`;
	const body = JSON.stringify({ data: reservation });
	return await fetchJson(url, { headers, signal, method: "PUT", body }, []);
}

/** returns updated data to a given reservation's page */
export async function updateReservation(reservation, signal) {
	const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
	const options = {
		method: "PUT",
		headers,
		body: JSON.stringify({ data: reservation }),
		signal,
	};
	return await fetchJson(url, options, {});
}

/** returns updated data about the reservation's status to the given reservation's page */
export async function updateReservationStatus(reservation_id, status, signal) {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	const body = JSON.stringify({ data: { status: status } });
	return await fetchJson(url, { headers, signal, method: "PUT", body }, []);
}

/** removes a table for the seat page */
export async function finishTable(table_id, signal) {
	const url = `${API_BASE_URL}/tables/${table_id}/seat`;
	return await fetchJson(url, { headers, signal, method: "DELETE" }, []);
}

/** updates the table status and displays it in the tables list */
export async function updateTable(table_id, reservation_id, signal) {
	const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
	const options = {
		method: "PUT",
		headers,
		body: JSON.stringify({ data: { reservation_id } }),
		signal,
	};
	return await fetchJson(url, options);
}
