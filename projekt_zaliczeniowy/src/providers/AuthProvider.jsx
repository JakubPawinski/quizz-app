'use client';

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { ENDPOINTS } from '@/config';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = Cookies.get('auth_token');

			if (token) {
				setUser(jwtDecode(token));
			}
			// console.log('token:', token);
			if (!token) {
				setUser(null);
				setIsLoaded(true);
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
				// console.log('User:', response.data);
			} catch (error) {
				console.error('Auth error:', error);
				setUser(null);
			} finally {
				setIsLoaded(true);
			}
		};

		checkAuth();
	}, []);
	return (
		<AuthContext.Provider value={{ user, setUser, isLoaded }}>
			{isLoaded && children}
		</AuthContext.Provider>
	);
}

export const useUser = () => useContext(AuthContext);
