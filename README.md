# cinema-manager
A practice project that emulates a cinema website.<br>
The app will allow users to sign up, log in, browse movies, reserve seats for specific showtimes, and manage their reservations. The system will feature user authentication, movie and showtime management, seat reservation functionality, and reporting on reservations.

Technologies to apply:<br>
- Django and django REST framework for backend.<br>
- Postgres database.
- JWT for authentication.

# Implementations
The app consist of the following modules.
- Admin site.
- Movie browser page.
- Movie details page.
- Reservation system.
- Reservation page.
- Auth system.

## Admin site:
This site should let the staff manage movies, showtimes, reservations, and users.

- [x] Movie managent (CRUD).
- [x] Showtime management (CRUD).
- [x] Reservation management (CRUD).
- [ ] User management (CRUD and role assignment).

## Movie browser page:
Index page. Here all the movies will be listed, letting the user search and filter the movies.

- [ ] Movie listing.
- [ ] Search bar.
- [ ] Category filtering.
  
## Movie details page:
This is the page that displays the movie information and allows the user to make a reservation for a specific movie showtime.

- [ ] Movie info display.
- [ ] Showtimes display.
- [ ] Reservation system display.

## Reservation system:
This system should allow the user to reserve seats for a specific showtime, keeping track of seat availability.
- [ ] Reservation and availability management.

## Reservation page:
This page should allow the user to see all their reservations.

- [ ] Reservation listing.

## Auth system:
The app should let the users register, login and logout. The users should be divided in two roles: staff and regular users, with different levels of authorization.

- [ ] Register and login page.
- [ ] Role assingment system.

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

