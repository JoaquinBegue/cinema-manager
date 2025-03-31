// Import necessary components from react-bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

/**
 * NavBar component that displays the main navigation bar
 * @param {Object} props - Component props
 * @param {string} props.page - Current page identifier
 */
function NavBar({ page }) {
  return (
    // Main Navbar component with dark theme
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container fluid>
        {/* Brand logo/text that links to home page */}
        <Navbar.Brand href="/">Cinema</Navbar.Brand>
        {/* Hamburger menu toggle for mobile view */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {/* Navigation links container */}
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {/* Conditional rendering of Home link - only shows if not on home page */}
            {page !== "home" && <Nav.Link href="/">Home</Nav.Link>}
            {/* Placeholder link */}
            <Nav.Link href="#action2">Link</Nav.Link>
          </Nav>
          {/* Search form */}
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            {/* Search button */}
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;