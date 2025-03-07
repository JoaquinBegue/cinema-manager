var reservedSeats = [];
var showtimeId = 0;

const today = new Date().toISOString().slice(0, 10);

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded");
  const selectElement = document.querySelector('.showtime-day-select');
  selectElement.addEventListener('change', (event) => {
    const date = event.target.value;
    displayShowtimes(date);
  });
  setTodayShowtimes();
} );

function showtimeSelected(showtime) {
  showtimeId = showtime.value;
  fetch(`/api/showtime/${showtimeId}`)
    .then(response => response.json())
    .then(data => {
      // Get the table.
      let table = document.getElementById("seats");
      // Clone the cell and remove it.
      let cellElement = document.getElementById("seat_A1").cloneNode(true);
      document.getElementById("seat_A1").remove();

      // Populate the table with the seats.
      let currentRow = 'A';
      let row = document.getElementById("row_A");

      data[1].forEach(seat => {
        // Create a new cell.
        let cell = cellElement.cloneNode(true);
        cell.id = `seat_${seat.row}${seat.column}_${seat.id}`;
        cell.innerHTML = `${seat.row}${seat.column}`;

        // Set the cell availability.
        if (seat.available) {
          cell.style.backgroundColor = "green";
          cell.onclick = () => seatSelected(cell);
        } else {
          cell.style.backgroundColor = "red";
        }
        cell.style.color = "white";

        // Add the cell to the row.
        if (seat.row == currentRow) {
          row.appendChild(cell);
        } else {
          currentRow = seat.row;
          row = table.insertRow();
          row.appendChild(cell);
        }   
      });

    });
    document.getElementById("showtime-seats").style.display = "block";
}

function seatSelected(seat) {
  let seatId = seat.id.substring(seat.id.lastIndexOf("_") + 1);
  if (reservedSeats.includes(seatId)) {
    seat.style.backgroundColor = "green";
    reservedSeats = reservedSeats.filter(item => item !== seatId);
  } else {
    seat.style.backgroundColor = "blue";
    reservedSeats.push(seatId);
  }
  console.log(reservedSeats);
}

function reserveSeats() {
  fetch(`/api/reserve/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      seats: reservedSeats,
      showtime: showtimeId
    })
  })
  .then(response => {
    if (response.status === 201) {
      alert("Seats reserved successfully!");
      window.location.reload();
    } else {
      alert("Failed to reserve seats!");
    }
  });
}

function displayShowtimes(date) {
  // Get all showtime bodies.
  let showtimeBodies = document.querySelectorAll(".showtimes-body");
  // Hide all showtime bodies.
  showtimeBodies.forEach(body => {
    body.style.display = "none";
  });
  // Show the showtimes for the selected date.
  if (date === "today") {
    date = today
  }
  document.getElementById(`showtimes-${date}`).style.display = "block";
}

function setTodayShowtimes() {    
  // Get all showtime days.
  let showtimeDays = document.querySelectorAll(".showtime-day");
  // Iterate through the elements.
  showtimeDays.forEach(element => {
    // If the element's date is today's date.
    if (element.value === today) {
      // Hide the element and display the showtimes.
      element.style.display = "none";
      displayShowtimes(element.value);
      return;
    }
  });
}