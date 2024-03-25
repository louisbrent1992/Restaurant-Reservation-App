/**
 * Knex uration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const { CLIENT_URL_PRODUCTION, CLIENT_URL_DEVELOPMENT, DB_SSL, DEBUG } =
	process.env;

module.exports = {
	development: {
		client: "pg",
		connection: {
			connectionString: CLIENT_URL_DEVELOPMENT,

			ssl: DB_SSL ? { rejectUnauthorized: false } : true,

			debug: !!DEBUG,
		},

		migrations: {
			directory: path.join(__dirname, "src", "db", "migrations"),
		},
		seeds: {
			directory: path.join(__dirname, "src", "db", "seeds"),
		},
	},

	production: {
		client: "pg",
		pool: { min: 1, max: 5 },
		connection: {
			CLIENT_URL_PRODUCTION,
			ssl: DB_SSL ? { rejectUnauthorized: false } : true,
			debug: !!DEBUG,
		},

		migrations: {
			directory: path.join(__dirname, "src", "db", "migrations"),
		},
		seeds: {
			directory: path.join(__dirname, "src", "db", "seeds"),
		},
		debug: !!DEBUG,
	},
};
