import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	content: Yup.string().required('Question content is required'),
	correctAnswer: Yup.string().required('Correct answer is required'),
	hint: Yup.string(),
	timeLimit: Yup.number().min(0, 'Time cannot be negative'),
});

const initialValues = {
	type: 'Open',
	content: '',
	correctAnswer: '',
	hint: '',
	timeLimit: 0,
};

export default function OpenQuestion({ quizId }) {
	const onSubmit = async (values) => {
		console.log('values:', values);
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ errors, touched }) => (
				<Form className='space-y-6 w-full max-w-3xl mx-auto p-6'>
					<div className='mb-6'>
						<Field
							name='content'
							as='textarea'
							className='textarea textarea-bordered w-full h-10 bg-base-100'
							placeholder='Enter your question here...'
						/>
						{errors.content && touched.content && (
							<div className='text-error text-sm mt-1'>{errors.content}</div>
						)}
					</div>

					<div className='mb-6'>
						<Field
							name='correctAnswer'
							as='textarea'
							className='textarea textarea-bordered w-full h-20 bg-base-100'
							placeholder='Enter the correct answer here...'
						/>
						{errors.correctAnswer && touched.correctAnswer && (
							<div className='text-error text-sm mt-1'>
								{errors.correctAnswer}
							</div>
						)}
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div>
							<Field
								name='hint'
								className='input input-bordered input-sm w-full bg-base-100'
								placeholder='Hint (optional)'
							/>
						</div>
						<div>
							<Field
								type='number'
								name='timeLimit'
								className='input input-bordered input-sm w-full bg-base-100'
								placeholder='Time limit (seconds)'
							/>
							{errors.timeLimit && touched.timeLimit && (
								<div className='text-error text-sm mt-1'>
									{errors.timeLimit}
								</div>
							)}
						</div>
					</div>

					<button type='submit' className='btn btn-primary w-full'>
						Save Question
					</button>
				</Form>
			)}
		</Formik>
	);
}
