'use client';
import { useEffect, useState, useReducer, useMemo } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import axios from 'axios';
import TimeCounter from './TimeCounter';
import { ENDPOINTS } from '@/config';
import { useUser } from '@/providers/AuthProvider';

import SingleChoiceGame from './questionTypes/SingleChoiceGame';
import MultipleChoiceGame from './questionTypes/MultipleChoiceGame';
import OpenQuestionGame from './questionTypes/OpenQuestionGame';
import FillInTheBlankGame from './questionTypes/FillInTheBlankGame';
import Hints from './questionTypes/Hints';

const START_TIME = 3;

const MOVE_TO_NEXT_QUESTION_DELAY = 1000;
const MOVE_TO_NEXT_QUESTION_DELAY_ON_ANSWER = 2000;

const ACTIONS = {
	SET_QUESTIONS: 'set_questions',
	SET_GAME_ACTIVE: 'set_game_active',
	SET_CURRENT_QUESTION: 'set_current_question',
	SET_TIMER_ACTIVE: 'set_timer_active',
	SET_TIME_LIMIT: 'set_time_limit',
	SET_FINISHED: 'set_finished',
	SET_ANSWERS: 'set_answers',
	SET_STATISTICS: 'set_statistics',
	SET_SHOWING_ANSWER: 'set_showing_answer',
};
const initialState = {
	questions: [],
	isGameActive: false,
	currentQuestionIndex: 0,
	timeLimit: 10,
	isTimerActive: false,
	isFinished: false,
	answers: {},
	statistics: null,
	showingAnswer: false,
};
function quizReducer(state, action) {
	switch (action.type) {
		case ACTIONS.SET_QUESTIONS:
			return { ...state, questions: action.payload };
		case ACTIONS.SET_GAME_ACTIVE:
			return { ...state, isGameActive: action.payload };
		case ACTIONS.SET_CURRENT_QUESTION:
			return { ...state, currentQuestionIndex: action.payload };
		case ACTIONS.SET_TIMER_ACTIVE:
			return { ...state, isTimerActive: action.payload };
		case ACTIONS.SET_TIME_LIMIT:
			return { ...state, timeLimit: action.payload };
		case ACTIONS.SET_FINISHED:
			return { ...state, isFinished: action.payload };
		case ACTIONS.SET_ANSWERS:
			return { ...state, answers: action.payload };
		case ACTIONS.SET_STATISTICS:
			return { ...state, statistics: action.payload };
		case ACTIONS.SET_SHOWING_ANSWER:
			return { ...state, showingAnswer: action.payload };
		default:
			return state;
	}
}

const shuffleArray = (array) => _.shuffle(array);

export default function QuizGame({ quiz, onFinish }) {
	const [state, dispatch] = useReducer(quizReducer, initialState);

	// Context
	const { user } = useUser();

	// Current question
	const currentQuestion = useMemo(
		() => state.questions[state.currentQuestionIndex],
		[state.questions, state.currentQuestionIndex]
	);

	// Question type
	const questionType = useMemo(() => {
		if (!currentQuestion) return '';
		const types = {
			'Single Choice': 'Single choice',
			'Multiple Choice': 'Multiple choice',
			Open: 'Open question',
			'Fill in the Blank': 'Fill in the Blank',
		};
		return types[currentQuestion.type] || '';
	}, [currentQuestion]);

	// Shuffle questions
	useEffect(() => {
		const shuffledQuestions = shuffleArray([...quiz.questions]);
		dispatch({ type: ACTIONS.SET_QUESTIONS, payload: shuffledQuestions });
	}, [quiz]);

	// UseEffect to start timer
	useEffect(() => {
		if (state.questions.length > 0 && state.isGameActive && !state.isFinished) {
			dispatch({
				type: ACTIONS.SET_TIME_LIMIT,
				payload: currentQuestion?.timeLimit || 10,
			});
			dispatch({ type: ACTIONS.SET_TIMER_ACTIVE, payload: true });
		}
	}, [
		state.currentQuestionIndex,
		state.questions,
		state.isGameActive,
		state.isFinished,
		currentQuestion,
	]);

	// Function to handle time end
	const handleTimeEnd = () => {
		dispatch({ type: ACTIONS.SET_TIMER_ACTIVE, payload: false });
		// console.log('Time out');
		const newAnswers = {
			...state.answers,
			[currentQuestion._id]: 'Time out',
		};
		dispatch({
			type: ACTIONS.SET_ANSWERS,
			payload: newAnswers,
		});

		// Handle quiz completion
		if (state.currentQuestionIndex >= state.questions.length - 1) {
			dispatch({ type: ACTIONS.SET_FINISHED, payload: true });
			handleQuizComplete(newAnswers);
			return;
		}

		// Move to next question
		setTimeout(() => {
			dispatch({
				type: ACTIONS.SET_CURRENT_QUESTION,
				payload: state.currentQuestionIndex + 1,
			});
		}, MOVE_TO_NEXT_QUESTION_DELAY);
	};

	// Function to download results exported as JSON
	const handleDownloadResults = () => {
		if (!state.statistics) return;

		const results = {
			quizName: quiz.name,
			timestamp: state.statistics.timestamp,
			score: state.statistics.score,
			correctAnswersCount: state.statistics.correctAnswersCount,
			correctAnswersPercentage: state.statistics.correctAnswersPercentage,
			totalQuestions: state.questions.length,
		};

		const blob = new Blob([JSON.stringify(results, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// Function to handle answer
	const handleAnswer = (answer) => {
		dispatch({ type: ACTIONS.SET_TIMER_ACTIVE, payload: false });
		dispatch({ type: ACTIONS.SET_SHOWING_ANSWER, payload: true });
		const newAnswers = {
			...state.answers,
			[currentQuestion._id]: answer,
		};

		dispatch({ type: ACTIONS.SET_ANSWERS, payload: newAnswers });
		// console.log('Answers after update:', newAnswers);

		setTimeout(() => {
			dispatch({ type: ACTIONS.SET_SHOWING_ANSWER, payload: false });

			if (state.currentQuestionIndex >= state.questions.length - 1) {
				const finalAnswers = {
					...newAnswers,
					[currentQuestion._id]: answer,
				};
				dispatch({ type: ACTIONS.SET_ANSWERS, payload: finalAnswers });
				dispatch({ type: ACTIONS.SET_FINISHED, payload: true });
				handleQuizComplete(finalAnswers);
			} else {
				dispatch({
					type: ACTIONS.SET_CURRENT_QUESTION,
					payload: state.currentQuestionIndex + 1,
				});
				dispatch({ type: ACTIONS.SET_TIMER_ACTIVE, payload: true });
			}
		}, MOVE_TO_NEXT_QUESTION_DELAY_ON_ANSWER);
	};

	// Function to handle quiz completion
	const handleQuizComplete = async (finalAnswers) => {
		console.log('Final answers:', finalAnswers);
		const formattedAnswers = {
			quizId: quiz._id,
			answers: Object.keys(finalAnswers).map((questionId) => {
				const answer = finalAnswers[questionId];
				if (Array.isArray(answer)) {
					return {
						questionId,
						answers: answer.map((ans) =>
							typeof ans === 'string' ? ans : ans.content
						),
					};
				}
				if (typeof answer === 'object') {
					return {
						questionId,
						answers: [answer.content],
					};
				}
				return {
					questionId,
					answers: [answer],
				};
			}),
		};
		// console.log('Formatted answers:', formattedAnswers);
		try {
			const response = await axios.post(
				`${ENDPOINTS.USER}/${user._id}/stats`,
				formattedAnswers,
				{
					withCredentials: true,
				}
			);
			dispatch({ type: ACTIONS.SET_STATISTICS, payload: response.data.data });
			onFinish();
			console.log('Quiz completed:', response.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// Function to render question
	const renderQuestion = () => {
		if (!currentQuestion) return null;

		return (
			<div className='w-full question-box'>
				{questionType === 'Single choice' && (
					<SingleChoiceGame
						question={currentQuestion}
						onTimeEnd={handleTimeEnd}
						onAnswer={handleAnswer}
						showingAnswer={state.showingAnswer}
					/>
				)}
				{questionType === 'Multiple choice' && (
					<MultipleChoiceGame
						question={currentQuestion}
						onTimeEnd={handleTimeEnd}
						onAnswer={handleAnswer}
						showingAnswer={state.showingAnswer}
					/>
				)}
				{questionType === 'Open question' && (
					<OpenQuestionGame
						question={currentQuestion}
						onTimeEnd={handleTimeEnd}
						onAnswer={handleAnswer}
						showingAnswer={state.showingAnswer}
					/>
				)}
				{questionType === 'Fill in the Blank' && (
					<FillInTheBlankGame
						question={currentQuestion}
						onTimeEnd={handleTimeEnd}
						onAnswer={handleAnswer}
						showingAnswer={state.showingAnswer}
					/>
				)}
				<Hints question={currentQuestion} showingAnswer={state.showingAnswer} />
			</div>
		);
	};

	// If quiz is finished
	if (state.isFinished) {
		return (
			<div className='text-center p-8'>
				<h2 className='text-2xl font-bold text-primary mb-4'>
					Quiz Completed!
				</h2>

				{state.statistics ? (
					<div className='stats stats-vertical lg:stats-horizontal shadow bg-base-200'>
						<div className='stat'>
							<div className='stat-title'>Correct Answers</div>
							<div className='stat-value text-primary'>
								{state.statistics?.correctAnswersCount}
							</div>
							<div className='stat-desc'>
								out of {state.questions.length} questions
							</div>
						</div>

						<div className='stat'>
							<div className='stat-title'>Accuracy</div>
							<div className='stat-value text-accent'>
								{state.statistics?.correctAnswersPercentage.toFixed(2)}%
							</div>
							<div className='stat-desc'>of answers were correct</div>
						</div>
						<div className='stat'>
							<div className='stat-title'>Total Score</div>
							<div className='stat-value text-secondary'>
								{state.statistics?.score}
							</div>
							<div className='stat-desc'>points earned</div>
						</div>
					</div>
				) : (
					<div className='text-base-content flex flex-col items-center gap-4'>
						<span className='loading loading-spinner loading-sm'></span>
						<p>Calculating results...</p>
					</div>
				)}

				<div className='mt-8 flex flex-col gap-4'>
					<button
						className='btn btn-primary'
						onClick={() => window.location.reload()}
					>
						Try Again
					</button>
					<button className='btn btn-secondary' onClick={handleDownloadResults}>
						Download Results
					</button>
					<Link href='/quizzes' className='btn btn-outline'>
						Back to all quizzes
					</Link>
				</div>

				<div className='mt-4 text-sm text-base-content/60'>
					Completed on:{' '}
					{new Date(state.statistics?.timestamp).toLocaleDateString()}
				</div>
			</div>
		);
	}

	return (
		<div className='relative flex flex-col items-center justify-center min-h-[400px]'>
			{!state.isGameActive ? (
				<div className='text-center space-y-6'>
					<div className='text-2xl font-bold text-primary w-full mx-0'>
						Your game starts in:
					</div>
					<div className='p-8 bg-base-200 rounded-xl text-accent flex items-center justify-center '>
						<div className='text-4xl font-bold'>
							<TimeCounter
								time={START_TIME}
								onTimeEnd={() =>
									dispatch({
										type: ACTIONS.SET_GAME_ACTIVE,
										payload: true,
									})
								}
								isActive={true}
								key={'start-timer'}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className='w-full'>
					{/* Stats Bar */}
					<div className='absolute top-0 left-0 right-0 bg-base-200 z-50 p-2 sm:p-3'>
						<div className='max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4'>
							<div className='flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto'>
								<span className='badge badge-lg text-xs sm:text-sm whitespace-nowrap'>
									Question {state.currentQuestionIndex + 1} of{' '}
									{state.questions.length}
								</span>
								<span className='badge badge-primary badge-lg text-xs sm:text-sm whitespace-nowrap'>
									{state.questions[state.currentQuestionIndex]?.type ===
										'Single Choice' && 'Single choice'}
									{state.questions[state.currentQuestionIndex]?.type ===
										'Multiple Choice' && 'Multiple choice'}
									{state.questions[state.currentQuestionIndex]?.type ===
										'Open' && 'Open question'}
									{state.questions[state.currentQuestionIndex]?.type ===
										'Fill in the Blank' && 'Fill in the Blank'}
								</span>
							</div>
							<div className='flex items-center justify-center w-full sm:w-auto'>
								<TimeCounter
									time={state.timeLimit}
									onTimeEnd={handleTimeEnd}
									isActive={state.isTimerActive}
									key={state.currentQuestionIndex}
								/>
							</div>
						</div>
					</div>

					<div className='mt-20 w-full flex justify-center align-center'>
						{renderQuestion()}
					</div>
				</div>
			)}
		</div>
	);
}
