import { useState, useEffect } from 'react';

export default function OpenQuestionGame({
	question,
	onAnswer,
	onTimeEnd,
	showingAnswer,
}) {
	const [answer, setAnswer] = useState('');
	const [submittedAnswer, setSubmittedAnswer] = useState('');
	const [isCorrect, setIsCorrect] = useState(null);

	// useEffect(() => {
	// 	// console.log(showingAnswer);
	// 	return () => {};
	// }, [showingAnswer]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (answer.trim()) {
			const trimmedAnswer = answer.trim();
			setSubmittedAnswer(trimmedAnswer);
			const correct = checkAnswer(trimmedAnswer);
			setIsCorrect(correct);
			onAnswer(trimmedAnswer);
			// console.log('Submitted answer:', trimmedAnswer);
		}
	};

	const checkAnswer = (submittedAnswer) => {
		return (
			submittedAnswer.toLowerCase() ===
			question.answers[0].content.toLowerCase()
		);
	};

	const getAnswerClassName = () => {
		// console.log(isCorrect);
		if (submittedAnswer === '') {
			return 'textarea-bordered border-2';
		}
		return isCorrect
			? 'textarea-bordered border-2 border-success bg-success/10'
			: 'textarea-bordered border-2 border-error bg-error/10';
	};

	return (
		<div className='flex flex-col gap-6 w-full max-w-2xl mx-auto'>
			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title text-2xl mb-4'>{question.content}</h2>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='form-control'>
							<textarea
								className={`textarea h-32 text-lg ${getAnswerClassName()}`}
								placeholder='Type your answer here...'
								value={answer}
								onChange={(e) =>
									!showingAnswer ? setAnswer(e.target.value) : null
								}
								required
							/>
						</div>

						<div className='card-actions justify-end'>
							<button
								type='submit'
								className='btn btn-primary'
								disabled={showingAnswer}
							>
								Submit Answer
							</button>
						</div>
					</form>
				</div>
			</div>

			{question.hint && (
				<div className='alert alert-info'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						className='stroke-current shrink-0 w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						></path>
					</svg>
					<span>Hint: {question.hint}</span>
				</div>
			)}
		</div>
	);
}
