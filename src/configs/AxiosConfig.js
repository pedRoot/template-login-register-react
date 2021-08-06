import Axios from 'axios';
import LRU from 'lru-cache';
import { configure } from "axios-hooks";

import useCrypto from "../hooks/useCrypto";
import { getKeyInStorage } from '../helpers/ManageStore';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const axios = Axios.create({
  baseURL: process.env.REACT_APP_USERS_API,
  timeout: process.env.REACT_APP_TIMEOUT_API,
  headers
});

axios.interceptors.request.use(request => {
  if (process.env.REACT_APP_ENCRYPT_DATA === 'ON' && request.data) {
    const encryptedData = useCrypto(JSON.stringify(request.data), 'en');
    request.data = { data: encryptedData };
  }

  const token = getKeyInStorage('token') || undefined;
  if (token) request.headers['Authorization'] = `Bearer ${token}`;

  return request;
}, error => {

  return Promise.reject(error)
});

axios.interceptors.response.use(response => {
  return response;
}, error => {

  error.message = error.response.data.message;
  return Promise.reject(error);
})

const cache = new LRU({ max: 10 });
configure({ axios, cache });

export default axios;
