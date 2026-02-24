import axios from "axios";
export const axiosInstances = axios.create({
  baseURL:
    import.meta.env.mode === "development"
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true,
});
