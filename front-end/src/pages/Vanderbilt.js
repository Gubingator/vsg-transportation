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
import classes from "./Vanderbilt.module.css";
import Picture from "../components/layout/Picture";

function Vanderbilt(props) {
  const [VandyVans, setVandyVans] = useState(true);
  const [MoveVU, setMoveVU] = useState(true);

  function HandleVandyOnClick() {
    if (VandyVans) {
      setVandyVans(false);
    } else {
      setVandyVans(true);
    }
  }

  function HandleMoveVUOnClick() {
    if (MoveVU) {
      setMoveVU(false);
    } else {
      setMoveVU(true);
    }
  }

  return (
    <div>
      <Picture circleText="VANDERBILT" />
      <h1> Vanderbilt transportation information</h1>
      <Container className={classes.page} fluid>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={VandyVans}
            title="VandyVans"
            theClick={HandleVandyOnClick}
            text={"This is a test"}
            link={""}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={MoveVU}
            title="MoveVU"
            theClick={HandleMoveVUOnClick}
            text={"This is a test 2"}
            link={""}
          ></DropdownCard>
        </Row>
      </Container>
    </div>
  );
}

export default Vanderbilt;
