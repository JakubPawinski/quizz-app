'use client';

import Link from 'next/link';
import { APP_ROUTES } from '@/utils/config';
import QuizList from '@/components/quiz/QuizList';
import { useLoading } from '@/providers/LoadingProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';

export default function UserQuizzesPage() {
	const { user, isLoaded } = useAuth();
	const [quizzes, setQuizzes] = useState([]);
	const { setIsLoading } = useLoading();
	const router = useRouter();

	useEffect(() => {
		if (!isLoaded) {
			return;
		}
		// console.log('user quiz page:', user);
		const fetchUserQuizzes = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${ENDPOINTS.USER}/${user._id}`);
				const quizPromises = response.data.quizzes.map((quizId) =>
					axios.get(`${ENDPOINTS.QUIZ}/${quizId}`)
				);
				const quizzesResponse = await Promise.all(quizPromises);
				const quizzesData = quizzesResponse.map((quiz) => quiz.data.data);
				console.log('response:', quizzesData);
				setQuizzes(quizzesData);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
				setIsLoading(false);
			}
		};
		fetchUserQuizzes();
	}, [user, isLoaded, setIsLoading]);
	return (
		<div className='min-h-screen p-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold text-neutral'>My quizzes</h1>
					<Link href={APP_ROUTES.QUIZZES.CREATE} className='btn btn-primary'>
						Create new quiz
					</Link>
				</div>

				{quizzes.length === 0 ? (
					<div className='text-center py-12'>
						<h3 className='text-xl text-neutral-content mb-4'>
							You have not created any quizzes yet
						</h3>
						<p className='text-neutral-content mb-8'>
							Click the button below to create your first quiz
						</p>
						<Link
							href={APP_ROUTES.QUIZZES.CREATE}
							className='btn btn-primary btn-lg'
						>
							Create your first quiz
						</Link>
					</div>
				) : (
					<QuizList quizzes={quizzes} />
				)}
			</div>
		</div>
	);
}
