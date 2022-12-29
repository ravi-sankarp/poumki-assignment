/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuth } from '../../../Types/UserInterface';
import { RootState } from '../../App/store';

const data = localStorage.getItem('adminToken') ?? '';
const parsedData: IAuth['data'] | null = data ? JSON.parse(data) : null;
const initialState: IAuth = {
  data: parsedData ?? {
    token: '',
    admin: null
  }
};

const adminAuthSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminToken(state, action: PayloadAction<IAuth['data']>) {
      localStorage.setItem(
        'adminToken',
        JSON.stringify({
          token: action.payload.token,
          admin: action.payload.admin
        })
      );

      state.data = { token: action.payload.token, admin: action.payload.admin };
    },
    deleteAdminToken(state) {
      state.data = {
        token: '',
        admin: null
      };
      localStorage.removeItem('adminToken');
    }
  }
});

export const { setAdminToken, deleteAdminToken } = adminAuthSlice.actions;

export const selectAdminAuth = (state: RootState) => state.adminAuth.data;

export const adminAuthReducer = adminAuthSlice.reducer;
