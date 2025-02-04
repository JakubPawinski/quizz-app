'use client';
import { ENDPOINTS } from '@/utils/config';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useLoading } from '@/providers/LoadingProvider';
import axios from 'axios';
import QuizList from '@/components/quiz/QuizList';

export default function QuizzesPage() {
	const [quizzes, setQuizzes] = useState([]);
	const { setIsLoading } = useLoading();

	useEffect(() => {
		const fetchAllQuizzes = async () => {
			const response = await axios.get(`${ENDPOINTS.QUIZ}/all`);
			setQuizzes(response.data.data);
			console.log(response.data.data);
		};
		fetchAllQuizzes();
	}, []);

	return (
		<div className='quizzes-page'>
			<QuizList quizzes={quizzes} />
		</div>
	);
}
