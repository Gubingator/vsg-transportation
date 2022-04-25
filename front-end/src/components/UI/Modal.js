import { useState } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import classes from "./Modal.module.css";

function ModalPopUp(props) {
  const [show, setShow] = useState(false);
  const [Code, setCode] = useState("");
  const [Verified, setVerified] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //const handleResend = () => setResend(true);
  function clicked() {
    console.log(Code);
    // if (Code == props.code) {
    //   console.log(Code)
    //   setVerified(true);
    //   setShow(false);
    // } else {
    //   setVerified(false);
    //   setShow(false);
    // }
    // props.code == Code ? setVerified(true),setShow(false) : setShow(false);
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        className={props.buttonStyle}
      >
        {props.button}
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
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.text}
          {props.inputField ? (
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
            onClick={clicked}
            style={{ backgroundColor: "green" }}
          >
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalPopUp;
