import classes from "./ScheduleCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Picture from "../components/layout/Picture";
//import SendCode from "";

import { Form, Button, Container, Row, Modal } from "react-bootstrap";
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

  function setMinDate() {
    const current = new window.Date();
    var month = current.getMonth() + 1;
    var strMonth = String(month);
    if (month < 10) strMonth = "0" + String(month);

    var day = current.getDate();
    var strDay = String(day);
    if (day < 10) strDay = "0" + String(day);

    const date = `${current.getFullYear()}-${strMonth}-${strDay}`;
    console.log(date);
    document.getElementById("datePickerId").setAttribute("min", date);
  }

  useEffect(() => {
    setMinDate();
  }, []);

  const [Schedule, setSchedule] = useState(true);

  const [show, setShow] = useState(false);
  const [Code, setCode] = useState("");
  const [Verified, setVerified] = useState(false);

  const handleClose = () => setShow(false);
  function handleShow() {
    Promise.resolve().then(() => HandleEmailOnClick());
    //.then(() => setShow(true));
    // const result1 = await new Promise((resolve) =>
    //   HandleEmailOnClick(() => resolve("1"))
    // );
    // const result2 = await new Promise((resolve) =>
    //   setShow(() => resolve("2"))(true)
    // );
    // sendEmail();
  }
  //function resendClicked() {
  //sendEmail();
  //}
  async function verifyClicked() {
    //const result = await SendCode(Email, Code);
    if (Code == "000000") {
      setVerified(true);
      setShow(false);
    } else {
      setVerified(false);
      setShow(false);
    }
  }

  function HandleScheduleOnClick() {
    if (Schedule) {
      setSchedule(false);
    } else {
      setSchedule(true);
    }
  }
  function HandleVerify() {
    if (props.code == this.input.value) {
      setVerified(true);
      this.setShow(false);
    } else {
      setVerified(false);
      this.setShow(false);
    }
  }

  function HandleEmailOnClick() {
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
      time: Time + ":00",
    };

    console.log(new_carpool);

    NewCarpool(dispatch, new_carpool);
    return 0;
  }

  return (
    <div>
      <Picture circleText="SCHEDULE A CARPOOL" />
      <Container className={classes.instructions}>
        <Row>
          <h1> INSTRUCTIONS </h1>
          <script>{handleShow()}</script>
        </Row>
        <Row>
          <p style={{ color: "white", fontFamily: "Montserrat" }}>
            This carpool feature allows students to find others traveling to the
            same place at the same time in order to cut transportation cost.
            <br />
            <br />
          </p>
        </Row>
      </Container>

      <div>
        <form aria-labelledby="info" className={classes.information}>
          <label id="info">First Name:</label>
          <input
            className={classes.input}
            type="text"
            id="info"
            required
            value={First}
            maxlength="45"
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
            required
            placeholder="Enter a valid Vanderbilt email"
            pattern=".+vanderbilt.edu"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />

          <label htmlFor="datePickerId">Date:</label>
          <input
            className={classes.input}
            id="datePickerId"
            type="date"
            required
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />

          <span
            style={{
              fontWeight: "bold",
              color: "red",
            }}
          >
            {errorMessage}
          </span>

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
              setDeparture(event.target.value);
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

          <Button type="submit" onClick={handleShow} className={classes.button}>
            SCHEDULE CARPOOL
          </Button>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Email Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                You have been sent a 6 digit verification code to the entered
                Vanderbilt email address. Please enter the code to continue.
              </p>
              {true ? (
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicCode">
                    <Form.Control
                      type="text"
                      placeholder="Enter code"
                      onChange={(event) => {
                        setCode(event.target.value);
                      }}
                      required
                    />
                  </Form.Group>
                </Form>
              ) : (
                <div></div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Resend
              </Button>
              <Button
                variant="primary"
                onClick={verifyClicked}
                style={{ backgroundColor: "green" }}
              >
                Verify
              </Button>
            </Modal.Footer>
          </Modal>
        </form>
        {/* {Verified ? <h1>yes</h1> : <h1>no</h1>} */}
      </div>
    </div>
  );
}

export default ScheduleCarpool;
