import { useState } from 'react';

import useElimination from '@/hooks/useElimination';

export default function MultipleChoiceGame({
	question,
	onAnswer,
	onTimeEnd,
	showingAnswer,
}) {
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const { handleEliminateOne, eliminatedAnswers } = useElimination();


	const handleEliminate = () => {
		setSelectedAnswers([]);
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
									selectedAnswers.includes(option)
										? 'bg-primary/20 border-primary'
										: 'bg-base-100 hover:bg-base-300'
								} border-2`;
		}
		if (selectedAnswers.includes(option)) {
			return `flex items-center gap-3 p-4 rounded-lg border-2 
                ${
									option.isCorrect
										? 'bg-success/20 border-success'
										: 'bg-error/20 border-error'
								}`;
		}
		return 'flex items-center gap-3 p-4 rounded-lg border-2 bg-base-100';
	};

	// Function to handle option click
	const handleOptionClick = (option) => {
		if (eliminatedAnswers.includes(option)) return;
		if (!showingAnswer) {
			if (selectedAnswers.includes(option)) {
				setSelectedAnswers(selectedAnswers.filter((ans) => ans !== option));
			} else {
				setSelectedAnswers([...selectedAnswers, option]);
			}
		}
	};

	// Function to handle form submit
	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedAnswers.length > 0) {
			onAnswer(selectedAnswers);
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
										type='checkbox'
										className='checkbox checkbox-primary'
										checked={selectedAnswers.includes(option)}
										onChange={() => !showingAnswer && handleOptionClick(option)}
										disabled={showingAnswer}
									/>
									<span className='text-lg'>{option.content}</span>
									{showingAnswer && selectedAnswers.includes(option) && (
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
								disabled={selectedAnswers.length === 0 || showingAnswer}
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
