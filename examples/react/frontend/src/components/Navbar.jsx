import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";

const baseurl = "http://127.0.0.1:3000";

function ColorSchemesExample() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseurl}/api/categories`)
      .then((res) => {
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand href="/home#qeen-dev">qeen</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home#qeen-dev">Home</Nav.Link>
              <NavDropdown title="Categories" id="basic-nav-dropdown">
                {categories.map((cat) => (
                  <NavDropdown.Item key={cat.id} href={`/categoreis/${cat.id}#qeen-dev`}>
                    {cat.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link href="/cart#qeen-dev">Cart</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
