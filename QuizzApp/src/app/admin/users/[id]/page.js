'use client';
import UserManagment from '@/components/user/UserManagment';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoading } from '@/providers/LoadingProvider';
import { ENDPOINTS } from '@/config';

export default function AdminUserPage() {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const { setIsLoading } = useLoading();

	//UseEffect to fetch user data
	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${ENDPOINTS.USER}/${id}`, {
					withCredentials: true,
				});
				console.log('response:', response.data);
				setUser(response.data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserData();
	}, [id]);
	return (
		<div className='w-full max-w-4xl mx-auto min-h-screen p-8'>
			<UserManagment userData={user} isRoot={true} />
		</div>
	);
}
