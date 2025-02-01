'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {
	const pathname = usePathname();
	const pathSegments = pathname.split('/').filter((segment) => segment);

	return (
		<div className='breadcrumbs max-w-100% text-sm bg-base-100 text-base-content pl-[20px]'>
			<ul>
				<li>
					<Link href='/'>Home</Link>
				</li>
				{pathSegments.map((segment, index) => {
					const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
					const formattedSegment =
						segment.charAt(0).toUpperCase() + segment.slice(1);

					return (
						<li key={path}>
							<Link href={path}>{formattedSegment}</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
