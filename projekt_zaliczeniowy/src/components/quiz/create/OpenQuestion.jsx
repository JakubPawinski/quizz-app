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
				<Form className='space-y-4 md:space-y-6 w-full max-w-3xl mx-auto p-3 sm:p-4 md:p-6'>
					<div className='space-y-2'>
						<Field
							name='content'
							as='textarea'
							className='textarea textarea-bordered w-full min-h-[60px] md:min-h-[80px] bg-base-100 text-sm md:text-base transition-all'
							placeholder='Enter your question here...'
						/>
						{errors.content && touched.content && (
							<div className='text-error text-xs md:text-sm mt-1'>
								{errors.content}
							</div>
						)}
					</div>

					<div className='space-y-2'>
						<Field
							name='answers[0].content'
							as='textarea'
							className='textarea textarea-bordered w-full min-h-[80px] md:min-h-[100px] bg-base-100 text-sm md:text-base transition-all'
							placeholder='Enter the correct answer here...'
						/>
						{errors.answers?.[0]?.content && touched.answers?.[0]?.content && (
							<div className='text-error text-xs md:text-sm mt-1'>
								{errors.answers[0].content}
							</div>
						)}
					</div>

					<button
						type='submit'
						className='btn btn-primary w-full text-sm md:text-base mt-4 md:mt-6 transition-all hover:scale-[1.02]'
					>
						Save Question
					</button>
				</Form>
			)}
		</Formik>
	);
}
