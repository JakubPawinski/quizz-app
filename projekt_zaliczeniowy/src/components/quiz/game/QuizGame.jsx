'use client';
import { useEffect, useState, useReducer, useMemo } from 'react';
import _ from 'lodash';
import TimeCounter from './TimeCounter';

const START_TIME = 3;

const ACTIONS = {
	SET_QUESTIONS: 'set_questions',
	SET_GAME_ACTIVE: 'set_game_active',
	SET_CURRENT_QUESTION: 'set_current_question',
	SET_TIMER_ACTIVE: 'set_timer_active',
	SET_TIME_LIMIT: 'set_time_limit',
	SET_FINISHED: 'set_finished',
};
const initialState = {
	questions: [],
	isGameActive: false,
	currentQuestionIndex: 0,
	timeLimit: 10,
	isTimerActive: false,
	isFinished: false,
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

	const renderQuestion = () => {
		if (!currentQuestion) return null;

		return (
			<div className='w-full'>
				<h2>{currentQuestion.content}</h2>
			</div>
		);
	};

	if (state.isFinished) {
		return (
			<div className='text-center p-8'>
				<h2 className='text-2xl font-bold text-primary mb-4'>Quiz finished!</h2>
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
