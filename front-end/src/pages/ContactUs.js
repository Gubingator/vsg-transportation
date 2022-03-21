import classes from "./ContactUs.module.css";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

import {
  Button,
  Alert,
  Container,
  Navbar,
  NavDropdown,
  Nav,
  Overlay,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactUs(props) {
  return (
    <div>
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        class="img-fluid"
        alt="Responsive image"
      />
      <h1>Sarah Zhang, Katie Cella, Ethan Piper, Bing Gu</h1>
      {/* <div class={classes.centered}>
        <div class={classes.circle}>
          <p class="text">Contact Us</p>
        </div>
      </div> */}
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
