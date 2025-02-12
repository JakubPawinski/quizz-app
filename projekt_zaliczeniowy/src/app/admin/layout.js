'use client';
import useAuthorization from '@/hooks/useAuthorization';

export default function AdminLayout({ children }) {
	const authorized = useAuthorization('admin');

	if (!authorized) {
		return null;
	}

	return <div className='admin-layout w-full'>{children}</div>;
}
