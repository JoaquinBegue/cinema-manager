# cinema-manager
A practice project that emulates a cinema website, with users, movie management and reservations.

## Implementations
Django and django REST framework.
Postgres database.
JWT for authentication.

## Website structure

### Navbar:
The navbar will let the users navigate to the main page, access login and register forms and search for movies.
The login and register forms will be displayed from the navbar, avoiding using a whole page only to display a single form.

### Main page / index:
The main page will list all the available movies and let the users browse them.
Clicking in a movie will lead the user to the specific movie page.

### Movie page:
This will display some movie data and synopsis, along with the showtimes available for that movie.
If the user is authenticated, it will be able to make a reservation for that movie.

### Reservations page:
This page will list all the reservations a user has made, and let him cancel them.

## Data Scructure
The data will be organized with the following models:

### User:
Django's own user model.

### Movie:
A simple model that will store some movie info.

### Reservation:
A model that will connect a user with a movie, along with the showtime, room and seats.

### Showtime:
This model will store each movie showtime date, schedules and status.

### Seat:
A model to keep track of the reservations a seat has.

### Schedule:
A simple model to store time periods.

