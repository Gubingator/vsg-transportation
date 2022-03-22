import classes from "./ScheduleCarpool.module.css";
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
// import "bootstrap/dist/css/bootstrap.min.css";

function ScheduleCarpool(props) {
  return (
    <div>
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        className="img-fluid"
        alt="Responsive image"
      />
      <h1>Page to Schedule a carpool</h1>
      {/* <div class={classes.centered}>
        <div class={classes.circle}>
          <p class="text">Contact Us</p>
        </div>
      </div> */}
    
        <div className={classes.information}>
            <label>First Name:</label>
            <input
                type="text"
            />
            <label>Last Name:</label>
            <input
                type="text"
            />
            <label>Date:</label>
            <input
                type="date"
            />
            <label>Time:</label>
            <input
                type="time"
            />
        
            <div className={classes.inputGroup}>
                <label>Departure Location: </label>

                <select className="custom-select" id="inputGroupSelect">
                    <option defaultValue={'Choose...'}>Choose...</option>
                    <option value="1">Highland</option>
                    <option value="2">Kissam/EBI</option>
                    <option value="3">Zeppos</option>
                    <option value="4">Commons</option>
                    <option value="5">Blair</option>
                    <option value="6">Other</option>
                </select>
            </div>
        
            <button /*onClick={do stuff} */>Add Carpool Request</button>
        </div>

    </div>

  );
}

export default ScheduleCarpool;