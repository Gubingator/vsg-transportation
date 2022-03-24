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
      <Picture circleText="CONTACT US" />
      <Container fluid className={classes.title}>
        <h1>Sarah Zhang, Katie Cella, Ethan Piper, Bing Gu</h1>
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
