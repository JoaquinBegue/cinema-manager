let csrfToken = ""

const ticketPrice = 12;
let container = ""
let seats = ""
let count = ""
let total = ""
let selectedSeats = []
let showtimeId = 0

document.addEventListener('DOMContentLoaded', e => {
  csrfToken = getCookie('csrftoken');

  container = document.querySelector('.container');
  seats = document.querySelectorAll('.row .seat:not(.occupied)');
  count = document.getElementById('count');
  total = document.getElementById('total');
  showtimeId = document.getElementById('showtime-id').value;
  

  // Initial count and total set
  updateSelectedCount();

  // Seat click event
  container.addEventListener('click', e => {
    seatClick(e);
  });
})

// Seat clicking
function seatClick(e) {
  // Check if event's target is a seat.
  if (e.target.classList.contains('seat')) {
    const seat = e.target;
    const seatId = seat.querySelector('#seat-id').value;
    // If seat is available select it.
    if (
      !seat.classList.contains('occupied') &&
      !seat.classList.contains('selected')
    ) {
      seat.classList.toggle('selected');
      selectedSeats.push(seatId);
      console.log(selectedSeats);
      updateSelectedCount();
    
    // If seat is selected, deselect it.
    } else if (seat.classList.contains('selected')) {
      seat.classList.toggle('selected');
      const index = selectedSeats.indexOf(seatId);
      if (index > -1) {
        selectedSeats.splice(index, 1);
      }
      console.log(selectedSeats);
      updateSelectedCount();
    }
  }
}

// Update total and count
function updateSelectedCount() {
  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice; 
}

// Reservation
function reserveSeats() {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat.");
    return;
  }
  
  fetch('/api/reserve/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({
      seats: selectedSeats,
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

// Get cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}