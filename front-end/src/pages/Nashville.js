import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  CloseButton,
  Dropdown,
  DropdownButton,
  Container,
} from "react-bootstrap";
import DropdownCard from "../components/UI/DropdownCard";
import classes from "./Nashville.module.css";
import Picture from "../components/layout/Picture";

function Nashville(props) {
  const [WeGO, setWeGO] = useState(true);
  const [Lyft, setLyft] = useState(true);
  const [TransitApp, setTransitApp] = useState(true);

  function HandleWeGOnClick() {
    if (WeGO) {
      setWeGO(false);
    } else {
      setWeGO(true);
    }
  }

  function HandleLyftonClick() {
    if (Lyft) {
      setLyft(false);
    } else {
      setLyft(true);
    }
  }

  function HandleTransitAppOnClick() {
    if (TransitApp) {
      setTransitApp(false);
    } else {
      setTransitApp(true);
    }
  }

  return (
    <div>
      <Picture circleText="NASHVILLE" />
      <h1>Nashville transportation information</h1>
      <Container className={classes.page} fluid>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={WeGO}
            title="WeGO"
            theClick={HandleWeGOnClick}
            text={
              "WeGo Public Transit is the website for the bus sytems around Nashville."
            }
            link={"https://www.wegotransit.com/"}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={Lyft}
            title="Lyft"
            theClick={HandleLyftonClick}
            text={"This is a test 2"}
            link={""}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={TransitApp}
            title="TransitApp"
            theClick={HandleTransitAppOnClick}
            text={"This is a test 3"}
            link={"https://transitapp.com/region/nashville"}
          ></DropdownCard>
        </Row>
      </Container>
    </div>
  );
}

export default Nashville;
