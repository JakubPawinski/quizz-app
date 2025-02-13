'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { APP_ROUTES, ENDPOINTS } from '@/config';
import Link from 'next/link';
import { useChart } from '@/hooks/useChart';
import Stat from '@/components/admin/Stat';
import { useLoading } from '@/providers/LoadingProvider';
import AddQuizCategory from '@/components/admin/AddQuizCategory';
import ManageCategories from '@/components/admin/ManageCategories';

export default function AdminPage() {
	const [stats, setStats] = useState({});
	const { setIsLoading } = useLoading();

	//Function to generate colors
	const generateColors = useCallback((count) => {
		const colors = [];
		for (let i = 0; i < count; i++) {
			const hue = (i * 137.508) % 360;
			colors.push(`hsla(${hue}, 70%, 60%, 0.2)`);
		}
		return colors;
	}, []);
	//Function to generate border colors
	const generateBorderColors = useCallback((count) => {
		const colors = [];
		for (let i = 0; i < count; i++) {
			const hue = (i * 137.508) % 360;
			colors.push(`hsla(${hue}, 70%, 60%, 1)`);
		}
		return colors;
	}, []);

	//Function to format user data
	const formatUserData = useCallback((data) => {
		// Generate last 7 days
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		}).reverse();
		const result = Array(7).fill(0);

		// Function to format date (YYYY-MM-DD)
		const formatDate = (date) => date.toISOString().split('T')[0];

		// Fill in the data
		data.forEach((item) => {
			const index = last7Days.findIndex(
				(date) => formatDate(date) === item.date
			);
			if (index !== -1) {
				result[index] = item.count;
			}
		});

		const labels = last7Days.map(formatDate);

		return { data: result, labels };
	}, []);

	//Function to format decimal value
	const formatDecimalValue = useCallback((value) => {
		return typeof value === 'number' ? Math.round(value * 100) / 100 : 'N/A';
	}, []);

	//UseEffect to fetch statistics
	useEffect(() => {
		const fetchStats = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${ENDPOINTS.USER}/service/stats`, {
					withCredentials: true,
				});
				// console.log(response.data.data);
				setStats(response.data.data);
			} catch (error) {
				console.error('Error fetching stats:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchStats();
	}, []);

	//Aggregated statistics data
	const aggregatedStatistics = useMemo(() => {
		return [
			{
				label: 'Total Users',
				value: stats.totalUsers,
			},
			{
				label: 'Total Quizzes',
				value: stats.totalQuizzes,
			},
			{
				label: 'Total Questions',
				value: stats.totalQuestions,
			},
			{
				label: 'Average Comments per Quiz',
				value: formatDecimalValue(stats.averageCommentsPerQuiz),
			},
			{
				label: 'Average Quizzes per User',
				value: formatDecimalValue(stats.averageQuizzesPerUser),
			},
			{
				label: 'Average Quiz Score',
				value: `${formatDecimalValue(stats.averageQuizScore)} pts`,
			},
			{
				label: 'Most Popular Achievement',
				value: stats.mostCommonAchievement || 'N/A',
			},
			{
				label: 'Most Popular Category',
				value: stats.mostPopularCategory || 'N/A',
			},
		];
	}, [stats]);

	//Format user data
	const formattedUserData = formatUserData(
		stats.usersCreatedLastWeekFormatted || []
	);

	//Charts data configuration
	const charts = useMemo(() => {
		return {
			barChart: {
				type: 'bar',
				data: {
					labels: ['Users', 'Quizzes', 'Questions'],
					datasets: [
						{
							label: 'Total',
							data: [
								stats.totalUsers,
								stats.totalQuizzes,
								stats.totalQuestions,
							],
							backgroundColor: generateColors(stats.categoryStats?.length || 0),
							borderColor: generateBorderColors(
								stats.categoryStats?.length || 0
							),
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			},
			pieChartCategories: {
				type: 'pie',
				data: {
					labels: stats.categoryStats?.map((category) => category.name) || [],
					datasets: [
						{
							data:
								stats.categoryStats?.map((category) => category.count) || [],
							backgroundColor: generateColors(stats.categoryStats?.length || 0),
							borderColor: generateBorderColors(
								stats.categoryStats?.length || 0
							),
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'bottom',
						},
						title: {
							display: true,
							text: 'Quiz Categories Distribution',
						},
						tooltip: {
							callbacks: {
								label: function (context) {
									const label = context.label || '';
									const value = context.raw || 0;
									const total = context.dataset.data.reduce(
										(acc, current) => acc + current,
										0
									);
									const percentage = Math.round((value / total) * 100);
									return `${label}: ${value} (${percentage}%)`;
								},
							},
						},
					},
				},
			},
			pieChartQuestionTypes: {
				type: 'pie',
				data: {
					labels: stats.questionsPerType?.map((type) => type.type) || [],
					datasets: [
						{
							data: stats.questionsPerType?.map((type) => type.count) || [],
							backgroundColor: generateColors(
								stats.questionsPerType?.length || 0
							),
							borderColor: generateBorderColors(
								stats.questionsPerType?.length || 0
							),
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'bottom',
						},
						title: {
							display: true,
							text: 'Quiz Categories Distribution',
						},
						tooltip: {
							callbacks: {
								label: function (context) {
									const label = context.label || '';
									const value = context.raw || 0;
									const total = context.dataset.data.reduce(
										(acc, current) => acc + current,
										0
									);
									const percentage = Math.round((value / total) * 100);
									return `${label}: ${value} (${percentage}%)`;
								},
							},
						},
					},
				},
			},
			lineChart: {
				type: 'line',
				data: {
					labels: formattedUserData.labels,
					datasets: [
						{
							label: 'New Users',
							data: formattedUserData.data,
							fill: true,
							borderColor: generateBorderColors(1)[0],
							backgroundColor: generateColors(1)[0],
							tension: 0.1,
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			},
		};
	}, [stats]);


	//Chart refs
	const barChartRef = useChart(charts.barChart, [stats]);
	const pieChartCategoriesRef = useChart(charts.pieChartCategories, [stats]);
	const lineChartRef = useChart(charts.lineChart, [stats]);
	const pieChartQuestionTypesRef = useChart(charts.pieChartQuestionTypes, [
		stats,
	]);

	return (
		<div className='admin-page w-full p-4 bg-base-100 min-h-screen'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold mb-8 text-primary'>
					Admin Dashboard
				</h1>
				<p className='mb-8 text-base-content'>
					Welcome to the admin dashboard. Here you can manage users, quizzes,
					and view statistics.
				</p>

				<div className='divider divider-accent text-xl'>Navigation</div>

				<div className='flex flex-wrap gap-6 mb-12 justify-center'>
					<Link
						href={`${APP_ROUTES.ADMIN.USERS}`}
						className='btn btn-primary btn-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1'
					>
						Manage Users
					</Link>
					<Link
						href={`${APP_ROUTES.ADMIN.QUIZZES}`}
						className='btn btn-secondary btn-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1'
					>
						Manage Quizzes
					</Link>
				</div>

				<div className='divider divider-accent text-xl'>General statistics</div>
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12'>
					{aggregatedStatistics.map((stat, index) => (
						<Stat key={index} stat={stat} />
					))}
				</div>

				<div className='divider divider-accent text-xl'>Charts</div>
				<div className='charts grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<div className='card bg-base-200 shadow-xl p-6 hover:shadow-2xl'>
						<h2 className='card-title text-primary mb-4'>
							Statistics Overview
						</h2>
						<div className='relative h-[400px] w-full flex items-center justify-center'>
							<canvas ref={barChartRef} className='max-w-full max-h-full' />
						</div>
						<p className='mb-4 text-base-content'>
							This bar chart visualizes the total count of users, quizzes, and
							questions within the platform.
						</p>
					</div>
					<div className='card bg-base-200 shadow-xl p-6 hover:shadow-2xl'>
						<h2 className='card-title text-primary mb-4'>
							Most popular categories
						</h2>
						<div className='relative h-[400px] w-full flex items-center justify-center'>
							<canvas
								ref={pieChartCategoriesRef}
								className='max-w-full max-h-full'
							/>
						</div>
						<p className='mb-4 text-base-content'>
							This pie chart shows the distribution of the most popular
							categories among users.
						</p>
					</div>
					<div className='card bg-base-200 shadow-xl p-6 hover:shadow-2xl'>
						<h2 className='card-title text-primary mb-4'>
							New User Accounts (Last 7 days)
						</h2>
						<div className='relative h-[400px] w-full flex items-center justify-center'>
							<canvas ref={lineChartRef} className='max-w-full max-h-full' />
						</div>
						<p className='mb-4 text-base-content'>
							This graph shows the weekly trend of user registrations,
							highlighting the number of new accounts created each day over the
							past week.
						</p>
					</div>
					<div className='card bg-base-200 shadow-xl p-6 hover:shadow-2xl'>
						<h2 className='card-title text-primary mb-4'>
							Question Type Distribution
						</h2>
						<div className='relative h-[400px] w-full flex items-center justify-center'>
							<canvas
								ref={pieChartQuestionTypesRef}
								className='max-w-full max-h-full'
							/>
						</div>
						<p className='mb-4 text-base-content'>
							This chart shows the distribution of question types.
						</p>
					</div>
				</div>

				<div className='divider divider-accent text-xl'>Actions</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<AddQuizCategory />
					<ManageCategories />
				</div>
			</div>
		</div>
	);
}
