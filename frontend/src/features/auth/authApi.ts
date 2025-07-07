import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
// import { User } from './types';

export const signup = createAsyncThunk(
    'auth/signup',
    async (
        { first_name, last_name, username, email, password, re_password }: { first_name: string; last_name: string; username: string; email: string; password: string; re_password: string },
        thunkAPI
    ) => {
        try {
            const body = JSON.stringify({
                email,
                username,
                first_name,
                last_name,
                password,
                re_password
            });
            const res = await axios.post('auth/users/', body);
            return res.data;
        } catch (err: any) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                const friendlyErrors: string[] = [];

                if (data.email) {
                    friendlyErrors.push("Este correo ya está registrado.");
                }
                if (data.username) {
                    friendlyErrors.push("Este nombre de usuario ya está en uso.");
                }
                if (data.password) {
                    friendlyErrors.push("La contraseña no cumple los requisitos.");
                }
                if (data.non_field_errors) {
                    friendlyErrors.push(...data.non_field_errors);
                }
                return thunkAPI.rejectWithValue(friendlyErrors.join(" "));
            }
            return thunkAPI.rejectWithValue("Ocurrió un error al registrar. Intenta de nuevo.");
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (
        { email, password }: { email: string; password: string },
        thunkAPI
    ) => {
        try {
            const body = JSON.stringify({ email, password });
            const res = await axios.post('auth/jwt/create/', body);
            const { access, refresh } = res.data;
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            return { access, refresh };
        } catch (err: unknown) {
            return thunkAPI.rejectWithValue('Error al iniciar sesión');
        }
    }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        return thunkAPI.rejectWithValue('No token');
      }

      const res = await axios.get('/auth/users/me/', {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Error loading user');
    }
  }
);
