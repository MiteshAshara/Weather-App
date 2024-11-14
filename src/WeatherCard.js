import React, { useState, useEffect } from 'react';
import citiesData from './cities.json'; 

const WeatherCard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); 

  const API_KEY = 'ac05bff3c495565e46cb50dccd55f469';

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Enter a proper city name or check the API key.');
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const filteredCities = citiesData.filter((city) =>
        city.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1); // Reset selection index on input change
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName); 
    setSuggestions([]);
    fetchWeatherByCity(cityName); 
    document.getElementById('city-input').blur(); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleCitySelect(suggestions[selectedIndex].name);
      setSuggestions([]); // Clear suggestions after selection
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      setCity(suggestions[selectedIndex].name);
    }
  }, [selectedIndex, suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === '') {
      setError('Please enter a city name.');
      return;
    }
    fetchWeatherByCity(city);
    setCity('');
  };

  return (
    <div className="row d-flex justify-content-center py-5">
      <div className="col-md-8 col-lg-6 col-xl-5">
        <div className="card text-body" style={{ borderRadius: '35px' }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="city-input"
                  placeholder="Enter city name"
                  value={city}
                  onChange={handleCityChange}
                  onKeyDown={handleKeyDown} 
                />
              </div>
            </form>

            {suggestions.length > 0 && (
              <ul className="list-group position-absolute" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`list-group-item list-group-item-action ${selectedIndex === index ? 'bg-secondary text-white' : ''}`}
                    onClick={() => handleCitySelect(suggestion.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}

            {weatherData && !error && (
              <>
                <div className="d-flex">
                  <h6 className="flex-grow-1">{weatherData.name}</h6>
                  <h6>{new Date(weatherData.dt * 1000).toLocaleTimeString()}</h6>
                </div>

                <div className="d-flex flex-column text-center mt-5 mb-4">
                  <h6 className="display-4 mb-0 font-weight-bold">
                    {weatherData.main.temp}°C
                  </h6>
                  <span className="small" style={{ color: '#868B94' }}>
                    {weatherData.weather[0].description}
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <div className="flex-grow-1" style={{ fontSize: '1rem' }}>
                    <div>
                      <i className="fas fa-wind fa-fw" style={{ color: '#868B94' }}></i> 
                      <span className="ms-1">{weatherData.wind.speed} km/h</span>
                    </div>
                    <div>
                      <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i> 
                      <span className="ms-1">{weatherData.main.humidity}%</span>
                    </div>
                    <div>
                      <i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i> 
                      <span className="ms-1">{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div>
                    <img
                      src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                      width="100px"
                      alt="Weather Icon"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="alert alert-danger mt-3">{error}</div>
            )}

            {!weatherData && !error && (
              <div className="text-center mt-3">
                {loading
                  ? 'Loading...'
                  : 'Enter a city name above to get weather information.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
