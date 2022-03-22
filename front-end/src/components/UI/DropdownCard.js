import { Card, Row, Col, Button } from "react-bootstrap";
import classes from "./DropdownCard.module.css";

function DropdownCard(props) {

  return (
    <div>
      {props.clicked ? (
        <Card className={classes.thecard}>
          <Row>
            <Col>
              {props.title}
              <Button onClick={props.theClick} className={classes.thebutton}>
                Expand
              </Button>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card className={classes.thecard}>
          <Row>
            <Col>
              {props.title}
              <Button
                onClick={props.theClick}
                className={classes.thebutton}
                active
              >
                Close
              </Button>
            </Col>
          </Row>
          <Card.Body>
            <Card.Text>{props.text}</Card.Text>
						<a href={props.link}>Link to {props.title}</a>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default DropdownCard;
