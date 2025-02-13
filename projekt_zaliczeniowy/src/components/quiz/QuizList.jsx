'use client';
import QuizCard from './QuizCard';
import { useState, useLayoutEffect, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ANCHOR_MOBILE = 440;

export default function QuizList({ quizzes }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [windowWidth, setWindowWidth] = useState(0);

	const [searchTerm, setSearchTerm] = useState(
		searchParams.get('search') || ''
	);
	const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
	const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes);

	// Update search term and sort by when query params change
	useEffect(() => {
		const currentSearchTerm = searchParams.get('search') || '';
		const currentSortBy = searchParams.get('sort') || 'name';

		setSearchTerm(currentSearchTerm);
		setSortBy(currentSortBy);
	}, [searchParams]);

	// Update query params when search term or sort by changes
	const updateQueryParams = (search, sort) => {
		const params = new URLSearchParams(searchParams.toString());
		if (search) {
			params.set('search', search);
		} else {
			params.delete('search');
		}
		if (sort) {
			params.set('sort', sort);
		} else {
			params.delete('sort');
		}
		router.push(`?${params.toString()}`, { scroll: false });
	};

	// Handle search and sort change
	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		updateQueryParams(value, sortBy);
	};
	const handleSortChange = (e) => {
		const value = e.target.value;
		setSortBy(value);
		updateQueryParams(searchTerm, value);
	};

	// Update window width on resize
	useLayoutEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Filter and sort quizzes
	useEffect(() => {
		const filtered = quizzes
			.filter(
				(quiz) =>
					quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					quiz.category.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => {
				switch (sortBy) {
					case 'name':
						return a.name.localeCompare(b.name);
					case 'difficulty':
						const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
						return (
							difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
						);
					case 'popularity':
						return b.popularity - a.popularity;
					case 'category':
						return a.category.name.localeCompare(b.category.name);
					default:
						return 0;
				}
			});
		setFilteredQuizzes(filtered);
	}, [quizzes, searchTerm, sortBy]);

	// Check if mobile
	const isMobile = windowWidth < ANCHOR_MOBILE;

	return (
		<div className='flex flex-wrap justify-center'>
			<div className='w-full max-w-7xl flex flex-col sm:flex-row gap-4 justify-between items-center mb-4'>
				<div className='form-control w-full sm:w-64'>
					<input
						type='text'
						placeholder='Search quizzes'
						className='input input-bordered w-full'
						value={searchTerm}
						onChange={handleSearchChange}
					/>
				</div>
				<div className='form-control w-full sm:w-64'>
					<select
						className='select select-bordered w-full'
						value={sortBy}
						onChange={handleSortChange}
					>
						<option value='name'>Sort by name</option>
						<option value='difficulty'>Sort by difficulty</option>
						<option value='popularity'>Sort by popularity</option>
						<option value='category'>Sort by category</option>
					</select>
				</div>
			</div>
			<div
				className={`w-full ${
					isMobile
						? 'flex flex-col gap-4 justify-center items-center'
						: 'grid lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto place-items-center justify-items-center'
				}`}
			>
				{filteredQuizzes.length === 0 && (
					<div className='col-span-full flex flex-col items-center justify-center p-8 bg-base-200 rounded-lg shadow-lg w-full max-w-md mx-auto mt-8'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-16 w-16 text-primary mb-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<h3 className='text-xl font-bold text-base-content mb-2'>
							No Results Found
						</h3>
						<p className='text-base-content/70 text-center'>
							No quizzes match your search criteria. Try adjusting your search
							terms.
						</p>
					</div>
				)}
				{filteredQuizzes.map((quiz) => (
					<QuizCard key={quiz._id} quiz={quiz} />
				))}
			</div>
		</div>
	);
}
