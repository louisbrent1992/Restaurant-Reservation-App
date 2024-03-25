/**
 * Knex uration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
	DATABASE_URL_PRODUCTION,
	DATABASE_URL_DEVELOPMENT,
	DB_HOST,
	DB_USER,
	DB_NAME,
	DB_PASSWORD,
	DB_SSL,
	DB_PORT,
	DEBUG,
} = process.env;

module.exports = {
	development: {
		client: "pg",
		connection: {
			connectionString: DATABASE_URL_DEVELOPMENT,
			host: DB_HOST,
			port: DB_PORT,
			user: DB_USER,
			database: DB_NAME,
			password: DB_PASSWORD,
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
		connection: DATABASE_URL_PRODUCTION,
		migrations: {
			directory: path.join(__dirname, "src", "db", "migrations"),
		},
		seeds: {
			directory: path.join(__dirname, "src", "db", "seeds"),
		},
		debug: !!DEBUG,
	},
};
