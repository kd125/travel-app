import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import "./index.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AppBar from "@mui/material/AppBar";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import TripForm from "./TripForm";
import {
  useJsApiLoader,
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

/* global google */

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  // Add other card styles here
}));

const defaultTheme = createTheme();

function HomePage() {
  const [displayCard, setDisplayCard] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState({}); // Define selectedCardData
  const [newTripTitle, setNewTripTitle] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    getAllCards();
  }, [dataFetched]);

  const getAllCards = () => {
    Axios.get(`${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/get`).then(
      (response) => {
        console.log("response", response);
        if (response.data === "") {
          return null;
        }
        const data = response.data.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));

        setDisplayCard(data);
      }
    );
  };

  const getCardData = (tripId) => {
    console.log("tripId", tripId);
    Axios.get(`${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/get/${tripId}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { trip_name, date, activity, location, cost, comments } =
            response.data[0];
          setSelectedCardData({
            tripName: trip_name,
            date,
            activity,
            location,
            cost,
            comments,
          });
          setDataFetched((prevState) => !prevState);
        } else {
          console.error("No data returned from API");
        }
      })
      .catch((error) => {
        console.error("Error fetching stored data:", error);
      });
  };

  const handleCardClick = (cardData) => {
    // Define handleCardClick
    getCardData(cardData.id);
    setShowModal(true);
  };

  const handleNewTripClick = () => {
    setSelectedCardData({});
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setNewTripTitle("");
  };
  const renderModal = Object.keys(selectedCardData).length > 0 || showModal;

  const calculateRoute = async () => {
    if (origin === "" || destination === "") {
      return;
    }
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setOrigin("");
    setDestination("");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="displayCard">
        <Box
          display="flex"
          justifyContent="center" // Centered the button
          alignItems="center"
          mb={4}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={4}
            mt={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewTripClick}
              className="newtrip-button"
            >
              New Trip
            </Button>
          </Box>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {displayCard.map((val) => (
              <Grid item key={val.id} xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardActionArea onClick={() => handleCardClick(val)}>
                    <CardContent>
                      <Typography>{val.trip_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {val.date}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Stack spacing={2} mb={4}>
            <Autocomplete>
              <TextField
                type="text"
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </Autocomplete>
            <Autocomplete>
              <TextField
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Autocomplete>
            <Button
              variant="contained"
              color="secondary"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
          </Stack>
          <IconButton aria-label="center back" onClick={clearRoute} />

          {distance && duration && (
            <Box mt={2}>
              <Typography variant="subtitle1">
                Calculated Distance: {distance}
              </Typography>
              <Typography variant="subtitle1">
                Calculated Duration: {duration}
              </Typography>
            </Box>
          )}

          <GoogleMap
            zoom={10}
            center={{ lat: 30.267153, lng: -97.743057 }}
            mapContainerStyle={{ width: "80vw", height: "80vh" }}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
        {/* First Modal */}
        <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2">
                Add New Trip
              </Typography>
              <TripForm
                tripInfo={selectedCardData}
                setShowModal={setShowModal}
              />
            </Box>
          </div>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
