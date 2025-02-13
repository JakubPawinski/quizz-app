'use client';
import { useState, useEffect } from 'react';
import SingleChoiceQuestion from './create/SingleChoiceQuestion';
import MultipleChoiceQuestion from './create/MultipleChoiceQuestion';
import OpenQuestion from './create/OpenQuestion';
import FillInTheBlankQuestion from './create/FillInTheBlankQuestion';
import axios from 'axios';
import { ENDPOINTS } from '@/config';
import { useNotification } from '@/providers/NotificationProvider';

export default function QuestionManager({ question, quizId }) {
	const [selectedType, setSelectedType] = useState(question?.type || '');
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	//Context
	const { showNotification } = useNotification();

	//UseEffect to check if the question is a placeholder
	useEffect(() => {
		if (question.placeholder) {
			setIsDetailsOpen(true);
		}
	}, []);

	//Function to handle the change of the question type
	const handleTypeChange = (type) => {
		setSelectedType(type);
		// console.log('Selected type:', type);
	};

	//UseEffect to check if the question type is selected
	useEffect(() => {
		if (question && question.type) {
			// console.log('Selected type:', question.type);
			setSelectedType(question.type);
		}
	}, [question]);

	//Function to handle the submit of the question
	const handleSubmit = async (values) => {
		console.log('Handle submit');
		// console.log(values);
		// console.log('quizId:', quizId);

		try {
			// console.log(question.placeholder);
			if (question.placeholder) {
				// console.log('Create question:', values);
				const response = await axios.post(
					`${ENDPOINTS.QUIZ}/${quizId}/questions`,
					values,
					{
						withCredentials: true,
					}
				);
				// console.log('response:', response);
				showNotification('Question created successfully', 'success');
			} else {
				// console.log('Update question:', question._id);
				const response = await axios.patch(
					`${ENDPOINTS.QUIZ}/${quizId}/questions/${question._id}`,
					values,
					{
						withCredentials: true,
					}
				);
				// console.log('response:', response);
				showNotification('Question updated successfully', 'success');
			}
		} catch (error) {
			console.log(error);
			showNotification(error.response.data.message, 'error');
		} finally {
			dispatchEvent(new Event('refreshQuiz'));
			setIsDetailsOpen(false);
		}
	};
	const handleDeleteQuestion = async () => {
		// console.log('Delete question:', question._id);
		if (question.placeholder) {
			dispatchEvent(new Event('refreshQuiz'));
			return;
		}

		try {
			const response = await axios.delete(
				`${ENDPOINTS.QUIZ}/${quizId}/questions/${question._id}`,
				{
					withCredentials: true,
				}
			);
			// console.log('response:', response);
			showNotification('Question deleted successfully', 'success');
		} catch (error) {
			console.error(error);
			showNotification(error.response.data.message, 'error');
		} finally {
			// console.log('dispatchEvent');
			dispatchEvent(new Event('refreshQuiz'));
		}
	};

	return (
		<div className='card bg-base-200 mx-auto w-full p-4'>
			{!isDetailsOpen && (
				<div className='card bg-base-200 mx-auto w-full p-6 '>
					<div className='flex justify-between items-center gap-4'>
						<div className='flex-1 space-y-4'>
							<div className='text-lg font-medium text-base-content'>
								{question.content}
							</div>
							<div className='flex gap-6'>
								<div className='flex items-center gap-2'>
									<p className='text-secondary font-semibold'>Type:</p>
									<span className='text-base-content'>{question.type}</span>
								</div>
								<div className='flex items-center gap-2'>
									<p className='text-secondary font-semibold'>Time:</p>
									<span className='text-base-content'>
										{question.timeLimit}s
									</span>
								</div>
							</div>
						</div>

						<div className='flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto'>
							<button
								onClick={() => setIsDetailsOpen(true)}
								className='btn btn-primary btn-sm w-full sm:w-auto'
							>
								Edit
							</button>
							<button
								onClick={handleDeleteQuestion}
								className='btn btn-error btn-sm btn-outline w-full sm:w-auto'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{isDetailsOpen && (
				<div className='card bg-base-200 mx-auto w-full p-4'>
					<div className='flex flex-wrap gap-4 '>
						<div className='flex flex-col sm:flex-row gap-4'>
							{[
								'Single Choice',
								'Multiple Choice',
								'Open',
								'Fill in the Blank',
							].map((type) => (
								<label
									key={type}
									className={`
      flex items-center gap-2 p-3 rounded-lg cursor-pointer
      ${selectedType === type ? 'bg-primary/20' : 'bg-base-200'}
    `}
								>
									<input
										type='radio'
										name='questionType'
										value={type}
										checked={selectedType === type}
										onChange={() => handleTypeChange(type)}
										className='radio radio-primary'
									/>
									<span>{type}</span>
								</label>
							))}
						</div>
					</div>
					{selectedType === 'Single Choice' && (
						<SingleChoiceQuestion
							onSubmit={handleSubmit}
							defaultValues={question}
						/>
					)}
					{selectedType === 'Multiple Choice' && (
						<MultipleChoiceQuestion
							onSubmit={handleSubmit}
							defaultValues={question}
						/>
					)}
					{selectedType === 'Open' && (
						<OpenQuestion onSubmit={handleSubmit} defaultValues={question} />
					)}
					{selectedType === 'Fill in the Blank' && (
						<FillInTheBlankQuestion
							onSubmit={handleSubmit}
							defaultValues={question}
						/>
					)}
				</div>
			)}
		</div>
	);
}
