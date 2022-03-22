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

function Nashville(props) {
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
      <h1>Nashville transportation information</h1>
      <Container className={classes.page}>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={VandyVans}
            title="VandyVans"
            theClick={HandleVandyOnClick}
            text={"This is a test"}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={MoveVU}
            title="MoveVU"
            theClick={HandleMoveVUOnClick}
            text={"This is a test 2"}
          ></DropdownCard>
        </Row>
      </Container>
    </div>
  );
}

export default Nashville;
