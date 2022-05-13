import axios from 'axios';

const setAuthToken = (token) => {
  console.log('authToken=', token);
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
