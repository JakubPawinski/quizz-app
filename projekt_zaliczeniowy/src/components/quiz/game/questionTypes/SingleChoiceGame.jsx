import { useState } from 'react';
import useElimination from '@/hooks/useElimination';

export default function SingleChoiceGame({
	question,
	onAnswer,
	onTimeEnd,
	showingAnswer,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const { handleEliminateOne, eliminatedAnswers } = useElimination();

	const handleEliminate = () => {
		setSelectedAnswer([]);
		handleEliminateOne(question.answers);
	};

	const getOptionClassName = (option) => {
		const eliminatedStyle = eliminatedAnswers.includes(option)
			? 'opacity-50 line-through cursor-not-allowed'
			: '';
		if (!showingAnswer) {
			return `flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${eliminatedStyle}
                ${
									selectedAnswer === option
										? 'bg-primary/20 border-primary'
										: 'bg-base-100 hover:bg-base-300'
								} border-2`;
		}
		if (selectedAnswer === option) {
			return `flex items-center gap-3 p-4 rounded-lg border-2 
                ${
									option.isCorrect
										? 'bg-success/20 border-success'
										: 'bg-error/20 border-error'
								}`;
		}
		return 'flex items-center gap-3 p-4 rounded-lg border-2 bg-base-100';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedAnswer) {
			onAnswer(selectedAnswer);
		}
	};

	return (
		<div className='flex flex-col gap-6 w-full max-w-2xl mx-auto'>
			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title text-2xl mb-4'>{question.content}</h2>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							{question.answers.map((option, index) => (
								<label key={index} className={getOptionClassName(option)}>
									<input
										type='radio'
										className='radio radio-primary'
										checked={selectedAnswer === option}
										onChange={() => {
											if (
												!showingAnswer &&
												!eliminatedAnswers.includes(option)
											) {
												setSelectedAnswer(option);
											}
										}}
										disabled={showingAnswer}
									/>
									<span className='text-lg'>{option.content}</span>
									{showingAnswer && selectedAnswer === option && (
										<span
											className={`ml-auto ${
												option.isCorrect ? 'text-success' : 'text-error'
											}`}
										>
											{option.isCorrect ? '✓ Correct' : '✗ Incorrect'}
										</span>
									)}
								</label>
							))}
						</div>

						<div className='card-actions justify-end mt-6'>
							<button
								type='button'
								className='btn btn-warning'
								onClick={handleEliminate}
								disabled={eliminatedAnswers.length > 0 || showingAnswer}
							>
								Eliminate one answer
							</button>
							<button
								type='submit'
								className='btn btn-primary'
								disabled={!selectedAnswer || showingAnswer}
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
