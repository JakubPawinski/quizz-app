import { useState, useEffect } from 'react';

export default function TimeCounter({ time, onTimeEnd, isActive }) {
	const [timeLeft, setTimeLeft] = useState(time);

	useEffect(() => {
		setTimeLeft(time);
	}, [time]);

	useEffect(() => {
		let timer;
		if (isActive && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [timeLeft, isActive]);

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
