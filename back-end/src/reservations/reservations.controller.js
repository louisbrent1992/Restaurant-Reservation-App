const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/** lists reservations for a given date with or without a given phone number */
async function list(req, res) {
  const mobile_number = req.query.mobile_number;
  const data = await (
      mobile_number
    ?  service.search(mobile_number)
    :  service.list(req.query.date)
  );
    res.json({
      data,
    });
  
}

/** checks to ensure a req body is provided */
async function validateData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Body must include a data object" });
  }
  next();
}

/** checks to ensure that any of the required fields are provided */
async function validateBody(req, res, next) {
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (const field of requiredFields) {
    if (!req.body.data.hasOwnProperty(field) || req.body.data[field] === "") {
      return next({ status: 400, message: `Field required: '${field}'` });
    }
  }

  if (
    Number.isNaN(
      Date.parse(
        `${req.body.data.reservation_date} ${req.body.data.reservation_time}`
      )
    )
  ) {
    return next({
      status: 400,
      message:
        "'reservation_date' or 'reservation_time' field is in an incorrect format",
    });
  }

  if (typeof req.body.data.people !== "number") {
    return next({ status: 400, message: "'people' field must be a number" });
  }

  if (req.body.data.people < 1) {
    return next({ status: 400, message: "'people' field must be at least 1" });
  }

  if (req.body.data.status && req.body.data.status !== "booked") {
    return next({
      status: 400,
      message: `'status' field cannot be ${req.body.data.status}`,
    });
  }

  next();
}

/** checks to ensure that the reservation is:
 * in the future
 * on a day that the restaurant is open
 * during the restaurant's open hours
 */
async function validateDate(req, res, next) {
  const reserveDate = new Date(
    `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`
  );
  const nowDate = Date.now();

  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message: "Choose new reservation_date. Restaurant is closed on Tuesdays",
    });
  }

  if (reserveDate < nowDate) {
    return next({
      status: 400,
      message:
        "'Reservation_date' and 'Reservation_time' must be in the future.",
    });
  }

  if (
    reserveDate.getHours() < 10 ||
    (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)
  ) {
    return next({
      status: 400,
      message: "'Reservation_time' must be after 10:30 AM.",
    });
  }

  if (
    reserveDate.getHours() > 22 ||
    (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message:
        "Choose new 'Reservation_time'. Restaurant is closed after 10:30 PM.",
    });
  }

  if (
    reserveDate.getHours() > 21 ||
    (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)
  ) {
    return next({
      status: 400,
      message:
        "Choose new 'Reservation_time'. Reservation must be made at least an hour before closing (10:30 PM).",
    });
  }

  next();
}

/** uses read() to return the data with the given reservation id in the req params */
async function validateReservationId(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation_id ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

/** ensures that the reservation has a valid status */
async function validateUpdateBody(req, res, next) {
  if (!req.body.data.status) {
    return next({
      status: 400,
      message: "Body must include a 'status' entry.",
    });
  }

  if (
    req.body.data.status !== "booked" &&
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `'status' entry cannot be ${req.body.data.status}.`,
    });
  }

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `Reservation status is 'finished'.`,
    });
  }
  next();
}

/** creates a new reservation, and returns it's data from the reservations list */
async function create(req, res) {
  req.body.data.status = "booked";
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

/** updates a valid reservation */
async function update(req, res) {
  await service.update(
    res.locals.reservation.reservation_id,
    req.body.data.status
  );

  res.status(200).json({ data: { status: req.body.data.status } });
}

/** edits a valid reservation */
async function edit(req, res) {
  const response = await service.edit(
    res.locals.reservation.reservation_id,
    req.body.data
  );
  res.status(200).json({ data: response[0] });
}

/** retrieves a given reservation */
async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateBody),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateUpdateBody),
    asyncErrorBoundary(update),
  ],
  edit: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateBody),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(edit),
  ],
  read: [asyncErrorBoundary(validateReservationId), asyncErrorBoundary(read)],
};
