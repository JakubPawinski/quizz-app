'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';
import QuizList from '@/components/quiz/QuizList';

export default function AdminQuizzesPage() {
	const [quizzes, setQuizzes] = useState([]);
	const { setIsLoading } = useLoading();

	const fetchAllQuizzes = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`${ENDPOINTS.QUIZ}/all`);
			// console.log('response:', response.data.data);
			setQuizzes(response.data.data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAllQuizzes();
	}, []);

	useEffect(() => {
		window.addEventListener('refreshQuizzes', fetchAllQuizzes);
		return () => {
			window.removeEventListener('refreshQuizzes', fetchAllQuizzes);
		};
	}, []);

	return (
		<div className='quizzes-page'>
			<QuizList quizzes={quizzes} />
		</div>
	);
}
