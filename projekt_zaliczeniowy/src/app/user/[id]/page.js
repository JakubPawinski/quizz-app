'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';
import { useNotification } from '@/providers/NotificationProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	firstName: Yup.string().required('First Name is required'),
	lastName: Yup.string().required('Last Name is required'),
	email: Yup.string()
		.email('Invalid email address')
		.required('Email is required'),
	nickname: Yup.string().required('Nickname is required'),
	privacy: Yup.boolean(),
	wantNotifications: Yup.boolean(),
});

export default function UserPage() {
	const { id } = useParams();
	const { user, setUser } = useAuth();
	const { setIsLoading } = useLoading();
	const [isEditing, setIsEditing] = useState(false);
	const { showNotification } = useNotification();

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

	const initialValues = useMemo(
		() => ({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			email: user?.email || '',
			nickname: user?.nickname || '',
			privacy: user?.privacy || false,
			wantNotifications: user?.wantNotifications || true,
		}),
		[user]
	);

	const handleSubmit = async (values, { setSubmitting }) => {
		setIsLoading(true);

		try {
			const response = await axios.patch(`${ENDPOINTS.USER}/${id}`, values, {
				withCredentials: true,
			});
			// console.log('response:', response);
			setUser(response.data);
			showNotification('Profile updated successfully', 'success');
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating profile:', error);
			showNotification(
				error.response?.data?.message || 'An error occurred',
				'error'
			);
		} finally {
			setIsLoading(false);
			setSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen p-4 sm:p-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold'>Profile Management</h1>
					<button
						className={`btn ${isEditing ? 'btn-error' : 'btn-primary'}`}
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? 'Cancel' : 'Edit Profile'}
					</button>
				</div>

				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
					enableReinitialize
				>
					{({ isSubmitting }) => (
						<Form className='space-y-6'>
							<div className='grid md:grid-cols-2 gap-6'>
								<div className='form-control'>
									<label className='label'>
										<span className='label-text'>First Name</span>
									</label>
									<Field
										type='text'
										name='firstName'
										className='input input-bordered'
										disabled={!isEditing}
									/>
									<ErrorMessage
										name='firstName'
										component='div'
										className='text-red-500'
									/>
								</div>

								<div className='form-control'>
									<label className='label'>
										<span className='label-text'>Last Name</span>
									</label>
									<Field
										type='text'
										name='lastName'
										className='input input-bordered'
										disabled={!isEditing}
									/>
									<ErrorMessage
										name='lastName'
										component='div'
										className='text-red-500'
									/>
								</div>
							</div>

							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Nickname</span>
								</label>
								<Field
									type='text'
									name='nickname'
									className='input input-bordered'
									disabled={!isEditing}
								/>
								<ErrorMessage
									name='nickname'
									component='div'
									className='text-red-500'
								/>
							</div>

							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Email</span>
								</label>
								<Field
									type='email'
									name='email'
									className='input input-bordered'
									disabled={!isEditing}
								/>
								<ErrorMessage
									name='email'
									component='div'
									className='text-red-500'
								/>
							</div>

							<div className='divider'>Privacy & Notification Settings</div>

							<div className='flex flex-col sm:flex-row gap-4'>
								<label className='label cursor-pointer justify-start gap-2'>
									<Field
										type='checkbox'
										name='privacy'
										className='toggle toggle-primary'
										disabled={!isEditing}
									/>
									<span className='label-text'>Private Profile</span>
								</label>

								<label className='label cursor-pointer justify-start gap-2'>
									<Field
										type='checkbox'
										name='wantNotifications'
										className='toggle toggle-primary'
										disabled={!isEditing}
									/>
									<span className='label-text'>Enable Notifications</span>
								</label>
							</div>

							{isEditing && (
								<div className='flex justify-end mt-6'>
									<button
										type='submit'
										className='btn btn-primary'
										disabled={isSubmitting}
									>
										Save Changes
									</button>
								</div>
							)}
						</Form>
					)}
				</Formik>

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
