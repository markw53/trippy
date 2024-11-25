import axios from "axios";

const apiBase = "https://backend-for-trippy.onrender.com/api";

export const fetchTrips = () => {
  return axios.get(`${apiBase}/trips`);
};

export const fetchUserTrips = (userId) => {
  return axios.get(`${apiBase}/users/${userId}/trips`);
};

export const fetchTripById = (tripId) => {
  return axios.get(`${apiBase}/trips/${tripId}`);
};

export const createTrip = (tripData) => {
  return axios.post(`${apiBase}/trips`, tripData);
};

export const fetchItinerary = (tripId) => {
  return axios.get(`${apiBase}/trips/${tripId}/activities/itinerary`);
};

export const fetchPossibility = (tripId) => {
  return axios.get(`${apiBase}/trips/${tripId}/activities/possibility`);
};

export const postPossibility = (tripId, possibility) => {
  return axios.post(`${apiBase}/trips/${tripId}/activities`, possibility);
};

export const getActivity = (tripId, activityId) => {
  return axios.get(`${apiBase}/trips/${tripId}/activities/${activityId}`);
};

export const activityVote = (tripId, activityId, votes) => {
  return axios.patch(`${apiBase}/trips/${tripId}/activities/${activityId}`, {
    votes: votes + 1,
  });
};

export const deleteActivity = (tripId, activityId) => {
  return axios.delete(`${apiBase}/trips/${tripId}/activities/${activityId}`);
};

export const moveToItinerary = (tripId, activityId) => {
  return axios.patch(`${apiBase}/trips/${tripId}/activities/${activityId}`, {
    in_itinerary: true,
  });
};
