import classes from "./Picture.module.css";
import {
  Button,
  Alert,
  Container,
  Navbar,
  NavDropdown,
  Nav,
  Overlay,
  Figure,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Picture(props) {
  function Circle(props2) {
    return (
      <div className={classes.centered}>
        <div className={classes.circle}>{props2.text}</div>
      </div>
    );
  }

  return (
    <div>
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        className="img-fluid"
        alt="Responsive image"
      />
      {/* {props.circleText !== "" ? (
        <Circle text={props.circleText} />
      ) : (
        <div></div>
      )} */}
    </div>
  );
}

export default Picture;
