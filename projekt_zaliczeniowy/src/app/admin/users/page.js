'use client';
import User from '@/components/admin/User';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		const fetchUsers = async () => {
			const response = await axios.get(`${ENDPOINTS.USER}/all`, {
				withCredentials: true,
			});
			console.log('Users:', response.data);
			setUsers(response.data);
		};
		console.log('Admin users page loaded');
		fetchUsers();
	}, []);
	return (
		<div className='admin-page w-full p-4 bg-base-100 min-h-screen'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold'>Manage Users</h1>
				<div>Administer user profiles and account settings.</div>
			</div>
		</div>
	);
}
