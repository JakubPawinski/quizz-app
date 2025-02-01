'use client';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useAuth } from '@/providers/AuthProvider';
import { useLoading } from '@/providers/LoadingProvider';
import { useRouter } from 'next/navigation';

const RegisterSchema = Yup.object().shape({
	firstName: Yup.string()
		.min(2, 'Name is too short')
		.max(50, 'Name is too long')
		.required('Required'),
	lastName: Yup.string()
		.min(2, 'Surname is too short')
		.max(50, 'Surname is too long')
		.required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),
	nickname: Yup.string()
		.min(3, 'Nickname is too short')
		.max(20, 'Nickname is too long')
		.required('Required'),
	password: Yup.string()
		.min(8, 'Password is too short minimum 8 characters')
		.required('Required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Passwords must match')
		.required('Required'),
});

export default function Register() {
	const router = useRouter();
	const { setUser } = useAuth();
	const { setIsLoading } = useLoading();

	const handleSubmit = async (values) => {
		setIsLoading(true);
		console.log(values);
		const { confirmPassword, ...data } = values;
		try {
			const response = await axios.post(`${ENDPOINTS.AUTH}/register`, data, {
				withCredentials: true,
			});

			setUser(response.data.userData);
			router.push('/quizzes');
			console.log(response.data);
			setIsLoading(false);
		} catch (error) {
			console.error(error.response.data);
			setIsLoading(false);
		}
	};
	return (
		<div className='auth-page'>
			<div className='w-full flex justify-evenly'>
				<Link href='/auth/login' className='auth-button link link-hover'>
					Log in
				</Link>
				<Link
					href='/auth/register'
					className='auth-button link link-hover link-primary'
				>
					Register
				</Link>
			</div>
			<div className='flex justify-center'>
				<div className='auth-form'>
					<h2 className='text-2xl font-bold mb-4'>Register</h2>
					<Formik
						initialValues={{
							firstName: '',
							lastName: '',
							email: '',
							nickname: '',
							password: '',
							confirmPassword: '',
						}}
						validationSchema={RegisterSchema}
						onSubmit={(values) => handleSubmit(values)}
					>
						{({ errors, touched }) => (
							<Form className='space-y-4'>
								<div>
									<Field
										name='firstName'
										type='text'
										placeholder='Name'
										className='input input-bordered '
									/>
									{errors.firstName && touched.firstName && (
										<div className='text-error text-sm mt-1'>
											{errors.firstName}
										</div>
									)}
								</div>

								<div>
									<Field
										name='lastName'
										type='text'
										placeholder='Surname'
										className='input input-bordered '
									/>
									{errors.lastName && touched.lastName && (
										<div className='text-error text-sm mt-1'>
											{errors.lastName}
										</div>
									)}
								</div>

								<div>
									<Field
										name='email'
										type='email'
										placeholder='Email'
										className='input input-bordered'
									/>
									{errors.email && touched.email && (
										<div className='text-error text-sm mt-1'>
											{errors.email}
										</div>
									)}
								</div>

								<div>
									<Field
										name='nickname'
										type='text'
										placeholder='Nickname'
										className='input input-bordered '
									/>
									{errors.nickname && touched.nickname && (
										<div className='text-error text-sm mt-1'>
											{errors.nickname}
										</div>
									)}
								</div>

								<div>
									<Field
										name='password'
										type='password'
										placeholder='Password'
										className='input input-bordered '
									/>
									{errors.password && touched.password && (
										<div className='text-error text-sm mt-1'>
											{errors.password}
										</div>
									)}
								</div>

								<div>
									<Field
										name='confirmPassword'
										type='password'
										placeholder='Confirm password'
										className='input input-bordered'
									/>
									{errors.confirmPassword && touched.confirmPassword && (
										<div className='text-error text-sm mt-1'>
											{errors.confirmPassword}
										</div>
									)}
								</div>

								<button type='submit' className='btn btn-primary'>
									Sign up
								</button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
			<div className='divider m-auto mt-[20px] mb-[20px]'>OR</div>
			<div className='flex justify-center mt-4 w-full google-auth'>
				<button
					onClick={() => signIn('google')}
					className='btn btn-outline gap-2 w-full max-w-xs hover:neutral'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						height='24'
						viewBox='0 0 24 24'
						width='24'
					>
						<path
							d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
							fill='#4285F4'
						/>
						<path
							d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
							fill='#34A853'
						/>
						<path
							d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
							fill='#FBBC05'
						/>
						<path
							d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
							fill='#EA4335'
						/>
					</svg>
					Continue with Google
				</button>
			</div>
		</div>
	);
}
