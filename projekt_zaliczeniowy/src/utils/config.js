import axios from 'axios';

const APIURL = 'http://localhost:4000/api';

const ENDPOINTS = {
	QUIZ: `${APIURL}/quiz`,
	USER: `${APIURL}/user`,
	RANKING: `${APIURL}/ranking`,
	AUTH: `${APIURL}/auth`,
};

export { ENDPOINTS };
