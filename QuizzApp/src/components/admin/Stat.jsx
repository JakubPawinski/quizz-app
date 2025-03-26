export default function Stat({ stat }) {
	return (
		<div className='stat bg-base-100 shadow-md p-4 rounded-lg hover:shadow-lg'>
			<div className='stat-title text-sm'>{stat.label}</div>
			<div className='stat-value text-xl'>{stat.value}</div>
		</div>
	);
}
