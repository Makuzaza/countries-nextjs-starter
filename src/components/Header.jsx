import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db, logout } from "../auth/firebase";
import "../index.css";

const Header = () => {
  const [user] = useAuthState(auth);

  const [name, setName] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const name = doc.data().name;
        setName(name);
      });
    };

    if (user) {
      getUserData();
    }
  }, [user]);

  return (
    <Container fluid>
      <Row>
      <Navbar style={{ textAlign: "center"}} bg="light" variant="light" expand={window.innerWidth <= 200 ? "lg" : "md"}>
          <Container className="justify-content-end">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav style={{ gap: "10px", alignItems: "center"}}
              >
                <Link to="/">
                  <Button variant="contained">Home</Button>
                </Link>
                <Link to="/countries">
                  <Button variant="contained">Countries</Button>
                </Link>
                <Link to="/favourites">
                  <Button variant="contained">Favourites</Button>
                </Link>
                   { user ? (
                  <>
                    <span style={{margin: "10px"}}>Hello, {user.email}</span>
                
                    <Button onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button variant="contained">Register</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="contained">Login</Button>
                    </Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
    </Container>
  );
};

export default Header;