import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import "../App.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Typography from "@mui/material/Typography";

const TripForm = ({ tripInfo, setShowModal }) => {
  const [formState, setFormState] = useState({
    tripName: "",
    date: "",
    activity: "",
    location: "",
    cost: "",
    comments: "",
  });

  useEffect(() => {
    if (tripInfo) {
      const formattedTripInfo = { ...tripInfo };
      if (tripInfo.date) {
        formattedTripInfo.date = formatIsoDateForInput(tripInfo.date);
      }
      setFormState(formattedTripInfo);
    }
  }, [tripInfo]);

  const formatIsoDateForInput = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // const formatIsoDateForInput = (isoDateString) => {
  //   if (!isoDateString) return ""; // Return an empty string if isoDateString is undefined or null
  //   return isoDateString.substring(0, 10); // Extracts the "YYYY-MM-DD" part
  // };

  const isDateValid = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const { tripName, date, activity, location, cost, comments } = formState;
    const newDate = new Date(date);

    // Then check if it's a valid date before converting to ISOString
    const formattedDate = !isNaN(newDate.getTime())
      ? newDate.toISOString()
      : null;

    setShowModal(false);

    if (!isDateValid(formattedDate)) {
      // Correct the casing here
      alert("Invalid date format! Please enter a valid date.");
      return;
    }

    Axios.post(`${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/insert`, {
      trip_name: tripName,
      date: formattedDate,
      location,
      activity,
      cost,
      comments,
    })
      .then(() => {
        console.log("Successful insert");
        setFormState({
          tripName: "",
          date: "",
          activity: "",
          location: "",
          cost: "",
          comments: "",
        });
      })
      .catch((error) => {
        console.error("Error inserting new trip:", error);
      });
  };

  const { tripName, date, activity, location, cost, comments } = formState;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <TextField
          id="tripName"
          label="Trip Name"
          value={tripName}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <input
          type="date"
          id="date"
          name="Trip Date"
          value={date}
          min={Date.now()}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <TextField
          id="location"
          placeholder="Location"
          value={location}
          required
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <TextField
          id="activity"
          placeholder="Activity"
          value={activity}
          required
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <TextField
          id="cost"
          placeholder="Cost"
          value={cost}
          required
          type="number"
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <TextField
          id="comments"
          placeholder="Comments"
          value={comments}
          required
          multiline
          rows={4}
          onChange={handleInputChange}
        />
      </div>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default TripForm;
