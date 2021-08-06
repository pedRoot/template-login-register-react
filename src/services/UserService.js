import { apiWrapper } from "../helpers/Api-wrapper";

const urlBase = `${process.env.REACT_APP_USERS_API}/users`;

const getDetailUser = data => {
  return apiWrapper.get(urlBase);
};

export const UserService = {
  getDetailUser
}