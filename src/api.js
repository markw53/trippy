import axios from "axios";

const apiBase = "https://backend-for-trippy.onrender.com/api";

export const fetchTrips = () => {
  return axios.get(`${apiBase}/trips`);
};

export const fetchUserTrips = (userId) => {
  return axios.get(`${apiBase}/users/${userId}/trips`);
};

export const fetchTripById = (tripId) => {
    return axios.get(`${apiBase}/trips/${tripId}`)
}

export const createTrip = (tripData) => {
  return axios.post(`${apiBase}/trips`)
}