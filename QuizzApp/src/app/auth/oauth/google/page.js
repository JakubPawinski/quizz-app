'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLoading } from '@/providers/LoadingProvider';
import { useUser } from '@/providers/AuthProvider';
import { ENDPOINTS, APP_ROUTES } from '@/config';
import { useNotification } from '@/providers/NotificationProvider';

export default function GoogleOAuthPage() {
	const router = useRouter();
	const { setUser } = useUser();

	//Context
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	//UseEffect to handle google authentication
	useEffect(() => {
		const handleAuth = async () => {
			const code = new URLSearchParams(window.location.search).get('code');
			console.log('code:', code);
			if (code) {
				try {
					const response = await axios.post(
						`${ENDPOINTS.AUTH}/google/callback`,
						{ code },
						{
							withCredentials: true,
						}
					);
					console.log('res:', response.data);
					setUser(response.data.userData);
					showNotification(response.data.message, 'success');
					router.push(`${APP_ROUTES.QUIZZES.LIST}`);
				} catch (error) {
					console.error('Authentication failed', error);
					showNotification(
						error.res?.data?.message || 'An error occurred',
						'error'
					);
					router.push(`${APP_ROUTES.AUTH.LOGIN}`);
				}
			}
		};
		handleAuth();
	}, [router, setIsLoading, setUser, showNotification]);

	return (
		<div className='min-h-screen flex items-center justify-center flex-col'>
			<h2 className='text-primary text-xl font-semibold animate-pulse'>
				Logging in...
			</h2>
			<div className='text-primary/80 text-sm'>
				Please wait while we redirect you
			</div>
		</div>
	);
}
