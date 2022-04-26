import { useState } from "react";
import { Row, Container } from "react-bootstrap";
import DropdownCard from "../components/UI/DropdownCard";
import classes from "./Lyft.module.css";
import Picture from "../components/layout/Picture";

function Lyft(props) {
  const [Waiver, setWaiver] = useState(true);
  const [Codes, setCodes] = useState(true);

  function HandleWaiverOnClick() {
    if (Waiver) {
      setWaiver(false);
    } else {
      setWaiver(true);
    }
  }

  function HandleCodesOnClick() {
    if (Codes) {
      setCodes(false);
    } else {
      setCodes(true);
    }
  }

  return (
    <div>
      <Picture circleText="LYFT" blur="blur(4px)" />

      <Container className={classes.page} fluid>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={Waiver}
            title="Waiver"
            theClick={HandleWaiverOnClick}
            text={
              <p>
                Vanderbilt has a preferred partnership with Lyft to offer a
                flexible transportation option for faculty, staff, and students
                using ridehail services while conducting official university
                business. Departments can now establish ride parameters for
                programmatic transportation needs through the Lyft dashboard.
                <br />
                The following Waiver and Release Form, or alternate
                acknowledgement protocol approved by Transportation and Mobility
                and Purchasing and Payment Services, must be completed by each
                rider.
              </p>
            }
            link={
              "https://www.vanderbilt.edu/movevu/lyft-ridehail-partnership-detailed-information-for-vanderbilt-programs/"
            }
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={Codes}
            title="Codes"
            theClick={HandleCodesOnClick}
            text={
              <p>
                Completing the above code makes you eligible to receive Lyft
                discout codes for the remainder of your time at Vanderbilt.
                <br />
                More information regarding the Lyft partnership can be found{" "}
                <a
                  href={
                    "https://www.vanderbilt.edu/movevu/lyft-ridehail-partnership/"
                  }
                >
                  here.
                </a>
              </p>
            }
          ></DropdownCard>
        </Row>
      </Container>
    </div>
  );
}

export default Lyft;
