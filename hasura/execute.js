const fetch = require("node-fetch")
require("dotenv").config()

//executing function
const execute = async (query, variables) => {
	const fetchResponse = await fetch(process.env.HASURA_URL, {
		method: "POST",
		body: JSON.stringify({
			query,
			variables,
		}),
		headers: {
			"content-type": "application/json",
			"x-hasura-admin-secret": process.env.HASURA_KEY,
		},
	})
	const data = await fetchResponse.json()
	return data
}

module.exports = execute
