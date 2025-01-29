import Link from 'next/link';
export default function Navbar() {
	return (
		<nav className='flex items-center justify-between p-4 bg-gray-800 text-white'>
			<h1 className='text-2xl'>Quiz App</h1>
			<ul className='flex space-x-4'>
				<li>
					<Link href='/auth/login'>Log in</Link>
				</li>
				<li>
					<Link href='/auth/register'>Register</Link>
				</li>
			</ul>
		</nav>
	);
}
