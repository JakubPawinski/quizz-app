'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/config';
import { useLoading } from '@/providers/LoadingProvider';

const LEADERBOARD_COUNT = 10;

export default function LeaderboardPage() {
	const [leaderboard, setLeaderboard] = useState([]);
	const { setIsLoading } = useLoading();

	//UseEffect to fetch leaderboard
	useEffect(() => {
		const fetchLeaderboard = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${ENDPOINTS.RANKING}/global/${LEADERBOARD_COUNT}`);
				setLeaderboard(response.data.data);
			} catch (error) {
				console.error('Error fetching leaderboard:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeaderboard();
	}, [setIsLoading]);

	//Function to get medal color
	const getMedalColor = (rank) => {
		switch (rank) {
			case 1:
				return 'bg-yellow-400';
			case 2:
				return 'bg-gray-300';
			case 3:
				return 'bg-amber-600';
			default:
				return '';
		}
	};

	return (
		<div className='min-h-screen p-4 sm:p-8'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-4xl font-bold text-center mb-8'>
					Global Leaderboard
				</h1>

				<div className='hidden md:block overflow-x-auto bg-base-100 rounded-lg shadow-xl'>
					<table className='table table-zebra w-full'>
						<thead>
							<tr className='bg-primary text-primary-content'>
								<th className='text-lg'>Rank</th>
								<th className='text-lg'>Player</th>
								<th className='text-lg text-center'>Avg. correct answers %</th>
								<th className='text-lg text-center'>Quizzes played</th>
								<th className='text-lg text-center'>Avg. score</th>
							</tr>
						</thead>
						<tbody>
							{leaderboard.map((player) => (
								<tr key={player.userId} className='hover'>
									<td className='font-bold'>
										<div className='flex items-center gap-2'>
											{player.rank <= 3 ? (
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center ${getMedalColor(
														player.rank
													)} text-white font-bold`}
												>
													{player.rank}
												</div>
											) : (
												<div className='w-8 text-center'>{player.rank}</div>
											)}
										</div>
									</td>
									<td className='font-semibold'>{player.nickname}</td>
									<td className='text-center'>
										<span className='text-sm text-gray-500 ml-1'>
											({player.stats.averageCorrectAnswersPercentage.toFixed(1)}
											%)
										</span>
									</td>
									<td className='text-center'>{player.stats.totalQuizzes}</td>
									<td className='text-center'>
										{player.stats.averageScore.toFixed(1)} pts
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className='md:hidden space-y-4'>
					{leaderboard.map((player) => (
						<div key={player.userId} className='card bg-base-100 shadow-xl'>
							<div className='card-body p-4'>
								<div className='flex items-center gap-3 mb-2'>
									{player.rank <= 3 ? (
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center ${getMedalColor(
												player.rank
											)} text-white font-bold`}
										>
											{player.rank}
										</div>
									) : (
										<div className='w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-bold'>
											{player.rank}
										</div>
									)}
									<h2 className='card-title flex-1'>{player.nickname}</h2>
								</div>
								<div className='grid grid-cols-2 gap-2 text-sm'>
									<div className='flex flex-col'>
										<span className='text-gray-500'>Completed Quizzes</span>
										<span className='font-semibold'>
											{player.stats.totalQuizzes}
										</span>
									</div>
									<div className='flex flex-col'>
										<span className='text-gray-500'>Average Score</span>
										<span className='font-semibold'>
											{player.stats.averageScore.toFixed(1)} pts
										</span>
									</div>
									<div className='flex flex-col col-span-2'>
										<span className='text-gray-500'>Correct Answers</span>
										<span className='font-semibold'>
											{player.stats.totalCorrectAnswers}
											<span className='text-sm text-gray-500 ml-1'>
												(
												{player.stats.averageCorrectAnswersPercentage.toFixed(
													1
												)}
												%)
											</span>
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className='mt-8 p-6 bg-base-100 rounded-lg shadow-lg'>
					<h2 className='text-xl font-bold mb-4'>Ranking Criteria</h2>
					<p className='text-base-content/80 mb-4'>
						Players are ranked based on the following criteria (in order of
						importance):
					</p>
					<ol className='list-decimal list-inside space-y-2 text-base-content/70'>
						<li className='flex items-center gap-2'>
							<span className='font-semibold'>
								Average Correct Answers Percentage
							</span>
							<span className='text-sm'>(higher percentage ranks better)</span>
						</li>
						<li className='flex items-center gap-2'>
							<span className='font-semibold'>Total Correct Answers</span>
							<span className='text-sm'>
								(more correct answers ranks better)
							</span>
						</li>
						<li className='flex items-center gap-2'>
							<span className='font-semibold'>Average Score</span>
							<span className='text-sm'>
								(higher average score ranks better)
							</span>
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
