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

  //   return (
  //     <div>
  //       <img
  //         src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
  //         className="img-fluid"
  //         alt="Responsive image"
  //       />
  //       {props.circleText !== "" ? (
  //         <Circle text={props.circleText} />
  //       ) : (
  //         <div></div>
  //       )}
  //     </div>
  //   );

  return (
    <div>
      <Figure fluid className={classes.fig}>
        <Figure.Image
          src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
          className="img-fluid"
          style={{ margin: "0px", width: "100%" }}
          alt="Responsive image"
        />
        {props.circleText !== "" ? (
          <Figure.Caption
            style={{
              display: "table-cell",
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "250px",
              textAlign: "center",
              fontSize: "25pt",
              fontFamily: "'Abel', sans-serif",
              color: "black",
              backgroundColor: "white",
              opacity: "0.7",
              borderRadius: "0%",
              fontWeight: "bold",
              transform: "translate(-50%, -50%)",
            }}
          >
            {props.circleText}
          </Figure.Caption>
        ) : (
          <div></div>
        )}
      </Figure>
    </div>
  );
}

export default Picture;