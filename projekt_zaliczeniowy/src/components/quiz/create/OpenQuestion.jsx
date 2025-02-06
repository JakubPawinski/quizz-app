import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	content: Yup.string().required('Question content is required'),
	answers: Yup.array()
		.of(
			Yup.object({
				content: Yup.string().required('Answer content is required'),
				isCorrect: Yup.boolean().required(),
			})
		)
		.min(1, 'At least one answer is required'),
	hint: Yup.string(),
	timeLimit: Yup.number().min(0, 'Time cannot be negative'),
});

const initialValues = {
	type: 'Open',
	content: '',
	answers: [{ content: '', isCorrect: true }],
	hint: '',
	timeLimit: 15,
};

export default function OpenQuestion({ onSubmit, defaultValues }) {
	const startingValues = defaultValues
		? {
				...initialValues,
				content: defaultValues.content || '',
				answers: defaultValues.answers || initialValues.answers,
				hint: defaultValues.hint || '',
				timeLimit: defaultValues.timeLimit || 15,
				type: 'Open',
		  }
		: initialValues;
	return (
		<Formik
			initialValues={startingValues}
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
							name='answers[0].content'
							as='textarea'
							className='textarea textarea-bordered w-full h-20 bg-base-100'
							placeholder='Enter the correct answer here...'
						/>
						{errors.answers?.[0]?.content && touched.answers?.[0]?.content && (
							<div className='text-error text-sm mt-1'>
								{errors.answers[0].content}
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
