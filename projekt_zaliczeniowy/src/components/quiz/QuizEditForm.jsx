import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const QuizSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	category: Yup.string().required('Category is required'),
	difficulty: Yup.string().required('Difficulty is required'),
});

export default function QuizEditForm({ quiz, categories, onSubmit }) {
	return (
		<Formik
			initialValues={{
				name: quiz.name,
				category: quiz.category._id,
				difficulty: quiz.difficulty,
			}}
			validationSchema={QuizSchema}
			onSubmit={onSubmit}
		>
			{({ errors, touched }) => (
				<Form className='space-y-6 bg-base-100 shadow-lg rounded-lg p-6'>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Name</span>
						</label>
						<Field name='name' className='input input-bordered w-full' />
						{errors.name && touched.name && (
							<div className='text-error text-sm mt-1'>{errors.name}</div>
						)}
					</div>

					<div className='flex gap-4'>
						<div className='form-control flex-1'>
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
									<option key={category._id} value={category._id}>
										{category.name}
									</option>
								))}
							</Field>
							{errors.category && touched.category && (
								<div className='text-error text-sm mt-1'>{errors.category}</div>
							)}
						</div>

						<div className='form-control flex-1'>
							<label className='label'>
								<span className='label-text'>Difficulty level</span>
							</label>
							<Field
								as='select'
								name='difficulty'
								className='select select-bordered w-full'
							>
								<option value=''>Choose difficulty level</option>
								<option value='Easy'>Easy</option>
								<option value='Medium'>Medium</option>
								<option value='Hard'>Hard</option>
							</Field>
							{errors.difficulty && touched.difficulty && (
								<div className='text-error text-sm mt-1'>
									{errors.difficulty}
								</div>
							)}
						</div>
					</div>

					<button type='submit' className='btn btn-primary w-full'>
						Save changes
					</button>
				</Form>
			)}
		</Formik>
	);
}
