import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='bg-neutral text-neutral-content py-8 mt-auto w-full'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col md:flex-row justify-between items-center'>
					<div className='mb-4 md:mb-0'>
						<h2 className='text-2xl font-bold'>Quiz App</h2>
						<p className='text-sm'>Your ultimate quiz destination</p>
					</div>
					<div className='flex space-x-4'>
						<Link href='/' className='text-primary hover:text-primary-content'>
							Home
						</Link>
						<Link
							href='/auth/login'
							className='text-primary hover:text-primary-content'
						>
							Get Started
						</Link>
					</div>
				</div>
				<div className='mt-8 text-center text-sm'>
					<p>
						&copy; {new Date().getFullYear()} Quiz App. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
