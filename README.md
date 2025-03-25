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

# Movie Showtime Scheduling System Design

This document outlines the design for a movie showtime scheduling system, covering its core components, functionality, and improvements over a basic implementation.

## Core Components

### 1. Movies

*   **Attributes:**
    *   `title` (string): The name of the movie.
    *   `description` (text): A synopsis or overview.
    *   `genre` (string, potentially a choice field): Action, Comedy, Drama, etc.
    *   `duration` (integer): Length of the movie in minutes.
    *   `release_date` (date): When the movie was released.
    *   `poster_url` (string): URL to the movie's poster image.
    *   `trailer_url` (string): URL to the movie's trailer video.
    *   `rating` (float): Average user rating (optional).
    *   `cast` (text): List of actors and directors.
    *   `status` (string, choice field): "coming soon", "now playing", "ended"
*   **Relationships:** One-to-many with `Showtime`.

### 2. Auditoriums (Theaters/Screens)

*   **Attributes:**
    *   `name` (string): "Auditorium 1", "Screen A", etc.
    *   `capacity` (integer): Total number of seats.
    *   `location` (string): Address or description of the cinema.
    *   `type` (string, choice field): "regular", "imax", "3d"
*   **Relationships:**
    *   One-to-many with `Showtime`.
    *   One-to-many with `Seat`.

### 3. Seats

*   **Attributes:**
    *   `auditorium` (foreign key to `Auditorium`): Which auditorium the seat belongs to.
    *   `row` (string): Row identifier (A, B, C, etc.).
    *   `number` (integer): Seat number within the row.
    *   `type` (string, choice field): "regular", "vip", "couple"
*   **Relationships:** Many-to-many with `Reservation` (through a join table).

### 4. Showtimes

*   **Attributes:**
    *   `movie` (foreign key to `Movie`): The movie being shown.
    *   `auditorium` (foreign key to `Auditorium`): The auditorium where it's playing.
    *   `start` (datetime): The date and time the show starts.
    *   `end` (datetime): The date and time the show ends (calculated based on `start` and `movie.duration`).
    *   `status` (string, choice field): "available", "sold out", "cancelled", "ended".
    *   `price` (decimal): Price of the ticket for this showtime.
*   **Relationships:** One-to-many with `Reservation`.

### 5. Reservations

*   **Attributes:**
    *   `user` (foreign key to `User`): The user who made the reservation.
    *   `showtime` (foreign key to `Showtime`): The showtime being reserved.
    *   `reservation_time` (datetime): When the reservation was made.
    *   `status` (string, choice field): "pending", "confirmed", "cancelled", "expired".
    *   `total_price` (decimal): Total price of the reservation.
*   **Relationships:** Many-to-many with `Seat` (through a join table).

### 6. Users

*   **Attributes:**
    *   `username` (string)
    *   `password` (string)
    *   `email` (string)
    *   `first_name` (string)
    *   `last_name` (string)
    *   `phone` (string)
*   **Relationships:** One-to-many with `Reservation`

## Key Functionality

### 1. Scheduling Showtimes

*   **Admin Interface:** A way for cinema staff to create showtimes, selecting the movie, auditorium, start time, and setting the status.
*   **Conflict Detection:** The system should prevent scheduling overlapping showtimes in the same auditorium.
*   **Automatic End Time:** Calculate the end time based on the movie's duration.
*   **Status Update:** The system should update the showtime status automatically (e.g., "ended" when the start time is in the past).

### 2. Seat Management

*   **Auditorium Layout:** Define the layout of each auditorium (rows and seat numbers).
*   **Seat Availability:** Track which seats are available for each showtime.
*   **Seat Selection:** Allow users to select their preferred seats during the reservation process.
*   **Seat Type:** Allow different seat types, such as "vip" or "couple".

### 3. Reservation Process

*   **Showtime Selection:** Users browse available showtimes for a movie.
*   **Seat Selection:** Users choose their seats from the auditorium layout.
*   **User Authentication:** Users log in or register to make a reservation.
*   **Payment:** Integrate with a payment gateway (e.g., Stripe, PayPal) to handle payments.
*   **Confirmation:** Send a confirmation email or display a confirmation page with reservation details.
*   **Reservation Status:** The system should update the reservation status automatically (e.g., "expired" when the showtime start time is in the past).

### 4. Search and Filtering

*   **By Movie:** Find showtimes for a specific movie.
*   **By Date:** Find showtimes on a particular date.
*   **By Time:** Find showtimes within a specific time range.
*   **By Auditorium:** Find showtimes in a particular auditorium.
*   **By Genre:** Find showtimes for movies of a specific genre.

### 5. User Accounts

*   **Registration:** Allow users to create accounts.
*   **Login:** Secure login system.
*   **Profile:** Users can view their reservation history.

### 6. API

*   **Endpoints:**
    *   `/api/movies/`: List all movies, filter by category.
    *   `/api/movies/{movie_id}/`: Get movie details and showtimes.
    *   `/api/showtimes/{showtime_id}/seats/`: Get seat availability for a showtime.
    *   `/api/reservations/`: Create a new reservation.
    *   `/api/users/`: Create a new user.
    *   `/api/users/{user_id}/reservations/`: Get user reservations.

## Improvements over a Basic Implementation

*   **Auditorium Model:** Explicitly define auditoriums.
*   **Seat Types:** Handle different seat types (VIP, etc.).
*   **Reservation Status:** Track the status of a reservation.
*   **Showtime Status:** Track the status of a showtime.
*   **Payment:** Handle payment processing.
*   **User Profile:** Manage user profiles and reservation history.
*   **Showtime End Time:** Calculate the showtime end time.
*   **Reservation Total Price:** Calculate the reservation total price.

## Technology Choices

*   **Backend:** Python/Django
*   **Database:** PostgreSQL
*   **API:** Django REST Framework
*   **Frontend:** React, Vue, or Angular
*   **Payment Gateway:** Stripe, PayPal

## Example Workflow

1.  **Admin:**
    *   Creates a new movie.
    *   Defines auditoriums.
    *   Schedules showtimes for the movie in different auditoriums.
2.  **User:**
    *   Browses the website, sees the movie and available showtimes.
    *   Selects a showtime.
    *   Sees the auditorium layout and available seats.
    *   Selects seats.
    *   Logs in or registers.
    *   Pays for the reservation.
    *   Receives a confirmation.
