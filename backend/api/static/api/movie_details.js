var reservedSeats = [];
var showtimeId = 0;

document.addEventListener('DOMContentLoaded', () => {
  console.log("hi");
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