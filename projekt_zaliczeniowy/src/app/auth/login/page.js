'use client';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/providers/LoadingProvider';
import SignInGoogle from '@/components/auth/SignInGoogle';
import { useNotification } from '@/providers/NotificationProvider';

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string().required('Required'),
});

export default function Login() {
	const router = useRouter();
	const { setUser } = useAuth();
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	const handleSubmit = async (values) => {
		setIsLoading(true);
		console.log(values);

		try {
			const response = await axios.post(`${ENDPOINTS.AUTH}/login`, values, {
				withCredentials: true,
			});
			if (response.data?.message) {
				// console.log('Show notification:', response.data.message);
				// console.log(response.data.message);
				showNotification(response.data.message, 'success');
			}
			console.log(response);

			// console.log('Document cookies:', document.cookie);
			// console.log('Headers:', response.headers);
			// console.log('Set-Cookie:', response.headers['set-cookie']);

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
