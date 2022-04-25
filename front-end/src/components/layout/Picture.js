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
  const blur = props.blur;

  return (
    <div>
      <Figure fluid="true" className={classes.fig}>
        <Figure.Image
          src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
          className="img-fluid"
          style={{
            margin: "0px",
            width: "100%",
            filter: blur,
            WebkitFilter: blur,
          }}
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
