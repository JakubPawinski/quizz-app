'use client';
import { useEffect, useState } from 'react';

const ICONS = {
	info: (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
			/>
		</svg>
	),
	success: (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
			/>
		</svg>
	),
	warning: (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
			/>
		</svg>
	),
	error: (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
			/>
		</svg>
	),
};

export default function Notification({ message, type = 'info' }) {
	const [isVisible, setIsVisible] = useState(true);
	const [isFading, setIsFading] = useState(false);

	useEffect(() => {
		// console.log('Notification mounted');
		// console.log('Message:', message);
		// console.log('Type:', type);
		const fadeTimeout = setTimeout(() => setIsFading(true), 5000);
		const hideTimeout = setTimeout(() => setIsVisible(false), 6000);

		return () => {
			clearTimeout(fadeTimeout);
			clearTimeout(hideTimeout);
		};
	}, []);

	if (!isVisible) return null;

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 transform transition-all duration-1000 
      ${isFading ? 'opacity-0' : 'opacity-100'}`}
		>
			<div
				className={`bg-${type} text-${type}-content px-6 py-4 rounded-lg shadow-lg 
        flex items-center space-x-2 min-w-[300px]`}
			>
				{ICONS[type]}
				<p className='font-medium'>{message}</p>
			</div>
		</div>
	);
}
