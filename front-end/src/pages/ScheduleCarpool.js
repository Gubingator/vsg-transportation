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
  Row,
} from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

function ScheduleCarpool(props) {
  const [First, setFirst] = useState("");
  const [Last, setLast] = useState("");
  const [Email, setEmail] = useState("");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [Departure, setDeparture] = useState("");
  const [Destination, setDestination] = useState("");

  return (
    <div>
      <Picture circleText="SCHEDULE A CARPOOL" />
      <Container className={classes.instructions}>
        <Row>
          <h1> INSTRUCTIONS </h1>
        </Row>
        <Row>
          <p style={{ color: "white", fontFamily: "Open Sans" }}>
            This carpool feature allows students to find others traveling to the
            same place at the same time in order to cut transportation cost.
            <br />
            <br />
          </p>
        </Row>
      </Container>

      <div className={classes.information}>
        <label>First Name:</label>
        <input
          className={classes.input}
          type="text"
          onChange={(event) => {
            setFirst(event.target.value);
          }}
        />

        <label>Last Name:</label>
        <input
          className={classes.input}
          type="text"
          onChange={(event) => {
            setLast(event.target.value);
          }}
        />
        <label>Vanderbilt Email:</label>
        <input
          className={classes.input}
          type="text"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <label>Date:</label>
        <input
          className={classes.input}
          type="date"
          onChange={(event) => {
            setDate(event.target.value);
          }}
        />
        <label>Departure Time:</label>
        <input
          className={classes.input}
          type="time"
          onChange={(event) => {
            setTime(event.target.value);
          }}
        />

        <div className={classes.inputGroup}>
          <label>Departure Location: </label>

          <select
            className="custom-select"
            id="inputGroupSelect"
            onChange={(event) => {
              setDeparture(event.target.value);
            }}
          >
            <option defaultValue={"Choose..."}>Choose...</option>
            <option value="Highland">Highland</option>
            <option value="Kissam/EBI">Kissam/EBI</option>
            <option value="Zeppos">Zeppos</option>
            <option value="Commons">Commons</option>
            <option value="Blair">Blair</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <label>Destination (choose one or type your own): </label>
        <input
          list="locations"
          onChange={(event) => {
            setDestination(event.target.value);
          }}
        />
        <datalist id="locations">
          <option value="BNA Airport"></option>
          <option value="BridgeStone Arena"></option>
          <option value="Green Hills Mall"></option>
          <option value="12th South"></option>
          <option value="Kroger"></option>
          <option value="Target"></option>
        </datalist>

        <button
          onClick={() => {
            console.log(First);
            console.log(Last);
            console.log(Departure);
            console.log(Time);
            console.log(Destination);
          }}
          className={classes.button}
        >
          Add Carpool Request
        </button>

        <button /*onClick={do stuff} */ className={classes.button}>
          Add Carpool Request
        </button>
      </div>
    </div>
  );
}

export default ScheduleCarpool;
