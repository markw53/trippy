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
  return axios.post(`${apiBase}/trips`, tripData)
}

export const fetchItinerary = (tripId) => {
  return axios.get(`${apiBase}/trips/${tripId}/activities/itinerary`);
};

export const fetchPossibility = (tripId) => {
  return axios.get(`${apiBase}/trips/${tripId}/activities/possibility`);
};

export const postPossibility = (trip_id, possibility) => {
  return axios.post(`${apiBase}/trips/${trip_id}/activities`, possibility);
};

export const fetchUserDetails = (user_id) => {
  return axios.get(`${apiBase}/users/${user_id}`);
}

export const patchUserDetails = (userData) => {
  return axios.patch(`${apiBase}/users/${userData.user_id}`, userData);
}