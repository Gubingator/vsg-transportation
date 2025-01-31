/* Group Number: 5
 * Members: Sarah Zhang, Katie Cella, Bing Gu, Ethan Piper
 * sarah.s.zhang@vanderbilt.edu, katharine.a.cella@vanderbilt.edu, bing.q.gu@vanderbilt.edu, ethan.b.piper@vanderbilt.edu
 * Homework 03
 */

import { Col, Row, Card, Button, Modal, Form } from "react-bootstrap";
import classes from "./CarpoolItem.module.css";
import { useState } from "react";
import { SendEmail, SendCode } from "../../services/verify";

function CarpoolItem(props) {
  const [First, setFirst] = useState("");
  const [Last, setLast] = useState("");
  const [Email, setEmail] = useState("");
  const [ID, setID] = useState("");
  const [showError, setShowError] = useState(false);

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [Code, setCode] = useState("");
  const [FirstNameVerified, setFirstNameVerified] = useState(false);
  const [EmailVerified, setEmailVerfied] = useState(false);
  const [FirstMessage, setFirstMessage] = useState(false);
  const [EmailMessage, setEmailMessage] = useState(false);
  const [Verified, setVerified] = useState(false);
  const [Wrong, setWrong] = useState(false);
  const handleClose = () => setShow(false);
  const handleCloseConfirm = () => setShowConfirm(false);
  function handleShow() {
    setShow(true);
  }

  function formatTime() {
    let minutes = props.carpool_ref["time"].substring(3, 5);
    let hour = parseInt(props.carpool_ref["time"].substring(0, 2));
    let postFix = "AM";
    if (hour > 12) {
      hour = hour - 12;
      postFix = "PM";
    }
    return hour.toString() + ":" + minutes + " " + postFix;
  }

  function inputValid(e) {
    let form = document.getElementById("formId2");
    let FormValid = false;
    console.log("form");
    console.log(form.checkValidity());

    if (form.checkValidity() === true) {
      e.preventDefault();
      FormValid = true;
    }
    console.log("First");
    console.log(First);

    if (FormValid) {
      handleClose();
      setFirstMessage(false);
      setEmailMessage(false);
      HandleEmailOnClick(e);
    } else if (First === "") {
      setFirstMessage(true);
    } else {
      setEmailMessage(true);
    }
  }

  async function verifyClicked() {
    // if (Code === "000000") {
    //   setVerified(true);
    //   handleCloseConfirm();
    // } else {
    //   setVerified(false);
    //   setWrong(true);
    //   //setShow(false);
    // }
    SendCode(Email, Code, First, props.carpool_ref["id"]).then(function (
      response
    ) {
      if (response) {
        setVerified(true);
        handleCloseConfirm();
      } else {
        setVerified(false);
        setWrong(true);
      }
    });
  }

  function HandleEmailOnClick(e) {
    // response will equal -1 if the email was not valid (idk if we need this though)
    SendEmail(Email, props.carpool_ref["id"], First).then(function (response) {
      if (response){
        setShowConfirm(true);
      } else {
        setShowError(true);
      }
    });
  }

  return (
    <div>
      <Card className={classes.cardData}>
        <Row>
          <Col sm style={{ textAlign: "center" }}>
            OPEN SEATS:
            <br />
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "17pt",
              }}
            >
              {4 - props.carpool_ref["filled_seats"]}
            </p>
          </Col>
          <Col sm className={classes.centerItem}>
            Leaving from:
            <p className={classes.dataParagraph}>
              {props.carpool_ref["departure"]}
            </p>
          </Col>
          <Col sm className={classes.centerItem}>
            Leaving time:
            <p className={classes.dataParagraph}>{formatTime()}</p>
          </Col>
          <Col sm className={classes.centerItem}>
            Destination:
            <p className={classes.dataParagraph}>
              {props.carpool_ref["destination"]}{" "}
            </p>
            {/* Students:
          <ul className={classes.list}>
            {props.carpool_ref["students"].map((student) => {
              return <li key={student}>{student}</li>;
            })}
          </ul> */}
          </Col>
          <Col sm style={{ paddingTop: "7px" }} className={classes.centerItem}>
            <Button onClick={handleShow} className={classes.buttonData}>
              JOIN
            </Button>
          </Col>
        </Row>
      </Card>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className={classes.modal}
        centered
      >
        <Modal.Header style={{ backgroundColor: "#e8a62b" }} closeButton>
          <Modal.Title>Enter your information</Modal.Title>
        </Modal.Header>
        <Modal.Body className={classes.label}>
          {true ? (
            <Form id="formId2">
              <Form.Group className="mb-3" controlId="formBasicCode">
                <Form.Label className={classes.label}>First Name:</Form.Label>
                <Form.Control
                  className={classes.input}
                  type="text"
                  required
                  maxLength="40"
                  pattern="([a-zA-Z]+)"
                  onChange={(event) => {
                    setFirst(event.target.value);
                    setFirstNameVerified(true);
                  }}
                />
                {FirstMessage ? (
                  <Form.Text className="text-muted">
                    Please fill out this field.
                  </Form.Text>
                ) : (
                  <div></div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCode">
                <Form.Label className={classes.label}>
                  Last Name (optional):
                </Form.Label>
                <Form.Control
                  className={classes.input}
                  type="text"
                  onChange={(event) => {
                    setLast(event.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCode">
                <Form.Label className={classes.label}>
                  Vanderbilt Email:
                </Form.Label>
                <Form.Control
                  className={classes.input}
                  type="email"
                  required
                  //placeholder="Enter valid Vanderbilt email"
                  pattern=".+vanderbilt.edu"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailVerfied(true);
                  }}
                />
                {EmailMessage ? (
                  <Form.Text className="text-muted">
                    Enter valid Vanderbilt email.
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
          <Button
            variant="primary"
            onClick={(e) => inputValid(e)}
            className={classes.joinInfo}
          >
            JOIN
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirm}
        onHide={handleCloseConfirm}
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
          {/* <Button variant="secondary" onClick={handleCloseConfirm}>
            Resend
          </Button> */}
          <Button
            variant="primary"
            onClick={verifyClicked}
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
  );
}

export default CarpoolItem;
