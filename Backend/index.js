const express = require("express");
const app = express();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "keyboard",
  database: "travelapp",
});

app.get("/", (req, res) => {});

app.listen(3001, () => {
  console.log("Running on Port 3001");
});
