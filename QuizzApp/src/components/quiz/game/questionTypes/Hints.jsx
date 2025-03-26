import { useState, useEffect } from 'react';

export default function Hints({ question, showingAnswer }) {
	const [showHint, setShowHint] = useState(false);

	// useEffect to hide hint when showing answer
	useEffect(() => {
		if (showingAnswer) {
			setShowHint(false);
		}
	}, [showingAnswer]);

	return (
		<div className='flex flex-col gap-2'>
			{!showingAnswer && (
				<div className='w-full flex flex-col gap-2'>
					<div className='flex flex-wrap gap-2'>
						{question.hint && (
							<button
								onClick={() => setShowHint(!showHint)}
								className='btn btn-info btn-sm text-xs sm:text-sm'
							>
								{showHint ? 'Hide Hint' : 'Show Hint'}
							</button>
						)}
					</div>

					{showHint && question.hint && (
						<div className='alert alert-info text-xs sm:text-sm flex items-center p-2 sm:p-4'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								className='stroke-current shrink-0 w-4 h-4 sm:w-6 sm:h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							<span className='ml-2'>Hint: {question.hint}</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
