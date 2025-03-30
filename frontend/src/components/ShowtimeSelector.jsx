import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import "../styles/ShowtimeSelector.css";

function ShowtimeSelector({ showtimes }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
      {Object.entries(showtimes).map(([day, dayShowtimes], idx) => (
        <Carousel.Item key={idx}>
          <Carousel.Caption>
            <h3>{day}</h3>
            <div className="showtimes-container">
              {dayShowtimes.map((showtime, showIdx) => (
                <div key={showIdx} className="showtime-item">
                  {/* Display showtime details here */}
                  <p>{showtime.time}</p>
                  {/* Add other showtime properties as needed */}
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