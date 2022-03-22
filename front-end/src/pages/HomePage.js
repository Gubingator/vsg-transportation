import { Container } from "react-bootstrap";
import classes from "./HomePage.module.css";
import Picture from "../components/layout/Picture";

function HomePage(props) {
  return (
    <div>
      <Picture circleText="" />

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
