'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLoading } from '@/providers/LoadingProvider';
import { useUser } from '@/providers/AuthProvider';
import { ENDPOINTS } from '@/utils/config';
import { useNotification } from '@/providers/NotificationProvider';

export default function GoogleCallback() {
	const router = useRouter();
	const { setUser } = useUser();
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	useEffect(() => {
		const handleAuth = async () => {
			const code = new URLSearchParams(window.location.search).get('code');
			console.log('code:', code);
			if (code) {
				console.log('code is true');
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
					router.push('/quizzes');
				} catch (error) {
					console.error('Authentication failed', error);
					showNotification(
						error.res?.data?.message || 'An error occurred',
						'error'
					);
					router.push('/');
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
