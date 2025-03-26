import Link from 'next/link';
import { APP_ROUTES } from '@/config';

export default function AuthNavigationBar({ active }) {
	return (
		<div className='w-full flex justify-evenly'>
			<Link
				href={APP_ROUTES.AUTH.LOGIN}
				className={`auth-button link link-hover ${
					active === 'login' && `link-primary`
				}`}
			>
				Log in
			</Link>
			<Link
				href={APP_ROUTES.AUTH.REGISTER}
				className={`auth-button link link-hover ${
					active === 'register' && `link-primary`
				}`}
			>
				Register
			</Link>
		</div>
	);
}
