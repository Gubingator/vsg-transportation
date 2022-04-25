/* Group Number: 5
 * Members: Sarah Zhang, Katie Cella, Bing Gu, Ethan Piper
 * sarah.s.zhang@vanderbilt.edu, katharine.a.cella@vanderbilt.edu, bing.q.gu@vanderbilt.edu, ethan.b.piper@vanderbilt.edu
 * Homework 03
 */

import classes from "./ScheduleCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Picture from "../components/layout/Picture";
//import SendCode from "";

import { Form, Button, Container, Row, Modal } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { NewCarpool } from "../services/carpools";
import { SendCode } from "../services/verify";
import { useNavigate } from "react-router-dom";

function ScheduleCarpool(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [First, setFirst] = useState("");
  const [Last, setLast] = useState("");
  const [Email, setEmail] = useState("");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [Departure, setDeparture] = useState("");
  const [Destination, setDestination] = useState("");

  const [Wrong, setWrong] = useState(false);

  const [showError, setShowError] = useState(false);
  const [show, setShow] = useState(false);
  const [Code, setCode] = useState("");
  const [Verified, setVerified] = useState(false);

  const [ID, setID] = useState(-1);

  const [ScheduleButtonDisabled, setScheduleButtonDisabled] = useState(false);
  const [VerifiedButtonDisabled, setVerifiedButtonDisabled] = useState(false);

  const handleClose = () => {
    setShow(false);
    setVerifiedButtonDisabled(false);
  };

  function setMinDate() {
    const current = new window.Date();
    var month = current.getMonth() + 1;
    var strMonth = String(month);
    if (month < 10) strMonth = "0" + String(month);

    var day = current.getDate();
    var strDay = String(day);
    if (day < 10) strDay = "0" + String(day);

    const date = `${current.getFullYear()}-${strMonth}-${strDay}`;

    document.getElementById("datePickerId").setAttribute("min", date);
  }

  useEffect(() => {
    setMinDate();
  }, []);

  async function verifyClicked() {
    setVerifiedButtonDisabled(true);
    SendCode(Email, Code, First, ID).then(function (response) {
      setVerifiedButtonDisabled(false);
      if (response) {
        setVerified(true);
        setWrong(false);
        setShow(false);
        navigate("/join-carpool", { replace: true });
      } else {
        setVerified(false);
        setWrong(true);
      }
    });
  }

  async function HandleEmailOnClick(e) {
    let form = document.getElementById("formId");
    let FormValid = false;
    setScheduleButtonDisabled(true);
    // this allows us to do the form validation and not reload the page.
    if (form.checkValidity() === true) {
      e.preventDefault();
      FormValid = true;
    }
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
      departure: Departure,
      destination: Destination,
      year: date_array[0],
      month: date_array[1],
      day: date_array[2],
      time: Time + ":00",
      filled_seats: 0,
    };

    console.log(new_carpool);

    console.log(FormValid);
    if (FormValid) {
      // checks to make sure we have a good form.
      // response is an integer. If it is less than 0, there was an error.
      NewCarpool(dispatch, new_carpool, Email).then(function (response) {
        if (response > 0) {
          setID(response);
          setWrong(false);
          setShow(true);
          setScheduleButtonDisabled(false);
        } else {
          //setShowError(true);
          setScheduleButtonDisabled(false);
          // do something else;
        }
      });
    }

    console.log(new_carpool);
  }

  return (
    <div>
      <Picture circleText="SCHEDULE A CARPOOL" blur="blur(4px)" />
      <Container className={classes.instructions}>
        <Row>
          <h1> INSTRUCTIONS </h1>
          <script>{}</script>
        </Row>
        <Row>
          <p style={{ color: "white", fontFamily: "Montserrat" }}>
            This carpool feature allows students to find others traveling to the
            same place at the same time in order to cut transportation cost.
            This is the schedule carpool page.
            <br />
            <br />
            <b>What you should do:</b>
            <br />
            1. Check if there is an existing carpool that matched your needs on
            the join carpool page.
            <br />
            2. If there is, join the carpool! You will receive a link to a
            GroupMe in order to communicate with others in your group.
            <br />
            3. If there is not a carpool that matches your needs, come back to
            this page and schedule your own! You will also receive a GroupMe
            link that others will join from the join page.
            <br />
          </p>
        </Row>
      </Container>

      <div>
        <form className={classes.information} id="formId">
          <label htmlFor="first">First Name:</label>
          <input
            id="first"
            className={classes.input}
            type="text"
            required
            maxLength="20"
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
          <label htmlFor="vandy-email">Vanderbilt Email:</label>
          <input
            id="vandy-email"
            className={classes.input}
            type="email"
            required
            placeholder="Enter valid Vanderbilt email"
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

          <label style={{textAlign: "center"}} >Departure Location <br/>(choose one or type your own):{" "}
          </label>
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

          <label style={{textAlign: "center"}}> Destination <br/> (choose one or type your own): </label>
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
          <Button
            type="submit"
            onClick={HandleEmailOnClick}
            className={classes.button}
            disabled={ScheduleButtonDisabled}
          >
            SCHEDULE CARPOOL
          </Button>
        </form>

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
                  {Wrong ? (
                    <Form.Text className="text-muted">
                      INCORRECT CODE! <br />
                      Reload the page and resubmit in order to resend.
                    </Form.Text>
                  ) : (
                    <div></div>
                  )}
                </Form.Group>
              </Form>
            ) : (
              <div></div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
              Resend
            </Button> */}
            <Button
              variant="primary"
              onClick={verifyClicked}
              disabled={VerifiedButtonDisabled}
              style={{ backgroundColor: "green" }}
            >
              Verify
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showError}
          onHide={() => setShowError(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <p>An error has occured. Please reload the page and try again.</p>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default ScheduleCarpool;
