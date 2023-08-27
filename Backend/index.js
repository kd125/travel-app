const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const { parseISO, format, formatISO } = require("date-fns");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "keyboard",
  database: "travelapp",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM travelapp.travel_app;";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.get("/api/get/:id", (req, res) => {
  const tripId = req.params.id;

  const sqlSelectId = "SELECT * FROM travelapp.travel_app WHERE id = ?";
  db.query(sqlSelectId, [tripId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching trip by ID: ");
    }

    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const tripName = req.body.trip_name;
  const tripDate = req.body.date;
  const tripLocation = req.body.location;
  const tripActivity = req.body.activity;
  const tripCost = req.body.cost;
  const tripComments = req.body.comments;

  const date = tripDate ? tripDate : Date.now();

  const formattedDate = formatISO(parseISO(date), {
    representation: "date",
  });

  const sqlInsert =
    "INSERT INTO travel_app (trip_name, date, location, activity, cost, comments) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [
      tripName,
      formattedDate,
      tripLocation,
      tripActivity,
      tripCost,
      tripComments,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send("Error inserting data into the database: " + err.message);
      } else {
        res.status(200).send("Data inserted successfully.");
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Running on Port 3001");
});
