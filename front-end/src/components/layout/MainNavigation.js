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
    <Navbar className={classes.navbarCustom} collapseOnSelect expand="sm">
      <Container>
        <Navbar.Brand as={Link} to={"/"} className={classes.mainlogo}>
          VANDY TRANSIT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="ABOUT" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/"}>
                HOW THIS APP WORKS
              </NavDropdown.Item>
              <NavDropdown.Item href="contact-us">CONTACT US</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="INFORMATION" id="collasible-nav-dropdown">
              <NavDropdown.Item href="vanderbilt">VANDERBILT</NavDropdown.Item>
              <NavDropdown.Item href="nashville">NASHVILLE</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="lyft">LYFT</Nav.Link>
            <NavDropdown title="CARPOOL" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/"}>
                HOW TO USE
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/"}>
                SCHEDULE A CARPOOL
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/"}>
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
