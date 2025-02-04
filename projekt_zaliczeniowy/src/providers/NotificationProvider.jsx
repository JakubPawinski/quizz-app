'use client';
import { createContext, useState, useContext } from 'react';
import Notification from '@/components/layout/Notification';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
	const [notification, setNotification] = useState(null);

	const showNotification = (message, type = 'info') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 6000);
	};

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			{notification && (
				<Notification message={notification.message} type={notification.type} />
			)}
		</NotificationContext.Provider>
	);
}

export const useNotification = () => useContext(NotificationContext);
