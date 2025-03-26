export default function loginLayout({ children }) {
	return (
		<div className='flex items-center justify-center bg-base-100 pt-20'>
			<div className='bg-base-100 auth-layout'>{children}</div>
		</div>
	);
}
