import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://localhost:7056/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
