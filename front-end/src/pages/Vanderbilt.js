import { useState } from "react";
import { Row, Container } from "react-bootstrap";
import DropdownCard from "../components/UI/DropdownCard";
import classes from "./Vanderbilt.module.css";
import Picture from "../components/layout/Picture";

function Vanderbilt(props) {
  const [VandyRide, setVandyRide] = useState(true);
  const [MoveVU, setMoveVU] = useState(true);

  function HandleVandyOnClick() {
    if (VandyRide) {
      setVandyRide(false);
    } else {
      setVandyRide(true);
    }
  }

  function HandleMoveVUOnClick() {
    if (MoveVU) {
      setMoveVU(false);
    } else {
      setMoveVU(true);
    }
  }

  return (
    <div>
      <Picture circleText="VANDERBILT TRANSPORTATION" />

      <Container className={classes.page} fluid>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={VandyRide}
            title="VandyRide"
            theClick={HandleVandyOnClick}
            text={
              <p>
                The Vanderbilt University Department of Public Safety
                administers the on campus, nighttime shuttle service VandyRide.
                VandyRide service will return for the fall semester starting
                Aug. 16 with two shuttles, one on the Gold Route and one on the
                Black Route, and one or more shuttles designated for Point to
                Point service. Service runs from 6 p.m. to 1 a.m seven days per
                week. There may be longer wait times for riders due to capacity
                restrictions related to COVID-19 safety during this time. For
                transportation requests after hours, a walking escort may be
                requested, at any time, by calling the VUPS Communications
                Center at 615-322-2745. <br />
                <br />
                Gold Route – Express route from the Peabody campus to main
                campus <br />
                Black Route – Circulates campus clockwise
              </p>
            }
            link={""}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={MoveVU}
            title="MoveVU"
            theClick={HandleMoveVUOnClick}
            text={
              <p>
                Vanderbilt has an exciting new tool, the MoveVU Commute Hub,
                which includes an app and website that is easy to use and
                provides all your commute information in one place.
              </p>
            }
            link={"https://www.vanderbilt.edu/movevu/movevu-commute-hub/"}
          ></DropdownCard>
        </Row>
        <Row>
          <p className={classes.extraInfo}>
            For general information see the{" "}
            <a
              href={"https://www.vanderbilt.edu/movevu/transportation-options/"}
            >
              Vanderbilt Transportation Page.
            </a>
          </p>
        </Row>
      </Container>
    </div>
  );
}

export default Vanderbilt;
