import { Col, Row, Card, Button} from "react-bootstrap";
import classes from "./CarpoolItem.module.css";

function CarpoolItem(props) {
  return (
    <Card className={classes.cardData}>
      <Row>
        <Col>Location: {props.carpool_ref["location"]}</Col>
        <Col>Open seats: {3 - props.carpool_ref["students"].length}</Col>
        <Col>
          Studuents:
          <ul className={classes.list}>
            {props.carpool_ref["students"].map((student) => {
              return <li key={student}>{student}</li>;
            })}
          </ul>
        </Col>
        <Col>Leaving Time: {props.carpool_ref["time"].substring(0, 5)}</Col>
        <Col>
				<Button className={classes.buttonData}>Join Carpool</Button>
				</Col>
      </Row>
    </Card>
  );
}

export default CarpoolItem;