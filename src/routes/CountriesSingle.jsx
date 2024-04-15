import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const country = location.state.country;

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=a0e29bae5005e3e8cf1a0b229bf6cdff`
        );
        setWeather(response.data);
   
        const countryResponse = await axios.get(
          `https://restcountries.com/v3.1/all`
        );

        const selectedCountryData = countryResponse.data.find(
          item => item.name.common === country.name.common
        );

        const capitalLatLng = selectedCountryData.capitalInfo.latlng;

        setMapCenter({
          lat: capitalLatLng[0],
          lng: capitalLatLng[1],
          city: country.capital,
          country: country.name.common
        });
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country.capital, country.name.common]);

  if (loading) {
    return (
      <Col className="text-center m-5">
        <Spinner
          animation="border"
          role="status"
          className="center"
          variant="info"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  } else {
    return (
      <Container>
        <Row className="m-5">
          <Col>
            {" "}
            <Image
              thumbnail
              src={`https://source.unsplash.com/featured/1600x900?${country.name.common}`}
            />
          </Col>
          <Col>
            <h2 className="display-4">{country.name.common}</h2>
            <h3>Capital {country.capital}</h3>
            {!error && weather && (
              <div>
                <p>
                  Right now it is <strong>{weather.main.temp}</strong> C degrees in{" "}
                  {country.capital} and {weather.weather[0].description}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
       
              </div>
            )}
          </Col>
        </Row>
        
        <Row>
          <Col>
          <LoadScript
            googleMapsApiKey="AIzaSyAds8lxAuoSad_M-RQc9Hd2xa7Y7yk8nwM"
            libraries={libraries} >
              <GoogleMap
                zoom={10}
                center={mapCenter} // Set the map center to the country's capital
                mapContainerStyle={{ width: "100%", height: "400px" }}>
                  <Marker position={mapCenter} />
              </GoogleMap>
          </LoadScript>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button style={{margin: "20px"}} onClick={() => navigate("/countries")}>
              Back to Countries
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default CountriesSingle;
