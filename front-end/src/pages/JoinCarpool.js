import classes from "./JoinCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect} from "react";

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
import { useDispatch, useSelector } from "react-redux";
import { GetCarpools } from "../services/carpools";
import CarpoolList from "../components/carpools/CarpoolList";

function JoinCarpool(props) {
  const dispatch = useDispatch();
  const carpools = useSelector((state) => state.carpoolsSlice.carpools);

  useEffect(() => {
    GetCarpools(dispatch);
  }, []);
  

  return (
    <div className={classes.page}>
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        className="img-fluid"
        alt="Responsive image"
      />
      <h1>Page to join a carpool</h1>
      <CarpoolList carpoolList={carpools}/>

    </div>
  );
}

export default JoinCarpool;