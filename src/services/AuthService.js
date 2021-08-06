import { apiWrapper } from "../helpers/Api-wrapper";

const urlBase = `${process.env.REACT_APP_USERS_API}/auth`;

const login = data => {
  return apiWrapper.post(`${urlBase}/login`, data);
};

const registry = async data => {
  return await apiWrapper.post(`${urlBase}/registry`, data);
};

export const AuthService = {
  login,
  registry
}

