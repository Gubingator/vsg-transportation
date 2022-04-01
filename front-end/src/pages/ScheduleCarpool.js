import classes from "./ScheduleCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import Picture from "../components/layout/Picture";

import { Form, Button, Row, Col, Container} from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { NewCarpool } from "../services/carpools";


function ScheduleCarpool(props) {
  const dispatch = useDispatch();

  const [First, setFirst] = useState("");
  const [Last, setLast] = useState("");
  const [Email, setEmail] = useState("");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [Departure, setDeparture] = useState("");
  const [Destination, setDestination] = useState("");

  function HandleOnClick() {
    console.log(First);
    console.log(Last);
    console.log(Email);
    console.log(Date);
    console.log(Time);
    console.log(Departure);
    console.log(Destination);
    const student = First + " " + Last;
    const date_array = Date.split("-");

    const new_carpool = {
      id: 1,
      students: [student],
      departure: Departure,
      destination: Destination,
      year: date_array[0],
      month: date_array[1],
      day: date_array[2],
      time: Time + ":00"
    }

    console.log(new_carpool);

    NewCarpool(dispatch, new_carpool);

  }

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
          onClick={HandleOnClick}
          className={classes.button}
        >
          Add Carpool Request
        </button>
      </div>
    </div>
  );
}

export default ScheduleCarpool;
