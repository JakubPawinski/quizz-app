'use client';
import { useState, useEffect } from 'react';
import SingleChoiceQuestion from './create/SingleChoiceQuestion';
import MultipleChoiceQuestion from './create/MultipleChoiceQuestion';
import OpenQuestion from './create/OpenQuestion';
import FillInTheBlankQuestion from './create/FillInTheBlankQuestion';

export default function QuestionManager({ question }) {
	const [selectedType, setSelectedType] = useState('Single choice');

	const handleTypeChange = (type) => {
		setSelectedType(type);
		console.log('Selected type:', type);
	};
	useEffect(() => {
		setSelectedType(question.type);
		return () => {};
	}, [question]);

	return (
		<div className='card bg-base-200 mx-auto w-full p-4'>
			<div className='flex flex-wrap gap-4 '>
				<div className='question-types flex flex-col sm:flex-row gap-4 w-full justify-center'>
					{[
						{ value: 'Single choice', label: 'Single choice' },
						{ value: 'Multiple choice', label: 'Multiple choice' },
						{ value: 'Open question', label: 'Open question' },
						{ value: 'Fill in the blank', label: 'Fill in the blank' },
					].map((type) => (
						<label
							key={type.value}
							className={`
				  flex items-center gap-2 p-3 rounded-lg cursor-pointer
				  transition-all duration-200 
				  ${selectedType === type.value ? 'bg-primary/20' : ''}
				`}
						>
							<input
								type='radio'
								name='questionType'
								value={type.value}
								checked={selectedType === type.value}
								onChange={() => handleTypeChange(type.value)}
								className='radio radio-primary'
							/>
							<span className='font-medium'>{type.label}</span>
						</label>
					))}
				</div>
			</div>
			{selectedType === 'Single choice' && <SingleChoiceQuestion />}
			{selectedType === 'Multiple choice' && <MultipleChoiceQuestion />}
			{selectedType === 'Open question' && <OpenQuestion />}
			{selectedType === 'Fill in the blank' && <FillInTheBlankQuestion />}
		</div>
	);
}
