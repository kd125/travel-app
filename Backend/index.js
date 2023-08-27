const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { parseISO, formatISO } = require("date-fns");
const Knex = require("knex");

require("dotenv").config();

// Configure Knex to use PlanetScale
const knex = Knex({
  client: "mysql2",
  connection: process.env.DATABASE_URL,
});

console.log("Connected to PlanetScale!");
// Create table if it doesn't exist
knex.schema
  .hasTable("travel_app")
  .then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("travel_app", function (table) {
        table.increments("id").primary();
        table.string("trip_name");
        table.date("date");
        table.string("location");
        table.string("activity");
        table.string("cost");
        table.string("comments");
      });
    }
  })
  .then(() => console.log("Table created successfully"))
  .catch((error) => console.log(`Error creating table: ${error}`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This API is running!!!");
});

app.get("/api/get", async (req, res) => {
  try {
    const result = await knex.select("*").from("travel_app");
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data: " + err.message);
  }
});

app.get("/api/get/:id", async (req, res) => {
  const tripId = req.params.id;

  try {
    const result = await knex("travel_app").where("id", tripId);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching trip by ID: " + err.message);
  }
});

app.post("/api/insert", async (req, res) => {
  const { trip_name, date, location, activity, cost, comments } = req.body;

  const formattedDate = date
    ? formatISO(parseISO(date), { representation: "date" })
    : formatISO(new Date(), { representation: "date" });

  try {
    await knex("travel_app").insert({
      trip_name,
      date: formattedDate,
      location,
      activity,
      cost,
      comments,
    });
    res.status(200).send("Data inserted successfully.");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Error inserting data into the database: " + err.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
