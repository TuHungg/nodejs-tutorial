const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvent");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;

app.use(logger); // custom middleware logger

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// buil-in middleware to handle urlencoded form data
app.use(express.urlencoded({ exntended: false }));

app.use(express.json());

// server static file
app.use("/", express.static(path.join(__dirname, "/public")));

// set-up routers
app.use("/", require("./routers/root"));
app.use("/register", require("./routers/register"));
app.use("/auth", require("./routers/auth"));
app.use("/employees", require("./routers/api/employees"));

// app.get('/')
app.get("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler); // custom 404

app.listen(PORT, () => console.log(`server running on port -> ${PORT}`));
