'use client';
import { ENDPOINTS } from '@/config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizList from '@/components/quiz/QuizList';

export default function QuizzesPage() {
	const [quizzes, setQuizzes] = useState([]);

	//UseEffect to fetch all quizzes
	useEffect(() => {
		const fetchAllQuizzes = async () => {
			const response = await axios.get(`${ENDPOINTS.QUIZ}/all`);
			setQuizzes(response.data.data);
			// console.log(response.data.data);
		};
		fetchAllQuizzes();
	}, []);

	return (
		<div className='quizzes-page'>
			<QuizList quizzes={quizzes} />
		</div>
	);
}
