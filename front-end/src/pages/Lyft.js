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
            text={<p>Waiver Info</p>}
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
            text={<p>You can get discount codes for Lyft.</p>}
            link={
              "https://www.vanderbilt.edu/movevu/lyft-ridehail-partnership/"
            }
          ></DropdownCard>
        </Row>
      </Container>
    </div>
  );
}

export default Lyft;
