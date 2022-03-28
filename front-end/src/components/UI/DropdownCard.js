import { Card, Row, Col, Button } from "react-bootstrap";
import classes from "./DropdownCard.module.css";

function DropdownCard(props) {
  return (
    <div>
      {props.clicked ? (
        <Card className={classes.thecard}>
          <Row>
            <Col style={{ paddingLeft: "17px" }}>
              {props.title}
              <Button
                onClick={props.theClick}
                className={classes.thebutton}
                style={{
                  fontFamily: "serif",
                  fontSize: "25pt",
                  lineHeight: "22pt",
                  paddingTop: "0",
                  paddingBottom: "5px",
                  paddingLeft: "0px",
                  paddingRight: "0",
                  borderRadius: "50%",
                  borderColor: "black",
                  color: "black",
                }}
              >
                +
              </Button>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card className={classes.thecard}>
          <Row>
            <Col style={{ paddingLeft: "17px" }}>
              {props.title}
              <Button
                onClick={props.theClick}
                className={classes.thebutton}
                style={{
                  fontFamily: "serif",
                  fontSize: "25pt",
                  lineHeight: "22pt",
                  paddingTop: "0",
                  paddingBottom: "5px",
                  paddingLeft: "0px",
                  paddingRight: "0",
                  borderRadius: "50%",
                  borderColor: "black",
                  color: "black",
                  backgroundColor: "gray",
                }}
                active
              >
                -
              </Button>
            </Col>
          </Row>
          <Card.Body style={{ backgroundColor: "white" }}>
            <Card.Text style={{ fontSize: "15pt" }}>{props.text}</Card.Text>
            {props.link ? (
              <a href={props.link} className={classes.thelink}>
                Link to {props.title}
              </a>
            ) : (
              <div></div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default DropdownCard;
