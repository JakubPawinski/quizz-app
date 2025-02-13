'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import _ from 'lodash';

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
					const formattedSegment = _.capitalize(segment);

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
