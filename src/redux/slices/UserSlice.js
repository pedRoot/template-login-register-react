import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setKeyInStorage } from "../../helpers/ManageStore";
import { AuthService } from "../../services/AuthService";
import { UserService } from "../../services/UserService";

const loginUser = createAsyncThunk(
  'users/login',
  async (data, thunkAPI) => {
    try {
      const response = await AuthService.login(data);
      const dataResponse = response.data.accessToken;

      setKeyInStorage('token', dataResponse);

      return dataResponse;

    } catch (error) {
      console.log('error: ', error);
      return thunkAPI.rejectWithValue(error.message);
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

export const fetchUser = createAsyncThunk(
  'users/fetchUserByToken',
  async (thunkAPI) => {
    try {
      const response = await UserService.getDetailUser();
      
      return response.data;

    } catch (error) {
      console.log('error: ', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
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


    [fetchUser.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;

      state.avatar = payload.avatar;
      state.email = payload.email;
      state.username = `${payload.first_name} ${payload.last_name}`;
    },
    [fetchUser.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
    },

  },
});

export const { clearState } = userSlice.actions;

const userSelector = (state) => state.user;

export { userSlice, userSelector, signupUser, loginUser };
