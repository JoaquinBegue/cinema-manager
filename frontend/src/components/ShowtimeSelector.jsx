// Import necessary dependencies
import { useState } from 'react';
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
          <Carousel.Caption>
            {/* Display the day */}
            <h3>{day}</h3>
            {/* Container for all showtimes of the current day */}
            <div className="showtimes-container">
              {/* Map through individual showtimes for the current day */}
              {dayShowtimes.map((showtime, showIdx) => (
                <div key={showIdx} className="showtime-item">
                  {/* Display the time for each showtime slot */}
                  <p>{showtime.time}</p>
                  {/* Note: Additional showtime properties can be added here */}
                </div>
              ))}
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ShowtimeSelector;