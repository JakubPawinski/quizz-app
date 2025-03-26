import { useState, useEffect } from 'react';

export default function TimeCounter({ time, onTimeEnd, isActive }) {
	const [timeLeft, setTimeLeft] = useState(time);

	// Reset time when time prop changes
	useEffect(() => {
		setTimeLeft(time);
	}, [time]);

	// Start countdown
	useEffect(() => {
		let timer;
		if (isActive && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [timeLeft, isActive]);

	// Check if time is up
	useEffect(() => {
		if (timeLeft <= 0 && isActive) {
			onTimeEnd?.();
		}
	}, [timeLeft, onTimeEnd, isActive]);

	return (
		<div className='flex items-center justify-center'>
			<span className='countdown font-mono text-4xl'>
				<span style={{ '--value': Math.max(0, timeLeft) }}></span>
			</span>
		</div>
	);
}
