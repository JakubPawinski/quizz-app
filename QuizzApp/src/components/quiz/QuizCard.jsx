import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/config';
import { useUser } from '@/providers/AuthProvider';
import axios from 'axios';
import { ENDPOINTS } from '@/config';
import { useNotification } from '@/providers/NotificationProvider';

export default function QuizCard({ quiz }) {
	const pathname = usePathname();
	const router = useRouter();

	//Context
	const { user } = useUser();
	const { showNotification } = useNotification();

	//Function to get the color of the difficulty
	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case 'Easy':
				return 'bg-green-100 text-green-800';
			case 'Medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'Hard':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	//Function to handle the click on the card
	const handleClick = () => {
		// console.log('Handle click');
		// console.log('quiz:', quiz);
		// console.log('router:', pathname);

		if (pathname.includes('user')) {
			// console.log('User quiz');
			router.push(`${APP_ROUTES.USER.QUIZ_EDIT(user._id, quiz._id)}`);
		} else if (pathname.includes('admin')) {
			// console.log('Admin quiz');
			router.push(`${APP_ROUTES.ADMIN.QUIZ_EDIT(quiz._id)}`);
		} else {
			router.push(`${APP_ROUTES.QUIZZES.QUIZ(quiz._id)}`);
			// console.log(`${APP_ROUTES.QUIZZES.QUIZ(quiz._id)}`);
		}
	};

	//Function to handle the delete of the quiz
	const handleDelete = async () => {
		// console.log('Delete quiz');
		try {
			const response = await axios.delete(`${ENDPOINTS.QUIZ}/${quiz._id}`, {
				withCredentials: true,
			});
			// console.log('response:', response.data);
			showNotification('Quiz deleted successfully', 'success');
			dispatchEvent(new Event('refreshQuizzes'));
		} catch (error) {
			console.error(error);
			showNotification(
				error.response.data.message || 'An occure error',
				'error'
			);
		}
	};

	return (
		<div className='card bg-base-100 w-96 shadow-xl hover:shadow-2xl transition-shadow'>
			{user?.rootAccess && (
				<button
					onClick={handleDelete}
					className='absolute top-2 right-2 btn btn-error btn-xs btn-outline'
				>
					Delete
				</button>
			)}
			<div className='card-body'>
				<h2 className='card-title text-xl font-bold mb-2'>{quiz.name}</h2>

				<div className='flex items-center gap-2 mb-4'>
					<span className='px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
						{quiz.category.name}
					</span>
					<span
						className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
							quiz.difficulty
						)}`}
					>
						{quiz.difficulty}
					</span>
					<span className='text-gray-600 text-sm'>
						{quiz.questions.length} questions
					</span>
				</div>

				<div className='flex items-center text-sm text-gray-500 mb-4'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 mr-1'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
						/>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
						/>
					</svg>
					{quiz.popularity} games played
				</div>

				<div className='card-actions justify-end'>
					<button className='btn btn-primary' onClick={handleClick}>
						See more
					</button>
				</div>
			</div>
		</div>
	);
}
