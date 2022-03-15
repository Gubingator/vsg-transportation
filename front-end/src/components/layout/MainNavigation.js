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
        <Navbar.Brand as={Link} to={"/"}>
          REACT-BOOTSTRAP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="About" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/"}>
                How this App Works
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to={"/new-meetup"}>
              Features
            </Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavigation;
