import classes from "./JoinCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

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
import Picture from "../components/layout/Picture";
import { SendCode } from "../services/verify"; 

/**
 * This is what will be sent to the backend:
 * {
 *    carpool_id: id
 *    code: "code"
 *    name: "Student name",
 *    email: "email@vanderbilt.edu"
 * }
 * 
 */

function JoinCarpool(props) {
  const dispatch = useDispatch();
  const carpools = useSelector((state) => state.carpoolsSlice.carpools);
  console.log(carpools);
  useEffect(() => {
    GetCarpools(dispatch);
  }, []);

  return (
    <div className={classes.page}>
      <Picture circleText="JOIN A CARPOOL" />
      <CarpoolList carpoolList={carpools} />
    </div>
  );
}

export default JoinCarpool;
