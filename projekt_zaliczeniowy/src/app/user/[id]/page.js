'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';
import { useNotification } from '@/providers/NotificationProvider';
import { useAuth } from '@/providers/AuthProvider';
import UserManagment from '@/components/user/UserManagment';

export default function UserPage() {
	const { id } = useParams();
	const { user } = useAuth();
	const { setIsLoading } = useLoading();
	const [achievements, setAchievemnts] = useState([]);

	useEffect(() => {
		const fetchUserAchievements = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(
					`${ENDPOINTS.USER}/${id}/achievements`,
					{
						withCredentials: true,
					}
				);
				// console.log('response:', response.data);
				setAchievemnts(response.data);
			} catch (error) {
				console.error('Error fetching user:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserAchievements();
	}, [id, setIsLoading]);

	return (
		<div className='min-h-screen p-4 sm:p-8'>
			<div className='max-w-4xl mx-auto'>
				<UserManagment userData={user} />

				<div className='divider my-8'>Additional Information</div>

				<div className='stats shadow w-full'>
					<div className='stat'>
						<div className='stat-title'>Join Date</div>
						<div className='stat-value text-primary text-2xl'>
							{new Date(user?.createdAt).toLocaleDateString()}
						</div>
					</div>
					<div className='stat'>
						<div className='stat-title'>Created Quizzes</div>
						<div className='stat-value text-secondary text-2xl'>
							{user?.quizzes?.length || 0}
						</div>
					</div>
					<div className='stat'>
						<div className='stat-title'>Achievements</div>
						<div className='stat-value text-accent text-2xl'>
							{user?.achievements?.length || 0}
						</div>
					</div>
				</div>

				{achievements.length > 0 && (
					<div>
						<div className='divider my-8'>Achievements</div>

						<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
							{achievements?.map((achievement) => (
								<div key={achievement._id} className='card shadow-lg'>
									<div className='card-body'>
										<h2 className='card-title'>
											{achievement.name} {achievement?.icon}
										</h2>
										<p>{achievement.description}</p>
										<p className='text-sm text-gray-500'>
											Criteria: {achievement.criteria}
										</p>
										<p className='text-sm text-gray-500'>
											Target Value: {achievement.targetValue}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
