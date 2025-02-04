'use client';
import { useState, useEffect } from 'react';
import { ENDPOINTS } from '@/utils/config';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNotification } from '@/providers/NotificationProvider';
import { useLoading } from '@/providers/LoadingProvider';

const QuizSchema = Yup.object().shape({
	name: Yup.string()
		.min(3, 'Minimum 3 characters')
		.required('Name is required'),
	category: Yup.string().required('Category is required'),
	difficulty: Yup.string()
		.oneOf(['Easy', 'Medium', 'Hard'], 'Choose difficulty level')
		.required('Difficulty is required'),
});

export default function CreateQuizPage() {
	const [categories, setCategories] = useState([]);
	const { showNotification } = useNotification();
	const { setIsLoading } = useLoading();

	useEffect(() => {
		const fetchCategories = async () => {
			const response = await axios.get(`${ENDPOINTS.QUIZ}/categories`);
			console.log('categories:', response.data.data);
			setCategories(response.data.data);
		};
		fetchCategories();
	}, []);
	const handleSubmit = async (values) => {
		setIsLoading(true);
		console.log('Creating quiz...');
		console.log(values);
		try {
			const response = await axios.post(`${ENDPOINTS.QUIZ}`, values, {
				withCredentials: true,
			});
			console.log(response.data);
			showNotification(response.data.message, 'success');
		} catch (error) {
			console.error(error.response.data);
			showNotification(
				error.response?.data?.message || 'An error occurred',
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='p-6 max-w-2xl mx-auto'>
			<h1 className='text-3xl font-bold text-center mb-8'>Create new quizz</h1>
			<Formik
				initialValues={{
					name: '',
					category: '',
					difficulty: '',
				}}
				validationSchema={QuizSchema}
				onSubmit={handleSubmit}
			>
				{({ errors, touched }) => (
					<Form className='space-y-6'>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Quizz name</span>
							</label>
							<Field
								name='name'
								type='text'
								className='input input-bordered w-full'
								placeholder='Enter quiz name'
							/>
							{errors.name && touched.name && (
								<div className='text-error text-sm mt-1'>{errors.name}</div>
							)}
						</div>

						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Category</span>
							</label>
							<Field
								as='select'
								name='category'
								className='select select-bordered w-full'
							>
								<option value=''>Choose category</option>
								{categories.map((category) => (
									<option key={category._id} value={category.id}>
										{category.name}
									</option>
								))}
							</Field>
							{errors.category && touched.category && (
								<div className='text-error text-sm mt-1'>{errors.category}</div>
							)}
						</div>

						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Difficulty level</span>
							</label>
							<Field
								as='select'
								name='difficulty'
								className='select select-bordered w-full'
							>
								<option key='default' value=''>
									Choose difficulty level
								</option>
								<option key='easy' value='Easy'>
									Easy
								</option>
								<option key='medium' value='Medium'>
									Medium
								</option>
								<option key='hard' value='Hard'>
									Hard
								</option>
							</Field>
							{errors.difficulty && touched.difficulty && (
								<div className='text-error text-sm mt-1'>
									{errors.difficulty}
								</div>
							)}
						</div>
						<button type='submit' className='btn btn-primary w-full'>
							Create quiz
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
}
