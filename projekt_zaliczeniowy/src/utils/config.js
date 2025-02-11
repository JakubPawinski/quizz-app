import axios from 'axios';

const APIURL = 'http://localhost:4000/api';

const ENDPOINTS = {
	QUIZ: `${APIURL}/quiz`,
	USER: `${APIURL}/user`,
	RANKING: `${APIURL}/ranking`,
	AUTH: `${APIURL}/auth`,
};

const APP_ROUTES = {
	HOME: '/',
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		VERIFY: '/auth/verify-email',
		RESET_PASSWORD: '/auth/reset-password',
	},
	QUIZZES: {
		LIST: '/quizzes',
		CREATE: '/quizzes/create',
		QUIZ: (quizId) => `/quizzes/${quizId}`,
	},
	USER: {
		QUIZZES: (userId) => `/user/${userId}/my-quizzes`,
		PROFILE: (userId) => `/user/${userId}`,
		QUIZ_EDIT: (userId, quizId) => `/user/${userId}/my-quizzes/${quizId}`,
	},
	LEADERBOARD: '/leaderboard',
	ADMIN: {
		USERS: '/admin/users',
		QUIZZES: '/admin/quizzes',
		QUIZ_EDIT: (quizId) => `/admin/quizzes/${quizId}`,
	},
};

export { ENDPOINTS, APP_ROUTES };
