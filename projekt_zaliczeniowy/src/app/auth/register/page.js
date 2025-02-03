'use client';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useAuth } from '@/providers/AuthProvider';
import { useLoading } from '@/providers/LoadingProvider';
import { useRouter } from 'next/navigation';
import SignInGoogle from '@/components/auth/SignInGoogle';

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
			<SignInGoogle />
		</div>
	);
}
