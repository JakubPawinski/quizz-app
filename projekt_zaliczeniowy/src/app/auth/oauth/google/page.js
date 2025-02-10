'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLoading } from '@/providers/LoadingProvider';
import { useAuth } from '@/providers/AuthProvider';
import { ENDPOINTS } from '@/utils/config';
import { useNotification } from '@/providers/NotificationProvider';

export default function GoogleCallback() {
	const router = useRouter();
	const { setUser } = useAuth();
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	useEffect(() => {
		const handleAuth = async () => {
			setIsLoading(true);
			const code = new URLSearchParams(window.location.search).get('code');
			console.log('code:', code);
			if (code) {
				console.log('code is true');
				try {
					const res = await axios.post(
						`${ENDPOINTS.AUTH}/google/callback`,
						{ code },
						{
							withCredentials: true,
						}
					);
					console.log('res:', res.data);
					setUser(res.data.userData);
					showNotification(response.data.message, 'success');
					router.push('/quizzes');
					setIsLoading(false);
				} catch (error) {
					console.error('Authentication failed', error);
					showNotification(
						error.response?.data?.message || 'An error occurred',
						'error'
					);
					router.push('/');
					setIsLoading(false);
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
