import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./MainNavigation.module.css";

import {
  Button,
  Alert,
  Container,
  Navbar,
  NavDropdown,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function MainNavigation() {
  return (
    <Navbar className={classes.navbarCustom} collapseOnSelect expand="md">
      <Container style={{ margin: "6px" }}>
        <Navbar.Brand as={Link} to={"/"} className={classes.mainlogo}>
          VANDY TRANSIT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="ABOUT" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/contact-us"}>
                CONTACT US
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="INFORMATION" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/vanderbilt"}>
                VANDERBILT
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/nashville"}>
                NASHVILLE
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to={"/lyft"}>
              LYFT
            </Nav.Link>
            <NavDropdown title="CARPOOL" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/schedule-carpool"}>
                SCHEDULE A CARPOOL
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/join-carpool"}>
                JOIN A CARPOOL
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavigation;
