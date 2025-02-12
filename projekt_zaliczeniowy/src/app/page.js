'use client';

import { useUser } from '@/providers/AuthProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	const { user } = useUser();
	const handleGetStarted = () => {
		console.log('Get Started');
		if (user) router.push('/quizzes');
		else {
			router.push('/auth/login');
		}
	};
	return (
		<div className='flex flex-col items-center justify-center bg-base-100 text-base-content min-h-[50vh] p-4'>
			<h1 className='text-4xl font-bold mb-4 text-center'>
				Welcome to the Quiz <span className='text-primary'>App!</span>
			</h1>
			<p className='text-lg mb-8 text-center'>
				Start your journey with quizzes and test your knowledge on various
				topics.
			</p>
			<button
				onClick={handleGetStarted}
				className='btn btn-primary text-primary-content'
			>
				Get Started
			</button>
		</div>
	);
}
