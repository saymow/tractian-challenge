import axios from "axios";

const api = axios.create({
  baseURL: "https://fake-api.tractian.com/",
});

export default api;
