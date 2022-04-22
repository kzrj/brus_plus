// @flow

import axios from 'axios';
import endpoints from './endpoints';


const create = () => {
  const logIn = (data: { username: string, password: string}): void => {
    const { username, password } = data;
    
     return axios.post(endpoints.JWT_AUTH, { username, password })
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response);
        }
        return { token: response.data.token, user: response.data.user };
      })
      .catch(err => {
        throw new Error(err.response.data[Object.keys(err.response.data)[0]][0])
      })
      .then((response) => {
          localStorage.setItem('token', response.token);
          return response.user;
      })
  }

  const logOut = () => {
    localStorage.removeItem('token');
  }

  const checkToken = (payload: string) => {
    return axios.post(endpoints.JWT_CHECK_TOKEN, { token: payload })
      .then(response => {
        return { user: response.data.user }
      })
      .catch(err => {
        throw new Error(err.response.data[Object.keys(err.response.data)[0]][0])
      })
  }

  const signUp = (payload: { email: string, phone: string}) => {
    const { email, phone } = payload;
    return axios.post(endpoints.SIGNUP, { email, phone })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw new Error(err.response.data[Object.keys(err.response.data)[0]])
      })
  }

  const checkAuth = (payload: string ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Нет доступа')
    }
    return axios.post(endpoints.JWT_CHECK_TOKEN, { token })
      .then(({ data }) => {
        const { user } = data;
        const { group } = user;

        // TODO - in response group is number (id), must be a string
        if (payload.indexOf(group) === -1) {
          throw new Error('Нет доступа')
        }
        return user
      })
      .catch(err => {
        throw new Error(err.message)
      })
  }

  return {
    logIn,
    checkToken,
    logOut,
    signUp,
    checkAuth
  }
}

export default {
  create
}