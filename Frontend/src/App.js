import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ClerkProvider,
  SignIn,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import Navigation from "./components/Navigation";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AddTrip from "./components/AddTrip";
import { Button } from "@mui/material";
import HomePage from "./components/Homepage";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <SignedIn>
          <Navigation />
          {/* <AddTrip /> */}
          <HomePage />
        </SignedIn>
        <SignedOut>
          <h1>Hello World! Welcome to my app!</h1>
          <SignIn />
        </SignedOut>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;
