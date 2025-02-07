import { useState } from 'react';

export default function FillInTheBlankGame({
	question,
	onAnswer,
	onTimeEnd,
	showingAnswer,
}) {
	const [answers, setAnswers] = useState(() => {
		return question.answers.map(() => '');
	});
	const [submittedAnswers, setSubmittedAnswers] = useState([]);
	const [isCorrect, setIsCorrect] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedAnswers = answers.map((answer) => answer.trim());
		if (trimmedAnswers.every((answer) => answer)) {
			setSubmittedAnswers(trimmedAnswers);
			const correct = checkAnswers(trimmedAnswers);
			setIsCorrect(correct);
			onAnswer(trimmedAnswers);
			// console.log('Submitted answers:', trimmedAnswers);
		}
	};

	const checkAnswers = (submittedAnswers) => {
		return submittedAnswers.every(
			(answer, index) =>
				answer.toLowerCase() === question.answers[index].content.toLowerCase()
		);
	};

	const handleInputChange = (index, value) => {
		const newAnswers = [...answers];
		newAnswers[index] = value;
		setAnswers(newAnswers);
	};

	const renderQuestionContent = () => {
		const parts = question.content.trim().split(' ');
		let inputIndex = 0;
		return parts.map((part, index) => {
			if (part === '___' || (part.startsWith('[') && part.endsWith(']'))) {
				const currentIndex = inputIndex++;
				let inputClassName =
					'input input-bordered text-sm mx-1 my-1 w-12 break-words p-0';

				if (showingAnswer) {
					const isAnswerCorrect =
						submittedAnswers[currentIndex].toLowerCase() ===
						question.answers[currentIndex].content.toLowerCase();
					// console.log('isAnswerCorrect:', isAnswerCorrect);

					inputClassName = `${inputClassName} ${getAnswerClassName(
						isAnswerCorrect
					)}`;
				}
				return (
					<input
						key={index}
						type='text'
						className={inputClassName}
						value={answers[currentIndex]}
						onChange={(e) =>
							showingAnswer
								? null
								: handleInputChange(currentIndex, e.target.value)
						}
						required
					/>
				);
			}
			return <span key={index}>{part}</span>;
		});
	};

	const getAnswerClassName = (isCorrectAnswer) => {
		return isCorrectAnswer
			? ' textarea-bordered border-2 border-success bg-success/10'
			: ' textarea-bordered border-2 border-error bg-error/10';
	};

	return (
		<div className='flex flex-col gap-6 w-full  mx-auto p-4'>
			<div className='card bg-base-200'>
				<div className='card-body'>
					<div className='card-title text-sm mb-4 break-words'>
						{renderQuestionContent()}
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
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
