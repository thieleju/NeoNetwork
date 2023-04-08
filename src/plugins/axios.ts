import axios from "axios";

console.log("base url is", import.meta.env.VITE_API_URL);

const axios_client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios_client;
