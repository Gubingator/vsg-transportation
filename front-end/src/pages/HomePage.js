import { Container } from "react-bootstrap";
import classes from "./HomePage.module.css";

function HomePage(props) {
  return (
    <div>
      <img
        src="https://res.cloudinary.com/hud9ala09/image/upload/v1457044154/zkv3yncyffd3p7aucyb8.png"
        className="img-fluid"
        alt="Responsive image"
      />

      <Container fluid className={classes.title}>
        <h1>STUDENT TRANSPORTATION</h1>
        <p className={classes.paragraph}>
          This website is a centralized location for the transiportation options
          available to Vanderbilt Students. Available to all students is a
          carpool scheduler where students may schedule or join a carpool, to
          the airport, for example, at school breaks.
        </p>
      </Container>
    </div>
  );
}

export default HomePage;
