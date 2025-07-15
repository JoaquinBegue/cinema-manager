import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MovieDetails from "./pages/MovieDetails";
import Checkout from "./pages/Checkout";
import Reservations from "./pages/Reservations";
import Admin from "./pages/Admin";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="/checkout/reserve/:showtimeId/:seatsIds"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/cancel-reservation/:reservationId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            }
          />

          <Route path="/admin" element={<Admin />} />

          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
