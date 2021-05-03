/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}
interface AuthData {
  token: string;
  user: User;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: User;
  signOut(): void;
  signIn(credentials: SignInCredentials): Promise<void>;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthData>(() => {
    const token = localStorage.getItem('GoBarber:token');
    const user = localStorage.getItem('GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthData;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('GoBarber:token', token);
    localStorage.setItem('GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData(response.data);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('GoBarber:token');
    localStorage.removeItem('GoBarber:user');

    setData({} as AuthData);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [data.token],
  );
  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export { AuthProvider, useAuth };
