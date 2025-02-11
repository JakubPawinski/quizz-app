'use client';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';
import Link from 'next/link';

export default function AdminUsersPage() {
	const { setIsLoading } = useLoading();
	const [users, setUsers] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${ENDPOINTS.USER}/all`, {
					withCredentials: true,
				});
				console.log('Users:', response.data.data);
				setUsers(response.data.data);
			} catch (error) {
				console.error('Error fetching users:', error);
			} finally {
				setIsLoading(false);
			}
		};
		console.log('Admin users page loaded');
		fetchUsers();
	}, []);

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};
	const sortedUsers = useMemo(() => {
		if (!sortConfig.key) return users;
		const sorted = [...users].sort((a, b) => {
			let aValue = a[sortConfig.key];
			let bValue = b[sortConfig.key];

			if (sortConfig.key === 'createdAt') {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}

			if (sortConfig.key === 'quizzes') {
				aValue = a.quizzes ? a.quizzes.length : 0;
				bValue = b.quizzes ? b.quizzes.length : 0;
			}

			if (sortConfig.key === 'user') {
				aValue = `${a.nickname} ${a.firstName} ${a.lastName}`.toLowerCase();
				bValue = `${b.nickname} ${b.firstName} ${b.lastName}`.toLowerCase();
			}

			if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [users, sortConfig]);

	return (
		<div className='admin-page w-full p-4 bg-base-100 min-h-screen'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold'>Manage Users</h1>
				<div className='mb-4'>
					Administer user profiles and account settings.
				</div>
				<div className='divider divider-primary text-lg'>Users</div>

				<div className='overflow-x-auto'>
					<table className='table w-full'>
						<thead>
							<tr>
								<th
									onClick={() => handleSort('user')}
									className='cursor-pointer hover:text-primary'
								>
									User
								</th>
								<th
									onClick={() => handleSort('email')}
									className='cursor-pointer hover:text-primary'
								>
									Email
								</th>
								<th
									onClick={() => handleSort('createdAt')}
									className='cursor-pointer hover:text-primary'
								>
									Joined
								</th>
								<th
									onClick={() => handleSort('quizzes')}
									className='cursor-pointer hover:text-primary'
								>
									Quizzez
								</th>
								<th
									onClick={() => handleSort('privacy')}
									className='cursor-pointer hover:text-primary'
								>
									Status
								</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{sortedUsers.map((user) => (
								<tr key={user._id}>
									<td>
										<div className='flex flex-col'>
											<span className='font-bold'>{user.nickname}</span>
											<span className='text-sm text-gray-500'>
												{user.firstName} {user.lastName}
											</span>
										</div>
									</td>
									<td>{user.email}</td>
									<td>{new Date(user.createdAt).toLocaleDateString()}</td>
									<td>{user.quizzes ? user.quizzes.length : 0}</td>
									<td>{user.privacy ? 'Private' : 'Public'}</td>
									<td>
										<Link
											href={`/admin/users/${user._id}`}
											className='btn btn-outline btn-primary'
										>
											Manage
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
