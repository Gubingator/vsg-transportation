import classes from "./JoinCarpool.module.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { Row, Container, Navbar } from "react-bootstrap";
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
      <Picture circleText="JOIN A CARPOOL" blur="blur(4px)" />
      <Container className={classes.instructions}>
        <Row>
          <h1> INSTRUCTIONS </h1>
          <script>{}</script>
        </Row>
        <Row>
          <p style={{ color: "white", fontFamily: "Montserrat" }}>
            This carpool feature allows students to find others traveling to the
            same place at the same time in order to cut transportation cost.
            This is the join carpool page. It lists the carpools that are
            already available.
            <br />
            <br />
            <b>What you should do:</b>
            <br />
            1. Check if there is an existing carpool that matched your needs.
            <br />
            2. If there is, join the carpool! You will receive a link to a
            GroupMe in order to communicate with others in your group.
            <br />
            3. If there is not a carpool that matches your needs, schedule your
            own! Navigate to the schedule carpool page to do so.
            <br />
          </p>
        </Row>
      </Container>
      <CarpoolList carpoolList={carpools} />
    </div>
  );
}

export default JoinCarpool;
