import { Col, Row, Card, Button } from "react-bootstrap";
import classes from "./CarpoolItem.module.css";

function CarpoolItem(props) {
  return (
    <Card className={classes.cardData}>
      <Row>
        <Col style={{ textAlign: "center" }}>
          OPEN SEATS:
          <br />
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "17pt",
            }}
          >
            {4 - props.carpool_ref["students"].length}
          </p>
        </Col>
        <Col>Leaving from: {props.carpool_ref["location"]}</Col>
        <Col>Leaving time: {props.carpool_ref["time"].substring(0, 5)}</Col>
        <Col>
          Destination:
          {props.carpool_ref["destination"]}
          {/* Students:
          <ul className={classes.list}>
            {props.carpool_ref["students"].map((student) => {
              return <li key={student}>{student}</li>;
            })}
          </ul> */}
        </Col>
        <Col style={{ paddingTop: "7px" }}>
          <Button className={classes.buttonData}>JOIN</Button>
        </Col>
      </Row>
    </Card>
  );
}

export default CarpoolItem;
