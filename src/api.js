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

export const fetchTripMembers = (tripId) => {
  return axios.get(`${apiBase}/trips/${tripId}/members`);
};

export const postTripMembers = (tripId, userId) => {
  return axios.post(`${apiBase}/trips/${tripId}/members`, userId);
};

export const fetchRoomMessages = (roomId) => {
  return axios.get(`${apiBase}/rooms/${roomId}/messages`);
};
export const postMessage = (roomId, messageData) => {
  return axios.post(`${apiBase}/rooms/${roomId}/messages`, messageData);
};
export const fetchUserName = (userId) => {
  return axios
    .get(`${apiBase}/users/${userId}`)
    .then((response) => response.data.user.name)
    .catch((err) => {
      console.error("Error fetching user name:", err);
    });
};

export const fetchUserDetails = (user_id) => {
  return axios.get(`${apiBase}/users/${user_id}`);
};

export const patchUserDetails = (userData) => {
  return axios.patch(`${apiBase}/users/${userData.user_id}`, userData);
};

export const moveToPossibility = (tripId, activityId) => {
  return axios.patch(`${apiBase}/trips/${tripId}/activities/${activityId}`, {
    in_itinerary: false,
  });
};

export const patchTripDetails = (tripData) => {
  return axios.patch(`${apiBase}/trips/${tripData.trip_id}`, tripData);
};

export const getUserIdByEmail = (userEmail) => {
  return axios.get(`${apiBase}/users/email/${userEmail}`, userEmail);
};

export const deleteTripById = (tripId) => {
  return axios.delete(`${apiBase}/trips/${tripId}`);
};
