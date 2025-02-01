'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import axios from 'axios';
import { ENDPOINTS } from '@/utils/config';
import { useLayoutEffect, useState } from 'react';

export default function Navbar() {
	const [windowWidth, setWindowWidth] = useState(0);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { user, setUser } = useAuth();

	useLayoutEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		handleResize(); // inicjalne ustawienie
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const isMobile = windowWidth < 770;

	const handleLogout = async () => {
		try {
			await axios.post(`${ENDPOINTS.AUTH}/logout`, null, {
				withCredentials: true,
			});
			setUser(null);
			console.log('User logged out');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<nav className='navbar bg-neutral'>
				<div className='flex-1 navbar-start'>
					<Link
						className='btn btn-ghost text-xl text-neutral-content'
						href={'/'}
					>
						<div>
							<span className='m-0 '>Quizz</span>
							<span className='m-0 text-primary'>App</span>
						</div>
					</Link>
				</div>

				<div className='navbar-end'>
					{isMobile ? (
						<button
							onClick={() => setIsDrawerOpen(!isDrawerOpen)}
							className='btn btn-square btn-ghost btn-lg'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className=' text-primary w-8 h-8'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						</button>
					) : (
						<>
							{user ? (
								<div className='flex items-center space-x-4'>
									<Link href='/quizzes' className='btn btn-outline btn-primary'>
										Quizzes
									</Link>
									<Link href='/profile' className='btn btn-outline btn-primary'>
										Profile
									</Link>
									<button
										onClick={handleLogout}
										className='btn btn-primary text-primary-content'
									>
										Logout
									</button>
								</div>
							) : (
								<div className='flex items-center space-x-4'>
									<Link
										href='/auth/login'
										className='btn btn-ghost text-neutral-content'
									>
										Login
									</Link>
									<Link
										href='/auth/register'
										className='btn btn-primary text-primary-content'
									>
										Register
									</Link>
								</div>
							)}
						</>
					)}
				</div>
			</nav>
			<div
				className={`fixed top-0 right-0 h-full w-64 bg-base-200 p-4 transform transition-transform duration-300 ease-in-out z-50 ${
					isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<button
					onClick={() => setIsDrawerOpen(false)}
					className='btn btn-ghost btn-circle absolute top-4 right-4 text-red-500'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-10 w-10 text-red-500'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
				<div className='mt-16 flex flex-col space-y-4'>
					{user ? (
						<>
							<Link
								href='/quizzes'
								className='btn btn-outline btn-primary w-full'
								onClick={() => setIsDrawerOpen(false)}
							>
								Quizzes
							</Link>
							<Link
								href='/profile'
								className='btn btn-outline btn-primary w-full'
								onClick={() => setIsDrawerOpen(false)}
							>
								Profile
							</Link>
							<button
								onClick={() => {
									handleLogout();
									setIsDrawerOpen(false);
								}}
								className='btn btn-primary w-full'
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href='/auth/login'
								className='btn btn-outline btn-primary w-full'
								onClick={() => setIsDrawerOpen(false)}
							>
								Login
							</Link>
							<Link
								href='/auth/register'
								className='btn btn-primary w-full'
								onClick={() => setIsDrawerOpen(false)}
							>
								Register
							</Link>
						</>
					)}
				</div>
			</div>
			{isDrawerOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={() => setIsDrawerOpen(false)}
				/>
			)}
		</>
	);
}
