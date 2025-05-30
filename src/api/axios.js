import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://express-earth-backend-service-929452209573.asia-south2.run.app/api/', // ✅ points to Django backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
