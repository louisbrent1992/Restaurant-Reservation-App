const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((newReservation) => newReservation[0]);
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function update(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status });
}

function edit(reservation_id, reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ ...reservation })
    .returning("*");
}

function list(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .orderBy("reservation_time")
    // .whereNotIn("status", ["finished", "cancelled"]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  edit,
  search,
};
