import classes from "./HowToUse.module.css";
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

function HowToUse(props) {
  return (
    <div>
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        class="img-fluid"
        alt="Responsive image"
      />
      <h1>How to use the Carpool Signup</h1>
      {/* <div class={classes.centered}>
        <div class={classes.circle}>
          <p class="text">Contact Us</p>
        </div>
      </div> */}
    </div>
  );
}

export default HowToUse;