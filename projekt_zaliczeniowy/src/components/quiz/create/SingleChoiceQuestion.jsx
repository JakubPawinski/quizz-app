import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	content: Yup.string().required('Question content is required'),
	answers: Yup.array()
		.of(
			Yup.object({
				content: Yup.string().required('Answer content is required'),
				isCorrect: Yup.boolean(),
			})
		)
		.min(2, 'Minimum 2 answers required')
		.test('one-correct', 'Exactly one answer must be correct', (answers) => {
			return answers?.filter((answer) => answer.isCorrect).length === 1;
		}),
	hint: Yup.string(),
	timeLimit: Yup.number().min(0, 'Time cannot be negative'),
});

const initialValues = {
	type: 'Single Choice',
	content: '',
	answers: [
		{ content: '', isCorrect: false },
		{ content: '', isCorrect: false },
	],
	hint: '',
	timeLimit: 0,
};

export default function SingleChoiceQuestion({ onSubmit }) {
	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched, setFieldValue }) => (
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
					<FieldArray name='answers'>
						{({ push, remove }) => (
							<div className='space-y-3'>
								{values.answers.map((_, index) => (
									<div key={index} className='flex items-center gap-2 min-w-0'>
										<Field
											type='radio'
											name={`answers.${index}.isCorrect`}
											className='radio radio-primary shrink-0'
											checked={values.answers[index].isCorrect}
											onChange={() => {
												const newAnswers = values.answers.map((answer, i) => ({
													...answer,
													isCorrect: i === index,
												}));
												setFieldValue('answers', newAnswers);
											}}
										/>
										<div className='flex-1 min-w-0 w-full'>
											<Field
												name={`answers.${index}.content`}
												className='input input-bordered input-sm flex-1 bg-base-100 w-full'
												placeholder={`Answer ${index + 1}`}
											/>
										</div>
										{values.answers.length > 2 && (
											<button
												type='button'
												className='btn btn-error btn-sm shrink-0'
												onClick={() => remove(index)}
											>
												Delete
											</button>
										)}
									</div>
								))}
								<button
									type='button'
									className='btn btn-secondary btn-sm w-full'
									onClick={() => push({ content: '', isCorrect: false })}
								>
									Add answer
								</button>
							</div>
						)}
					</FieldArray>

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
