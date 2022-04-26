import classes from "./HomePage.module.css";
import Picture from "../components/layout/Picture";
import { GetCarpools, NewCarpool } from "../services/carpools";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Container } from "react-bootstrap";

function HomePage(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    GetCarpools(dispatch);
  }, []);

  function getNewStem() {
    NewCarpool(dispatch, "{}");
  }

  return (
    <div>
      <Picture circleText="" />

      <Container fluid className={classes.title}>
        <h1>STUDENT TRANSPORTATION</h1>
        <p className={classes.paragraph}>
          Vandy Transit is a centralized location for the transportation options
          available to Vanderbilt Students. It includes information about how to
          get around Vanderbilt and Nashville. Available to all students is a
          carpool scheduler where students may schedule a carpool or join an
          already existant carpool.
        </p>
      </Container>

      {/*
			<img src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png" className="img-fluid" alt="Responsive image" />
			<h1>Home Page</h1>
      <Button onClick={() => {getNewStem()}}>Press Here</Button>
      */}
    </div>
  );
}

export default HomePage;
