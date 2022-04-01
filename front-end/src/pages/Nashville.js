import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  CloseButton,
  Dropdown,
  DropdownButton,
  Container,
} from "react-bootstrap";
import DropdownCard from "../components/UI/DropdownCard";
import classes from "./Nashville.module.css";
import Picture from "../components/layout/Picture";

function Nashville(props) {
  const [WeGO, setWeGO] = useState(true);
  const [Lyft, setLyft] = useState(true);
  const [TransitApp, setTransitApp] = useState(true);

  function HandleWeGOnClick() {
    if (WeGO) {
      setWeGO(false);
    } else {
      setWeGO(true);
    }
  }

  function HandleLyftonClick() {
    if (Lyft) {
      setLyft(false);
    } else {
      setLyft(true);
    }
  }

  function HandleTransitAppOnClick() {
    if (TransitApp) {
      setTransitApp(false);
    } else {
      setTransitApp(true);
    }
  }

  return (
    <div>
      <Picture circleText="NASHVILLE TRANSPORTATION" />
      <Container className={classes.page} fluid>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={WeGO}
            title="WeGO Buses"
            theClick={HandleWeGOnClick}
            text={
              <p>
                WeGo Public Transit is Nashville’s provider of local and
                regional bus and commuter rail service. Vanderbilt’s program
                provides all full-time and part-time Vanderbilt University
                students, faculty, staff and postdocs with free access to WeGo
                local buses, regional buses and WeGo Star with their Commodore
                Card. This service is available for any place and time, not only
                when commuting to and from campus.
              </p>
            }
            link={"https://www.wegotransit.com/"}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={Lyft}
            title="Lyft"
            theClick={HandleLyftonClick}
            text={
              <p>
                Ridehail services like Uber and Lyft can be used on campus. The
                university is piloting nine designated ridehail pick-up and
                drop-off locations around campus. The locations are marked with
                signage and are available to select in the Uber and Lyft mobile
                apps. The areas include E. Bronson Ingram Circle, Kirkland
                Esplanade, Sarratt Student Center/Rand Hall, the Engineering and
                Science Building, McGugin Center, Blakemore House, VRWC Lot 27
                across from Morgan Circle, Crawford House and Hank Ingram House.
                <br />
                <br />
                Vanderbilt has a preferred partnership with Lyft to offer a
                flexible transportation option for faculty, staff, and students
                using ridehail services while conducting official university
                business. Departments can now establish ride parameters for
                programmatic transportation needs through the Lyft dashboard.
                More information about Lyft discounts may be found on the{" "}
                <a href={"lyft"}>Lyft Page.</a>
              </p>
            }
            link={""}
          ></DropdownCard>
        </Row>
        <Row className={classes.cardRow}>
          <DropdownCard
            clicked={TransitApp}
            title="TransitApp"
            theClick={HandleTransitAppOnClick}
            text={
              <p>
                Other information for transportation in Nashville can be found
                on the transit app. Included is information about planning rides
                on the WeGo Buses as well as lyft. Follow this{" "}
                <a href={"https://transitapp.com/region/nashville"}>link</a> and
                download the app.
              </p>
            }
            link={""}
          ></DropdownCard>
        </Row>
      </Container>
    </div>
  );
}

export default Nashville;
