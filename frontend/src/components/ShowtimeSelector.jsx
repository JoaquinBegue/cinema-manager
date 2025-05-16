import { useState } from 'react';

import Form from 'react-bootstrap/Form';
const todaysDate = new Date();

// Displays the showtimes and handle its selection. Receives "onShowtimeSelect"
// function to set the selected showtime ID in MovieDetails page.
function ShowtimeSelector({ showtimes, onShowtimeSelect }) {
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Get and format days to compare.
  const days = Object.keys(showtimes);
  const todayFormatted = `${todaysDate.getFullYear()}-${String(todaysDate.getMonth() + 1).padStart(2, '0')}-${String(todaysDate.getDate()).padStart(2, '0')}`;
  
  // Format days to display.
  let formattedDays = days.map((day) => {
    const parts = day.split('-');
    const year = parts[0];
    const month = parseInt(parts[1]);
    const dayNum = parseInt(parts[2]);
    const weekday = parts[3];
    
    // Check if this day is today
    const isToday = day.startsWith(todayFormatted);
    
    return {
      original: day,
      formatted: isToday ? `Today, ${dayNum}/${month}` : `${weekday}, ${dayNum}/${month}`
    };
  });

  const handleSelect = (e) => {
    setSelectedDay(e.target.value);
  };

  // Handle showtime selection.
  const handleClick = (e) => {
    const showtimeId = e.target.id.split('-')[1];

    // Toggle selected class from other showtimes.
    const showtimes = document.querySelectorAll('.showtime');
    showtimes.forEach((showtime) => {
      showtime.classList.remove('selected');
    });
    // Toggle selected class from selected showtime.
    e.target.classList.toggle('selected');
    
    // Set selected showtime ID in MovieDetails page.
    onShowtimeSelect(showtimeId);
  };

  return (
    <div>
      {/* Day selection. */}
      <Form.Select onChange={handleSelect}>
        <option value="">Select a day</option>
        {formattedDays.map((day, idx) => (
          <option key={idx} value={day.original}>
            {day.formatted}
          </option>
        ))}
      </Form.Select>
      
      {/* Showtimes for selected day. Display when a day is selected and showtimes are available. */}
      {selectedDay && showtimes[selectedDay] && (
        <div className="mt-3">
          <h5>Available Showtimes:</h5>
          <div className="d-flex flex-wrap gap-2">
            {showtimes[selectedDay].map((showtime, idx) => (
              <div key={idx} className="showtime p-2 border rounded"
              id={"showtime-" + showtime.id} onClick={handleClick}>
                {showtime.start_time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowtimeSelector;