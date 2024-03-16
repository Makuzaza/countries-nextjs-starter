import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const country = location.state.country;

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=a0e29bae5005e3e8cf1a0b229bf6cdff`
        );
        setWeather(response.data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country.capital]);

  if (loading) {
    return (
      <Col className="text-center m-5">
        <Spinner animation="border" role="status" className="center" variant="info">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  } else {
    return (
      <Container>
        <Row className="m-5">
          <Col>
          <Image thumbnail src={`https://source.unsplash.com/featured/500x300/?${country.name.official}`} />
          </Col>
          <Col>
            <h2 className="display-4">{country.common}</h2>
            <h3>Capital: {country.capital}</h3>
            {!error && weather && (
              <div>
                <p>
                  Right now it is <strong>{weather.main.temp}</strong> degrees in{" "}
                  {country.capital} and {weather.weather[0].description}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="light" onClick={() => navigate("/countries")}>
              Back to Countries
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default CountriesSingle;
