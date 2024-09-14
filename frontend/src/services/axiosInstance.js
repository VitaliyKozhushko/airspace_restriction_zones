import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/login/refresh`, {
            refresh: localStorage.getItem("refresh_token"),
          });

          localStorage.setItem("access_token", response.data.access);
          req.headers.Authorization = `Bearer ${response.data.access}`;
        } catch (error) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/");
        }
      } else {
        req.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
