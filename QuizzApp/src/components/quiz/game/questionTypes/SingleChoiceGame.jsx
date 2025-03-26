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

	// Function to handle elimination
	const handleEliminate = () => {
		setSelectedAnswer([]);
		handleEliminateOne(question.answers);
	};

	// Function to get option class name
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

	// Function to handle form submission
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
		</div>
	);
}
