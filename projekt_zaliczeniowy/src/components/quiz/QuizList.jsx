'use client';
import QuizCard from './QuizCard';
import { useState, useLayoutEffect } from 'react';
export default function QuizList({ quizzes }) {
	const [windowWidth, setWindowWidth] = useState(0);
	useLayoutEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	const isMobile = windowWidth < 440;
	return (
		<div className='flex flex-wrap justify-center'>
			<div
				className={`w-full ${
					isMobile
						? 'flex flex-col gap-4 justify-center items-center'
						: 'grid lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto place-items-center justify-items-center'
				}`}
			>
				{quizzes.map((quiz) => (
					<QuizCard key={quiz._id} quiz={quiz} />
				))}
			</div>
		</div>
	);
}
