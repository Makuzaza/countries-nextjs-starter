import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { getFavouritesFromSource } from "../auth/firebase";
import { initializeCountries } from "../store/countriesSlice";
import { addFavourite, removeFavourite } from "../store/favouritesSlice";
import "../index.css";

const Favourites = () => {
  const dispatch = useDispatch();

  const favourites = useSelector((state) => state.favourites.favourites);
  let countriesList = useSelector((state) => state.countries.countries);

  if (favourites.length > 0) {
    countriesList = countriesList.filter((country) =>
      favourites.includes(country.name.common)
    );
  } else {
    countriesList = [];
  }

  useEffect(() => {
    dispatch(initializeCountries());
    dispatch(getFavouritesFromSource());
  }, [dispatch]);

  return (
    <Container fluid>
      <Row xs={2} md={3} lg={4} className=" g-3">
        {countriesList.map((country) => (
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
                    <i className="bi bi-translate me-2">Languages: </i>
                    {Object.values(country.languages ?? {}).join(", ")}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <i className="bi bi-cash-coin me-2">Currency: </i>
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
                {favourites.some(
                  (favourite) => favourite === country.name?.common
                ) ? (
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Remove from Favourites</Tooltip>}>
                  <FavoriteBorderIcon 
                    onClick={() =>
                      dispatch(removeFavourite(country.name.common))
                    } style={{ color: 'red' }}
                  />
                    </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Add to Favourites</Tooltip>}>
                  <FavoriteIcon 
                    onClick={() => dispatch(addFavourite(country.name.common))}
                  />
                  </OverlayTrigger>

                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Favourites;