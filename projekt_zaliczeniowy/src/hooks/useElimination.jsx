import { useState } from 'react';

export default function useElimination() {
	const [eliminatedAnswers, setEliminatedAnswers] = useState([]);

	const handleEliminateOne = (answers) => {
		const wrongOptions = answers.filter(
			(option) => !option.isCorrect && !eliminatedAnswers.includes(option)
		);
		if (wrongOptions.length === 0) return;
		const toEliminate =
			wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
		setEliminatedAnswers([...eliminatedAnswers, toEliminate]);
	};

	const resetElimination = () => {
		setEliminatedAnswers([]);
	};

	return { eliminatedAnswers, handleEliminateOne, resetElimination };
}
