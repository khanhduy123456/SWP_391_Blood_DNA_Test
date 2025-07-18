import axios from 'axios';

const client = axios.create({
  baseURL: 'https://cdel-production.up.railway.app/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Xử lý lỗi 
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

export default client;