'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/config';
import { useLoading } from '@/providers/LoadingProvider';
import QuizList from '@/components/quiz/QuizList';
import useEventListener from '@/hooks/useEventListener';

export default function AdminQuizzesPage() {
	const [quizzes, setQuizzes] = useState([]);

	//Context
	const { setIsLoading } = useLoading();

	//Function to fetch all quizzes
	const fetchAllQuizzes = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`${ENDPOINTS.QUIZ}/all`);
			setQuizzes(response.data.data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [setIsLoading]);
	//UseEffect to fetch all quizzes
	useEffect(() => {
		fetchAllQuizzes();
	}, []);

	//Event listener to refresh quizzes
	useEventListener('refreshQuizzes', fetchAllQuizzes);

	return (
		<div className='quizzes-page'>
			<QuizList quizzes={quizzes} />
		</div>
	);
}
