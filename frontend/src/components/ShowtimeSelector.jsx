// Import necessary dependencies
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import "../styles/ShowtimeSelector.css";

/**
 * ShowtimeSelector Component
 * @param {Object} props
 * @param {Object} props.showtimes - Object containing showtimes grouped by days
 * Format: { 'day1': [{time: '...'}, ...], 'day2': [{time: '...'}, ...] }
 */
function ShowtimeSelector({ showtimes }) {
  // State to keep track of current active carousel slide
  const [index, setIndex] = useState(0);

  // Handler for carousel slide changes
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    // Bootstrap Carousel component with auto-sliding disabled (interval={null})
    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
      {/* Map through each day and its showtimes */}
      {Object.entries(showtimes).map(([day, dayShowtimes], idx) => (
        <Carousel.Item key={idx}>
          <div className="showtime-slide">
            {/* Day caption now appears above */}
            <div className="day-header">
              <h3>{day}</h3>
            </div>
            
            {/* Container for showtimes below the day */}
            <Container className="showtimes-container">
              {dayShowtimes.map((showtime, showIdx) => (
                <div key={showIdx} className="showtime-item">
                  <p>{showtime.time}</p>
                </div>
              ))}
              {dayShowtimes.map((showtime, showIdx) => (
                <div key={showIdx} className="showtime-item">
                  <p>{showtime.time}</p>
                </div>
              ))}
            </Container>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ShowtimeSelector;