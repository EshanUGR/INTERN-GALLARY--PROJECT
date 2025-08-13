import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const uploadMedia = (formData) => API.post("/media", formData);
export const getMedia = (userId) => API.get(`/media/${userId}`);
export const downloadZip = (userId, mediaIds) =>
  API.post(`/zip/${userId}/download`, { mediaIds }, { responseType: "blob" });
