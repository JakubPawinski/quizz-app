import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#00c4f1',

					'primary-content': '#000e14',

					secondary: '#006f00',

					'secondary-content': '#d0e2cf',

					accent: '#00c02e',

					'accent-content': '#000e01',

					neutral: '#292929',

					'neutral-content': '#d0d0d0',

					'base-100': '#fff3ff',

					'base-200': '#ded3de',

					'base-300': '#beb4be',

					'base-content': '#161416',

					info: '#00cbff',

					'info-content': '#000f16',

					success: '#00c173',

					'success-content': '#000e05',

					warning: '#b16a00',

					'warning-content': '#0c0400',

					error: '#ff7799',

					'error-content': '#160508',
				},
			},
		],
	},
};
