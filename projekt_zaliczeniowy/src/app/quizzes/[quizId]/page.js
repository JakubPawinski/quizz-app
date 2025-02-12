'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLoading } from '@/providers/LoadingProvider';
import QuizGame from '@/components/quiz/game/QuizGame';
import Comment from '@/components/quiz/comments/comment';
import AddComment from '@/components/quiz/comments/AddComment';
import { useUser } from '@/providers/AuthProvider';

export default function QuizPage() {
	const [isStarted, setIsStarted] = useState(false);
	const [quiz, setQuiz] = useState(null);
	const [quizRanking, setQuizRanking] = useState([]);
	const { quizId } = useParams();
	const { setIsLoading } = useLoading();
	const [refreshRank, setRefreshRank] = useState(false);
	const { user } = useUser();

	const handleCommentDelete = (commentId) => {
		setQuiz((prevQuiz) => ({
			...prevQuiz,
			comments: prevQuiz.comments.filter(
				(comment) => comment._id !== commentId
			),
		}));
	};
	const handleCommentAdded = (newComment) => {
		setQuiz((prevQuiz) => ({
			...prevQuiz,
			comments: [newComment, ...prevQuiz.comments],
		}));
	};

	useEffect(() => {
		// Fetch quiz data

		setIsLoading(true);
		const fetchQuiz = async () => {
			try {
				const response = await axios.get(`${ENDPOINTS.QUIZ}/${quizId}`);
				// console.log('response:', response.data.data.comments);
				setQuiz(response.data.data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		const fetchQuizRanking = async () => {
			try {
				const response = await axios.get(`${ENDPOINTS.RANKING}/${quizId}/3`);
				console.log('ranking:', response.data.data);
				const ranking = response.data.data ? response.data.data : [];
				setQuizRanking(ranking);
			} catch (error) {
				console.log(error);
			}
		};
		fetchQuiz();
		fetchQuizRanking();
	}, [quizId, setIsLoading, refreshRank]);

	if (!quiz) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<p className='text-primary'>Loading data</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-8 min-h-screen bg-base-100'>
			{/* Header */}
			<header className='text-center mb-12'>
				<h1 className='text-4xl font-bold text-primary mb-4'>{quiz.name}</h1>
				<p className='text-sm text-base-content/80'>
					Challenge yourself with this interactive quiz! Test your knowledge,
					learn something new, and compare your score with others. Are you ready
					to begin?
				</p>
			</header>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Quiz Section */}
				<div className='lg:col-span-2'>
					{!isStarted ? (
						<div className='card bg-base-200 shadow-xl'>
							<div className='card-body items-center text-center'>
								<h2 className='card-title text-2xl mb-4'>Ready to start?</h2>
								<button
									className='btn btn-primary btn-lg'
									onClick={() => setIsStarted(true)}
								>
									Start Quiz
								</button>
							</div>
						</div>
					) : (
						<div className='card bg-base-200 shadow-xl'>
							<div className='card-body'>
								<div>
									<QuizGame
										quiz={quiz}
										onFinish={() => setRefreshRank(!refreshRank)}
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Sidebar */}
				<div className='space-y-8'>
					{/* Scoreboard */}
					<div className='card bg-base-200 shadow-xl'>
						<div className='card-body'>
							<h2 className='card-title text-xl mb-4'>Top Scores</h2>
							<ul className='space-y-2'>
								{quizRanking.length > 0 && quizRanking ? (
									quizRanking.map((user, index) => (
										<li
											key={index}
											className='flex justify-between items-center p-2 bg-base-100 rounded-lg'
										>
											<span className='flex items-center gap-2 font-medium'>
												<span className='w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-primary'>
													{user.rank}
												</span>
												<span className='text-base-content'>
													{user.nickname}
												</span>
											</span>
											<span className='badge badge-primary'>
												{user.stats.averageCorrectAnswersPercentage} %
											</span>
										</li>
									))
								) : (
									<p className='text-base-content'>No scores yet</p>
								)}
								<p className='text-xs text-base-content/70 italic'>
									Ranking based on average correct answers percentage
								</p>
							</ul>
						</div>
					</div>

					{/* Comments */}
					<div className='card bg-base-200 shadow-xl'>
						<div className='card-body'>
							<h2 className='card-title text-xl mb-4'>Comments</h2>
							<div className='space-y-4 max-h-96 overflow-y-auto'>
								{quiz.comments
									.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
									.map((comment, index) => {
										return (
											<Comment
												key={index}
												comment={comment}
												onDelete={handleCommentDelete}
												quizId={quizId}
											/>
										);
									})}
							</div>
							<div className='mt-4'>
								<AddComment
									quizId={quizId}
									onCommentAdded={handleCommentAdded}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
