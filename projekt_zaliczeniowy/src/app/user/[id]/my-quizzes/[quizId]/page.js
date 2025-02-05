'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';
import QuizEditForm from '@/components/quiz/QuizEditForm';
import QuestionManager from '@/components/quiz/QuestionManager';

export default function QuizEditPage() {
	const params = useParams();
	const { quizId } = params;
	const [quiz, setQuiz] = useState(null);
	const { setIsLoading } = useLoading();
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			const response = await axios.get(`${ENDPOINTS.QUIZ}/categories`);
			// console.log('categories:', response.data.data);
			setCategories(response.data.data);
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		const fetchQuiz = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${ENDPOINTS.QUIZ}/${quizId}`);
				console.log('response:', response.data.data);

				setQuiz(response.data.data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchQuiz();
	}, [quizId, setIsLoading]);

	useEffect(() => {
		if (!quiz) return;
		return () => {};
	}, [quiz]);

	const handleSubmit = async (values) => {
		console.log('values:', values);
	};

	const onNewQuestion = () => {
		console.log('Add new question');
		console.log('quiz:', quiz);
		setQuiz({
			...quiz,
			questions: [
				...quiz.questions,
				{
					placeholder: 'Question',
					_id: Math.random().toString(36).substring(7),
				},
			],
			numberOfQuestions: quiz.numberOfQuestions + 1,
		});
	};

	if (!quiz) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center space-y-4'>
					<p className='text-xl text-neutral-content'>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen p-8'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-bold text-neutral mb-8'>Edit your quiz</h1>
				<QuizEditForm
					quiz={quiz}
					categories={categories}
					onSubmit={handleSubmit}
				/>
				<div className='divider'></div>
				{quiz.numberOfQuestions > 0 ? (
					<div className='flex flex-col items-center justify-center space-y-6 p-8 bg-base-200 rounded-lg'>
						{quiz.questions.map((question) => (
							<QuestionManager key={question._id} question={question} />
						))}
						<button className='btn btn-primary' onClick={onNewQuestion}>
							Add question
						</button>
					</div>
				) : (
					<div className='flex flex-col items-center justify-center space-y-6 p-8 bg-base-200 rounded-lg'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-16 w-16 text-primary' 
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<p className='text-2xl font-semibold text-neutral'>
							No questions yet
						</p>
						<p className='text-neutral text-center max-w-md'>
							Your quiz does not have any questions yet. Add your first question
							to get started.
						</p>
						<button className='btn btn-primary' onClick={onNewQuestion}>
							Add question
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
