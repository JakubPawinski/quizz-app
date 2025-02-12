import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/utils/config';
import { useNotification } from '@/providers/NotificationProvider';
import { useUser } from '@/providers/AuthProvider';

export default function useAuthorization(required) {
	const { user } = useUser();
	const router = useRouter();
	const { showNotification } = useNotification();
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		// console.log('Authorization', user);
		if (user !== undefined) {
			if (required === 'admin') {
				if (!user || !user.rootAccess) {
					showNotification(
						'You are not authorized to access this admin page',
						'error'
					);
					router.push(APP_ROUTES.HOME);
				} else {
					setAuthorized(true);
					console.log('Admin authorized');
				}
			} else if (typeof required === 'string' && required !== 'admin') {
				console.log('User authorization:', user);
				if (!user || user._id !== required) {
					showNotification('Access denied', 'error');
					router.push(APP_ROUTES.HOME);
				} else {
					setAuthorized(true);
					console.log('User authorized');
				}
			} else {
				setAuthorized(true);
			}
		}
	}, []);

	return authorized;
}
