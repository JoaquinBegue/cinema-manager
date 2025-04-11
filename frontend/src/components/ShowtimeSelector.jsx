import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Form from 'react-bootstrap/Form';
const todaysDate = new Date();

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSelect = (e) => {
    setSelectedDay(e.target.value);
  };

  const navigate = useNavigate();
  
  const handleClick = (e) => {
    const showtimeId = e.target.id.split('-')[1];
    
    if (onShowtimeSelect) {
      // If onShowtimeSelect prop is provided, call it with the showtime ID
      onShowtimeSelect(showtimeId);
    } else {
      // Otherwise, navigate to the showtime page (for backwards compatibility)
      navigate(`/showtime/${showtimeId}`);
    }
  };

  return (
    <div>
      <Form.Select onChange={handleSelect}>
        <option value="">Select a day</option>
        {formattedDays.map((day, idx) => (
          <option key={idx} value={day.original}>
            {day.formatted}
          </option>
        ))}
      </Form.Select>
      
      {selectedDay && showtimes[selectedDay] && (
        <div className="mt-3">
          <h5>Available Showtimes:</h5>
          <div className="d-flex flex-wrap gap-2">
            {showtimes[selectedDay].map((showtime, idx) => (
              <div key={idx} className="showtime p-2 border rounded" id={"showtime-" + showtime.id} onClick={handleClick}>
                {formatTime(showtime.start)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowtimeSelector;