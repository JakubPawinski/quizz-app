import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '@/providers/AuthProvider';
import { useNotification } from '@/providers/NotificationProvider';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';

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

export default function UserManagment({ userData, isRoot = false }) {
	const [user, setUser] = useState(userData);
	const [isEditing, setIsEditing] = useState(false);
	const { showNotification } = useNotification();
	const { setIsLoading } = useLoading();

	const initialValues = useMemo(
		() => ({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			email: user?.email || '',
			nickname: user?.nickname || '',
			privacy: user?.privacy,
			wantNotifications: user?.wantNotifications,
		}),
		[user]
	);
	useEffect(() => {
		// console.log('userData:', userData);
		setUser(userData);
	}, [userData]);

	const handleSubmit = async (values, { setSubmitting }) => {
		setIsLoading(true);
		// console.log('values:', values);

		try {
			const response = await axios.patch(
				`${ENDPOINTS.USER}/${user._id}`,
				values,
				{
					withCredentials: true,
				}
			);
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

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const response = await axios.delete(`${ENDPOINTS.USER}/${user._id}`, {
				withCredentials: true,
			});
			// console.log('response:', response);
			showNotification('User deleted successfully', 'success');

			isRoot && window.location.replace('/admin/users');
		} catch (error) {
			console.error('Error deleting user:', error);
			showNotification(
				error.response?.data?.message || 'An error occurred',
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full'>
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-3xl font-bold'>Profile Management</h1>
				<div className='flex items-center gap-4'>
					{isRoot && (
						<button
							className='btn btn-error'
							onClick={handleDelete}
							disabled={isEditing}
						>
							Delete User
						</button>
					)}
					<button
						className={`btn ${isEditing ? 'btn-error' : 'btn-primary'}`}
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? 'Cancel' : 'Edit Profile'}
					</button>
				</div>
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

						{!isRoot && (
							<div>
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
							</div>
						)}

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
		</div>
	);
}
