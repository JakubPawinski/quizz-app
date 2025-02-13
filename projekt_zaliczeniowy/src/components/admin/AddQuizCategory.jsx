import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ENDPOINTS } from '@/config';
import { useLoading } from '@/providers/LoadingProvider';
import { useNotification } from '@/providers/NotificationProvider';

const CategorySchema = Yup.object().shape({
	name: Yup.string().required('Category name is required'),
});

export default function AddQuizCategory() {
	//Context
	const { setIsLoading } = useLoading();
	const { showNotification } = useNotification();

	//Function to handle adding category
	const handleAddCategory = async (values, { resetForm }) => {
		setIsLoading(true);
		try {
			const response = await axios.post(`${ENDPOINTS.QUIZ}/category`, values, {
				withCredentials: true,
			});
			showNotification(
				response.data.message || 'Category added successfully',
				'success'
			);
			resetForm();
			dispatchEvent(new Event('refreshCategories'));
		} catch (error) {
			console.error('Error adding category:', error);
			showNotification(
				error.response?.data?.message || 'Failed to add category',
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center'>
			<div className='card bg-base-200 p-6 w-full max-w-md hover:shadow-lg'>
				<h2 className='card-title text-primary mb-4'>Add Quiz Category</h2>
				<Formik
					initialValues={{ name: '' }}
					validationSchema={CategorySchema}
					onSubmit={handleAddCategory}
				>
					{({ errors, touched, isSubmitting }) => (
						<Form className='space-y-4'>
							<div>
								<Field
									name='name'
									type='text'
									placeholder='Category Name'
									className='input input-bordered w-full'
								/>
								{errors.name && touched.name && (
									<div className='text-error text-sm mt-1'>{errors.name}</div>
								)}
							</div>
							<button
								type='submit'
								className='btn btn-primary w-full'
								disabled={isSubmitting}
							>
								Add Category
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}
