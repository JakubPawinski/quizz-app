import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	content: Yup.string()
		.required('Question content is required')
		.test(
			'has-blanks',
			'Question must contain at least one blank [...] or ___',
			(value) => value?.includes('[...]') || value?.includes('___')
		),
	answers: Yup.array()
		.of(
			Yup.object({
				content: Yup.string().required('Answer content is required'),
				isCorrect: Yup.boolean().equals(
					[true],
					'All answers must be marked as correct'
				),
			})
		)
		.min(1, 'At least one blank must be filled'),
	hint: Yup.string(),
	timeLimit: Yup.number().min(0, 'Time cannot be negative'),
});

const initialValues = {
	type: 'Fill in the Blank',
	content: '',
	answers: [{ content: '', isCorrect: true }],
	hint: '',
	timeLimit: 15,
};

export default function FillInTheBlankQuestion({ onSubmit, defaultValues }) {
	const startingValues = defaultValues
		? {
				...initialValues,
				content: defaultValues.content || '',
				answers: defaultValues.answers || initialValues.answers,
				hint: defaultValues.hint || '',
				timeLimit: defaultValues.timeLimit || 15,
				type: 'Fill in the Blank',
		  }
		: initialValues;
	return (
		<Formik
			initialValues={startingValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched }) => (
				<Form className='space-y-6 w-full max-w-3xl mx-auto p-6'>
					<div className='mb-6'>
						<label className='block text-sm mb-2'>
							Question content (use [...] or ___ for blanks)
						</label>
						<Field
							name='content'
							as='textarea'
							className='textarea textarea-bordered w-full h-24 bg-base-100'
							placeholder='Example: The capital of Poland is [...]'
						/>
						{errors.content && touched.content && (
							<div className='text-error text-sm mt-1'>{errors.content}</div>
						)}
					</div>

					<FieldArray name='answers'>
						{({ push, remove }) => (
							<div className='space-y-3'>
								<label className='block text-sm mb-2'>
									Correct answers for blanks
								</label>
								{values.answers.map((_, index) => (
									<div key={index} className='flex items-center gap-2'>
										<div className='flex-1'>
											<Field
												name={`answers.${index}.content`}
												className='input input-bordered input-sm w-full bg-base-100'
												placeholder={`Answer for blank ${index + 1}`}
											/>
										</div>
										<Field
											type='hidden'
											name={`answers.${index}.isCorrect`}
											value={true}
										/>
										{values.answers.length > 1 && (
											<button
												type='button'
												className='btn btn-error btn-sm'
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
									onClick={() => push({ content: '', isCorrect: true })}
								>
									Add blank
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
