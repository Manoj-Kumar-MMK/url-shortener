const express = require("express")
const validUrl = require("valid-url")
const shortid = require("shortid")
const morgan = require("morgan")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json({ extende: false }))
app.use(morgan("dev"))

//IMPORTS
const execute = require("./hasura/execute")
const { checkUrl, addUrl, getUrl } = require("./hasura/queries")

// @method POST
// @params long url
// @return short url
app.post("/api", async (req, res) => {
	const { long } = req.body
	const base = process.env.BASE_URL + PORT + "/"

	//cheking if the urls are valid
	if (!validUrl.isUri(base)) return res.status(401).json("Invalid base url")
	if (!validUrl.isUri(long)) return res.status(401).json("Invalid long url")

	//check if aready shortened
	const { data, errors } = await execute(checkUrl, { long })
	if (errors) return res.status(400).json(errors[0])
	if (data.URL.length !== 0)
		return res.json({
			...data.URL[0],
		})

	//shorten
	const short = base + shortid.generate()

	const { data_2, err } = await execute(addUrl, { long, short })
	if (err) return res.status(400).json(err[0])
	return res.json({
		...data_2.URL[0],
	})
})

// @method GET
// @params short url
// @return redirect to long url

app.get("/api/:urlId", async (req, res) => {
	const { urlId } = req.params
	const short = process.env.BASE_URL + PORT + "/" + urlId
	//check if url is correct
	const { data, errors } = await execute(getUrl, { short })
	if (errors) return res.status(400).json(errors[0])
	const { long } = data.URL[0]
	res.redirect(long)
})

app.listen(PORT, () => console.log("Server is running at PORT :" + PORT))
