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
				let inputClassName = `
				input input-bordered 
				text-xs sm:text-sm md:text-base 
				mx-1 my-1 
				min-w-[3rem] sm:min-w-[4rem] max-w-[150px]
				p-0 sm:p-1
				h-8 sm:h-10
				break-words
				overflow-hidden
			`;

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
		<div className='flex flex-col gap-4 sm:gap-6 w-full max-w-4xl mx-auto p-2 sm:p-4'>
			<div className='card bg-base-200'>
				<div className='card-body p-3 sm:p-6'>
					<div className='card-title text-xs sm:text-sm md:text-base mb-2 sm:mb-4 whitespace-pre-wrap break-words leading-relaxed flex-wrap'>
						{renderQuestionContent()}
					</div>

					<form onSubmit={handleSubmit} className='space-y-2 sm:space-y-4'>
						<div className='card-actions justify-end'>
							<button
								type='submit'
								className='btn btn-primary btn-sm sm:btn-md text-xs sm:text-sm'
								disabled={showingAnswer}
							>
								Submit Answer
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
