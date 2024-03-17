import { useEffect } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { initializeCountries } from "../store/countriesSlice";
import { removeFromFavourites } from "../store/favouritesSlice";

const Favourites = () => {
  const dispatch = useDispatch();

  const favourites = useSelector((state) => state.favourites.favourites);

  // TODO: Implement logic to retrieve favourites later.
  useEffect(() => {
    dispatch(initializeCountries());
  }, [dispatch]);

  const removeFromFavouritesHandler = (countryName) => {
    console.log("Removing from favourites:", countryName);
    dispatch(removeFromFavourites(countryName));
    console.log("New favourites:", favourites); // Check if favourites array is updated
  };

  return (
    <Container fluid>
      <Row xs={2} md={3} lg={4} className=" g-3">
        {favourites.map((country) => (
          <Col key={country.name.official} className="mt-5">
            <Card className="h-100">
              <Card.Img
                variant="top"
                className="rounded h-50"
                src={country.flags.svg}
                style={{
                  objectFit: "cover",
                  minHeight: "200px",
                  maxHeight: "200px",
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{country.name.common}</Card.Title>
                <Card.Subtitle className="mb-5 text-muted">
                  {country.name.official}
                </Card.Subtitle>
                <ListGroup
                  variant="flush"
                  className="flex-grow-1 justify-content-end"
                >
                  <ListGroup.Item>
                    <i className="bi bi-translate me-2">Language:</i>
                    {Object.values(country.languages ?? {}).join(", ")}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <i className="bi bi-cash-coin me-2">Currency:</i>
                    {Object.values(country.currencies || {})
                      .map((currency) => currency.name)
                      .join(", ")}
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <i className="bi bi-people me-2">Population:</i>
                    {country.population.toLocaleString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <i className="bi bi-people me-2">Area:</i>
                      {country.area.toLocaleString()}
                    </ListGroup.Item>
                </ListGroup>
                <button
                  className="btn btn-danger mt-auto"
                  onClick={() => removeFromFavouritesHandler(country.name.common)}>
                  Remove from Favourites
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Favourites;
