import classes from "./ContactUs.module.css";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import Picture from "../components/layout/Picture";

import {
  Button,
  Alert,
  Container,
  Row,
  Col,
  Navbar,
  NavDropdown,
  Nav,
  Overlay,
  Figure,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

function ContactUs(props) {
  return (
    <div>
      <Picture circleText="CONTACT US" blur="blur(4px)" />
      <Container fluid className={classes.instructions}>
        <Row>
          <p> QUESTIONS? </p>
        </Row>
        <Row>
          <p
            style={{
              color: "white",
              fontFamily: "Montserrat",
              fontSize: "17pt",
            }}
          >
            Please contact the{" "}
            <a href={"https://studentorg.vanderbilt.edu/vsg/contact/"}>
              Vanderbilt Student Government
            </a>{" "}
            with questions about this web application.
            <br />
            <br />
            <br />
            Created by: Sarah Zhang, Katie Cella, Ethan Piper, and Bing Gu.
          </p>
        </Row>
      </Container>
    </div>
  );

  // const [show, setShow] = useState(false);
  // const target = useRef(null);

  // return (
  //   <>
  //     <img
  //       src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
  //       class="img-fluid"
  //       alt="Responsive image"
  //       ref={target}
  //     />
  //     <Overlay target={target.current} show={show} placement="center">
  //       {(props) => (
  //         <div class={classes.circle} props {...props}>
  //           <p class="text">Contact Us</p>
  //         </div>
  //       )}
  //     </Overlay>
  //   </>
  // );
}

export default ContactUs;
