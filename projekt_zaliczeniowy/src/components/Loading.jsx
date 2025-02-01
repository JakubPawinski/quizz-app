export default function Loading() {
	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<span className='loading loading-spinner loading-lg text-primary w-20 h-20'></span>
		</div>
	);
}
