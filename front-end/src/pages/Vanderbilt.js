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
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        className="img-fluid"
        alt="Responsive image"
      />
      <h1> Vanderbilt Transportation Information</h1>
      <Container className={classes.page} fluid>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={VandyVans}
            title="VandyVans"
            theClick={HandleVandyOnClick}
            text={"This is a test"}
            link = {""}
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
