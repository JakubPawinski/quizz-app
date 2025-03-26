'use client';
import useAuthorization from '@/hooks/useAuthorization';
import { useParams } from 'next/navigation';
export default function UserLayout({ children }) {
	const { id } = useParams();
	const authorized = useAuthorization(id);
	if (!authorized) {
		return null;
	}
	return <div className='user-layout w-full'>{children}</div>;
}
