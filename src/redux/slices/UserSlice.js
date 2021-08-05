import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setKeyInStorage } from "../../helpers/ManageStore";

//----------------------------------------------------------------const urlApiBussinesBase = 'http://gateway.marvel.com/';
const urlApiAthenticate = process.env.REACT_APP_USERS_API;

const loginUser = createAsyncThunk(
  'users/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${urlApiAthenticate}login`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          }),
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        setKeyInStorage('token', data.accessToken);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }

    } catch (error) {
      console.log('error: ', error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const signupUser = createAsyncThunk(
  'users/signupUser',
  async ({ name, email, password }, thunkAPI) => {
    try {

      const response = await fetch(
        'https://reqres.in/api/register',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setKeyInStorage('token', data.accessToken);
        return { ...data, username: name, email };
      } else {
        return thunkAPI.rejectWithValue(data);
      }

    } catch (error) {
      console.log('Error: ', error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserBytoken = createAsyncThunk(
  'users/fetchUserByToken',
  async ({ token }, thunkAPI) => {
    try {
      const response = await fetch(
        'https://reqres.in/api/users/4',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();

      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {

    clearState: state => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },
  extraReducers: {

    [signupUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.email = payload.email;
      state.username = payload.name;
    },
    [signupUser.pending]: state => {
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },


    [loginUser.fulfilled]: (state, { payload }) => {
      state.email = payload.email;
      state.username = payload.name;
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },


    [fetchUserBytoken.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserBytoken.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;

      state.avatar = payload.data.avatar;
      state.email = payload.data.email;
      state.username = `${payload.data.first_name} ${payload.data.last_name}`;
    },
    [fetchUserBytoken.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
    },

  },
});

export const { clearState } = userSlice.actions;

const userSelector = (state) => state.user;

export { userSlice, userSelector, signupUser, loginUser };
