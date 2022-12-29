/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../App/store';
import { IAuth } from '../../../Types/UserInterface';

const data = localStorage.getItem('token') ?? '';
const parsedData: IAuth['data'] | null = data ? JSON.parse(data) : null;
const initialState: IAuth = {
  data: parsedData ?? {
    token: '',
    admin: null
  }
};

const authSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<IAuth['data']>) {
      localStorage.setItem(
        'token',
        JSON.stringify({
          token: action.payload.token,
          admin: action.payload.admin
        })
      );

      state.data = { token: action.payload.token, admin: action.payload.admin };
    },
    deleteToken(state) {
      state.data = {
        token: '',
        admin: null
      };
      localStorage.removeItem('token');
    }
  }
});

export const { setToken, deleteToken } = authSlice.actions;

export const selectUserAuth = (state: RootState) => state.userAuth.data;

export const userAuthReducer = authSlice.reducer;
