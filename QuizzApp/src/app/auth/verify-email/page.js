'use client';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/providers/LoadingProvider';
import { useNotification } from '@/providers/NotificationProvider';
import { ENDPOINTS, APP_ROUTES } from '@/config';
import axios from 'axios';
import * as Yup from 'yup';

const VerifySchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	code: Yup.string().required('Code is required'),
});

export default function VerifyPage() {
	const router = useRouter();

	//Context
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	//Function to handle verification
	const handleSubmit = async (values) => {
		console.log(values);
		try {
			// console.log('Verifying email...');
			setIsLoading(true);
			// console.log(`${ENDPOINTS.AUTH}/verify-email`);
			const response = await axios.post(`${ENDPOINTS.AUTH}/verify-email`, {
				email: values.email,
				hash: values.code,
			});
			showNotification(response.data.message, 'success');
			// console.log(response.data);
			router.push(`${APP_ROUTES.AUTH.LOGIN}`);
		} catch (error) {
			console.log(error.response.data);
			showNotification(
				error.response?.data?.message || 'An error occurred',
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='auth-page'>
			<div className='flex justify-center mt-20'>
				<div className='auth-form'>
					<h2 className='text-2xl font-bold mb-4'>Verify your email</h2>
					<p className='text-center text-neutral-content mb-6'>
						Enter your email and the verification code that was sent to your
						inbox
					</p>

					<Formik
						initialValues={{ email: '', code: '' }}
						validationSchema={VerifySchema}
						onSubmit={handleSubmit}
					>
						{({ errors, touched }) => (
							<Form className='space-y-4'>
								<div>
									<Field
										name='email'
										type='email'
										placeholder='Email'
										className='input input-bordered w-full'
									/>
									{errors.email && touched.email && (
										<div className='text-error text-sm mt-1'>
											{errors.email}
										</div>
									)}
								</div>

								<div>
									<Field
										name='code'
										type='text'
										placeholder='Verification code'
										className='input input-bordered w-full'
									/>
									{errors.code && touched.code && (
										<div className='text-error text-sm mt-1'>{errors.code}</div>
									)}
								</div>

								<button type='submit' className='btn btn-primary w-full'>
									Verify
								</button>
							</Form>
						)}
					</Formik>

					<div className='divider m-auto mt-[20px] mb-[20px]'></div>
				</div>
			</div>
		</div>
	);
}
