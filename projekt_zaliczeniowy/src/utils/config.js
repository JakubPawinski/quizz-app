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
	},
	USER: {
		QUIZZES: (userId) => `/user/${userId}/my-quizzes`,
		PROFILE: (userId) => `/user/${userId}`,
	},
};

export { ENDPOINTS, APP_ROUTES };
