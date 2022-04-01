import classes from "./ScheduleCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Picture from "../components/layout/Picture";

import { Form, Button, Container,Row } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { NewCarpool } from "../services/carpools";
// import validator from 'validator'


function ScheduleCarpool(props) {
  const dispatch = useDispatch();

  const [First, setFirst] = useState("");
  const [Last, setLast] = useState("");
  const [Email, setEmail] = useState("");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [Departure, setDeparture] = useState("");
  const [Destination, setDestination] = useState("");

  function setMinDate(){
    const current = new window.Date();
    //.toISOString().split('T')[0];
    var month = current.getMonth()+1;
    var strMonth = String(month);
    if(month < 10) strMonth = '0' + String(month);

    var day = current.getDate();
    var strDay = String(day);
    if(day < 10) strDay = '0' + String(day);


    const date = `${current.getFullYear()}-${strMonth}-${strDay}`;
    console.log(date);
    document.getElementById('datePickerId').setAttribute('min', date);
  }

  useEffect(() => {
    setMinDate();
  }, []);

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

      <div>
      <form className={classes.information}>
        <label>First Name:</label>
        <input
          className={classes.input}
          type="text"
          required maxLength="40"
          pattern="([a-zA-Z]+)"
          onChange={(event) => {
            setFirst(event.target.value);
          }}
        />

        <label>Last Name (optional):</label>
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
          type="email"
          required placeholder="Enter valid Vanderbilt email"
          pattern=".+vanderbilt.edu"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <label>Date:</label>
        <input
          className={classes.input}
          id="datePickerId"
          type="date"
          required
          onChange={(event) => {
            setDate(event.target.value);
          }}
        />   

        <label>Departure Time:</label>
        <input
          className={classes.input}
          type="time"
          required
          onChange={(event) => {
            setTime(event.target.value);
          }}
        />

        <label>Departure Location (choose one or type your own): </label>
        <input
          list="departLocations"
          required
          onChange={(event) => {
            setDestination(event.target.value);
          }}
        />

        <datalist id="departLocations">
          <option value="Highland"></option>
          <option value="Kissam/EBI"></option>
          <option value="Zeppos"></option>
          <option value="Blair"></option>
          <option value="Commons"></option>
          <option value="Other"></option>
        </datalist>

        <label>Destination (choose one or type your own): </label>
        <input
          list="locations"
          required
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
          type="submit"
          onClick={
            HandleOnClick()
          }
          className={classes.button}
        >
          Add Carpool Request
        </button>
        
      </form>

      </div>
    </div>
    
  );
}

export default ScheduleCarpool;
