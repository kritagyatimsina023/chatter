import axios from "axios";
export const axiosInstances = axios.create({
  baseURL: "http://localhost:3000/api",
  // import.meta.env.NODE_ENV === "development"
  //   ? "http://localhost:3000/api"
  //   : "/api",
  withCredentials: true,
});
