'use client';

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { ENDPOINTS } from '@/utils/config';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			const token = Cookies.get('auth_token');
			console.log('token:', token);
			if (!token) {
				setUser(null);
				return;
			}
			try {
				const decoded = jwtDecode(token);

				const response = await axios.get(`${ENDPOINTS.USER}/${decoded.id}`, {
					withCredentials: true,
				});

				if (response.data) {
					setUser(response.data);
				}
			} catch (error) {
				console.error('Auth error:', error);
				setUser(null);
			}
		};

		checkAuth();
	}, []);
	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
