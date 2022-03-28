import classes from "./ScheduleCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import Picture from "../components/layout/Picture";

import {
  Button,
  Alert,
  Container,
  Navbar,
  NavDropdown,
  Nav,
  Overlay,
} from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

function ScheduleCarpool(props) {
  return (
    <div>
      <Picture circleText="SCHEDULE A CARPOOL" />
      <h1>Page to Schedule a carpool</h1>

      <div className={classes.information}>
        <label>First Name:</label>
        <input className={classes.input} type="text" />
        <label>Last Name:</label>
        <input className={classes.input} type="text" />
        <label>Vanderbilt Email:</label>
        <input className={classes.input} type="text" />
        <label>Date:</label>
        <input className={classes.input} type="date" />
        <label>Departure Time:</label>
        <input className={classes.input} type="time" />

        <div className={classes.inputGroup}>
          <label>Departure Location: </label>

          <select className="custom-select" id="inputGroupSelect">
            <option defaultValue={"Choose..."}>Choose...</option>
            <option value="1">Highland</option>
            <option value="2">Kissam/EBI</option>
            <option value="3">Zeppos</option>
            <option value="4">Commons</option>
            <option value="5">Blair</option>
            <option value="6">Other</option>
          </select>
        </div>

        <label>Destination (choose one or type your own): </label>
          <input list="locations"/>
          <datalist id="locations">
              <option value="BNA Airport"></option>
              <option value="BridgeStone Arena"></option>
              <option value="Green Hills Mall"></option>
              <option value="12th South"></option>
              <option value="Kroger"></option>
              <option value="Target"></option>
            </datalist>

        <button /*onClick={do stuff} */ className={classes.button}>Add Carpool Request</button>

      </div>
    </div>
  );
}

export default ScheduleCarpool;
