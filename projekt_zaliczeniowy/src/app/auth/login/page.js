'use client';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useUser } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/providers/LoadingProvider';
import SignInGoogle from '@/components/auth/SignInGoogle';
import { useNotification } from '@/providers/NotificationProvider';
import { useState } from 'react';

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string().required('Required'),
});

const TempPasswordSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
});

export default function Login() {
	const router = useRouter();
	const { setUser } = useUser();
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	const [showTempPasswordForm, setShowTempPasswordForm] = useState(false);

	const handleTempPassword = async (values) => {
		if (!values.email) {
			setShowTempPasswordForm((prev) => !prev);
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.post(
				`${ENDPOINTS.AUTH}/temp-password`,
				values,
				{
					withCredentials: true,
				}
			);
			// console.log(response);
			showNotification(response.data.message, 'success');
			setShowTempPasswordForm(false);
		} catch (error) {
			console.error(error);
			showNotification(
				error.response?.data?.message || 'An error occurred',
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (values) => {
		setIsLoading(true);
		console.log(values);

		try {
			const response = await axios.post(`${ENDPOINTS.AUTH}/login`, values, {
				withCredentials: true,
			});
			if (response.data?.message) {
				showNotification(response.data.message, 'success');
			}
			console.log(response);

			setUser(response.data.userData);
			router.push('/quizzes');
			console.log(response.data);
			setIsLoading(false);
		} catch (error) {
			console.error(error.response.data);
			setIsLoading(false);
			showNotification(
				error.response?.data?.message || 'An error occurred',
				'error'
			);
		}
	};

	return (
		<div className='auth-page'>
			<div className='w-full flex justify-evenly'>
				<Link
					href='/auth/login'
					className='auth-button link link-hover link-primary'
				>
					Log in
				</Link>
				<Link href='/auth/register' className='auth-button link link-hover'>
					Register
				</Link>
			</div>
			<div className='flex justify-center'>
				<div className='auth-form'>
					<h2 className='text-2xl font-bold mb-4'>Login</h2>
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validationSchema={LoginSchema}
						onSubmit={(values) => handleSubmit(values)}
					>
						{({ errors, touched }) => (
							<Form className='space-y-4'>
								<div>
									<Field
										name='email'
										type='email'
										placeholder='Email'
										className='input input-bordered '
									/>
									{errors.email && touched.email && (
										<div className='text-error text-sm mt-1'>
											{errors.email}
										</div>
									)}
								</div>

								<div>
									<Field
										name='password'
										type='password'
										placeholder='Password'
										className='input input-bordered'
									/>
									{errors.password && touched.password && (
										<div className='text-error text-sm mt-1'>
											{errors.password}
										</div>
									)}
								</div>

								<button type='submit' className='btn btn-primary'>
									Sign in
								</button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
			<div>
				{!showTempPasswordForm ? (
					<button
						href='/auth/verify-email'
						className='block text-sm text-primary hover:text-primary-focus text-center mt-2 hover:underline mx-auto'
						onClick={handleTempPassword}
					>
						Send one-time password to your email
					</button>
				) : (
					<div className='flex justify-center'>
						<div className='auth-form'>
							<h2 className='text-xl font-bold mb-4'>
								Request Temporary Password
							</h2>
							<Formik
								initialValues={{ email: '' }}
								validationSchema={TempPasswordSchema}
								onSubmit={handleTempPassword}
							>
								<Form className='space-y-4'>
									<div>
										<Field
											name='email'
											type='email'
											placeholder='Email'
											className='input input-bordered'
										/>
										<ErrorMessage
											name='email'
											component='div'
											className='text-error text-sm mt-1'
										/>
									</div>
									<button type='submit' className='btn btn-primary'>
										Send Temporary Password
									</button>
								</Form>
							</Formik>
						</div>
					</div>
				)}
				<Link
					href='/auth/verify-email'
					className='block text-sm text-primary hover:text-primary-focus text-center mt-2 hover:underline'
				>
					Verify your email
				</Link>
			</div>
			<div className='divider m-auto mt-[20px] mb-[20px]'>OR</div>
			<SignInGoogle />
		</div>
	);
}
