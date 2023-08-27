import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { render } from "@testing-library/react";
import Axios from "axios";
import { isValid } from "date-fns";
import dayjs from "dayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { pickersLayoutClasses } from "@mui/x-date-pickers/PickersLayout";

class AddTrip extends Component {
  state = {
    open: false,
    id: 0,
    date: null,
    tripName: "",
    activity: "",
    location: "",
    cost: "",
    comments: "",
  };

  isDateValid = (dateString) => {
    return dayjs(dateString).isValid();
  };

  handleToggleDialog = () => {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  };

  handleTextChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleDateChange = (date) => {
    this.setState({ Date: new Date(date) }); // Convert to standard JS Date object
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { id, TripName, Date, Location, Activity, Cost, Comments } =
      this.state;
    if (!this.isDateValid(Date)) {
      alert("Invalid date format! Please enter a valid date.");
      return;
    }
    Axios.post("http://localhost:3001/api/insert", {
      trip_name: TripName,
      date: Date,
      location: Location,
      activity: Activity,
      cost: Cost,
      comments: Comments,
    }).then(() => {
      console.log("Successful insert");
      this.setState(() => ({
        open: false,
        Date: "",
        TripName: "",
        Activity: "",
        Location: "",
        Cost: "",
        Comments: "",
      }));
    });
  };

  renderForm = () => {
    const { Date, TripName, Activity, Location, Cost, Comments } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "350px",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Date"
              value={Date}
              onChange={this.handleDateChange}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          id="TripName"
          placeholder="Trip Name"
          value={TripName}
          onChange={this.handleTextChange}
        />
        <TextField
          id="Activity"
          placeholder="Activity"
          value={Activity}
          onChange={this.handleTextChange}
          required
        />
        <TextField
          id="Location"
          placeholder="Location"
          value={Location}
          onChange={this.handleTextChange}
          required
        />
        <TextField
          id="Cost"
          placeholder="Cost"
          value={Cost}
          onChange={this.handleTextChange}
          required
        />
        <TextField
          id="Comments"
          placeholder="Comments"
          value={Comments}
          onChange={this.handleTextChange}
          required
        />
        <br />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    );
  };

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <div style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            className="className"
            onClick={this.handleToggleDialog}
          >
            New Trip
          </Button>
        </div>
        {open && this.renderForm()}
      </Fragment>
    );
  }
}

export default AddTrip;
