const {
	NODE_ENV,
	CLIENT_URL_PRODUCTION,
	CLIENT_URL_DEVELOPMENT,
	PORT = 5000,
} = process.env;

const app = require("./app");
const knex = require("./db/connection");
const cors = require("cors");

app.use(
	cors({
		allowedOrigins: [
			NODE_ENV === "production"
				? CLIENT_URL_PRODUCTION
				: CLIENT_URL_DEVELOPMENT,
		],
	})
);

knex.migrate
	.latest()
	.then((migrations) => {
		console.log("migrations", migrations);
		app.listen(PORT, listener);
	})
	.catch((error) => {
		console.error(error);
		knex.destroy();
	});

function listener() {
	console.log(`Listening on Port ${PORT}!🚀`);
}
