import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { render } from "@testing-library/react";

class AddTrip extends Component {
  state = {
    open: false,
    Date: "",
    TripName: "",
    Activity: "",
    Location: "",
    Cost: "",
    Comments: "",
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

  handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
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
        <TextField
          id="Trip-Name"
          placeholder="Trip Name"
          value={TripName}
          onChange={this.handleTextChange}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker label="Date" value={Date} />
          </DemoContainer>
        </LocalizationProvider>
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
          <h1>Add Trip:</h1>
          <Button
            variant="contained"
            className="className"
            onClick={this.handleToggleDialog}
          >
            Add Trip
          </Button>
        </div>
        {open && this.renderForm()}
      </Fragment>
    );
  }
}

export default AddTrip;
