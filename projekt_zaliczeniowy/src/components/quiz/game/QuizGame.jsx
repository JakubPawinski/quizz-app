'use client';
import { useEffect, useState, useReducer, useMemo } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import axios from 'axios';
import TimeCounter from './TimeCounter';

import SingleChoiceGame from './questionTypes/SingleChoiceGame';
import MultipleChoiceGame from './questionTypes/MultipleChoiceGame';
import OpenQuestionGame from './questionTypes/OpenQuestionGame';
import FillInTheBlankGame from './questionTypes/FillInTheBlankGame';

const START_TIME = 1;

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

export default function QuizGame({ quiz }) {
	const [state, dispatch] = useReducer(quizReducer, initialState);

	const currentQuestion = useMemo(
		() => state.questions[state.currentQuestionIndex],
		[state.questions, state.currentQuestionIndex]
	);
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

	useEffect(() => {
		const shuffledQuestions = shuffleArray([...quiz.questions]);
		dispatch({ type: ACTIONS.SET_QUESTIONS, payload: shuffledQuestions });
	}, [quiz]);

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

	const handleTimeEnd = () => {
		dispatch({ type: ACTIONS.SET_TIMER_ACTIVE, payload: false });

		if (state.currentQuestionIndex >= state.questions.length - 1) {
			dispatch({ type: ACTIONS.SET_FINISHED, payload: true });
			return;
		}

		setTimeout(() => {
			dispatch({
				type: ACTIONS.SET_CURRENT_QUESTION,
				payload: state.currentQuestionIndex + 1,
			});
		}, 1000);
	};

	const handleAnswer = (answer) => {
		dispatch({ type: ACTIONS.SET_TIMER_ACTIVE, payload: false });
		dispatch({ type: ACTIONS.SET_SHOWING_ANSWER, payload: true });
		const newAnswers = {
			...state.answers,
			[currentQuestion._id]: answer,
		};

		dispatch({ type: ACTIONS.SET_ANSWERS, payload: newAnswers });
		console.log('Answers after update:', newAnswers);

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
		}, 2000);
	};

	const handleQuizComplete = async (finalAnswers) => {
		console.log('Final answers:', finalAnswers);
	};

	const renderQuestion = () => {
		if (!currentQuestion) return null;

		return (
			<div className='w-full'>
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
			</div>
		);
	};

	if (state.isFinished) {
		return (
			<div className='text-center p-8'>
				<h2 className='text-2xl font-bold text-primary mb-4'>
					Quiz Completed!
				</h2>

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
							{state.statistics?.correctAnswersPercentage}%
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

				<div className='mt-8 flex flex-col gap-4'>
					<button
						className='btn btn-primary'
						onClick={() => window.location.reload()}
					>
						Try Again
					</button>
					<Link href='/dashboard' className='btn btn-outline'>
						Back to Dashboard
					</Link>
				</div>

				<div className='mt-4 text-sm text-base-content/60'>
					Completed on:{' '}
					{new Date(state.statistics?.createdAt).toLocaleDateString()}
				</div>
			</div>
		);
	}

	return (
		<div className='relative flex flex-col items-center justify-center min-h-[400px] p-8'>
			{!state.isGameActive ? (
				<div className='text-center space-y-6'>
					<div className='text-2xl font-bold text-primary'>
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
				<div className='max-w-2xl mx-auto p-6'>
					{/* Stats Bar */}
					<div className='absolute top-0 left-0 right-0 bg-base-200 shadow-lg p-4 z-50'>
						<div className='max-w-2xl mx-auto flex justify-between items-center'>
							<div className='flex items-center gap-4'>
								<span className='badge badge-lg'>
									Question {state.currentQuestionIndex + 1} of{' '}
									{state.questions.length}
								</span>
								<span className='badge badge-primary badge-lg'>
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
							<div className='flex items-center gap-4'>
								<TimeCounter
									time={state.timeLimit}
									onTimeEnd={handleTimeEnd}
									isActive={state.isTimerActive}
									key={state.currentQuestionIndex}
								/>
							</div>
						</div>
					</div>

					<div className='mt-20'>{renderQuestion()}</div>
				</div>
			)}
		</div>
	);
}
