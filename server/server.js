/** @format */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
	.connect("mongodb://localhost:27017/resume_db")
	.then(() => console.log("MongoDB Connected"))

	.catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on PORT 5000"));
