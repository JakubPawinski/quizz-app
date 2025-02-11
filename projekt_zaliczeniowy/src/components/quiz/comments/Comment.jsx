import { useEffect, useState } from 'react';
import { ENDPOINTS } from '@/utils/config';
import axios from 'axios';
import { useAuth } from '@/providers/AuthProvider';

export default function Comment({ comment, onDelete, quizId }) {
	const { user } = useAuth();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await axios.delete(`${ENDPOINTS.QUIZ}/${quizId}/comment/${comment._id}`, {
				withCredentials: true,
			});
			onDelete(comment._id);
		} catch (error) {
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className='card bg-base-100 shadow-sm p-4'>
			<div className='flex items-center gap-2 mb-2'>
				<div className='font-medium text-sm'>{comment.userId.nickname}</div>
				<div className='text-xs text-base-content/70'>
					{new Date(comment.timestamp).toLocaleDateString()}
				</div>

				{user && (user._id === comment.userId._id || user.rootAccess) && (
					<button
						onClick={handleDelete}
						disabled={isDeleting}
						className='btn btn-ghost btn-xs text-error hover:bg-error/10'
					>
						{isDeleting ? (
							<span className='loading loading-spinner loading-xs' />
						) : (
							'Delete'
						)}
					</button>
				)}
			</div>
			<div className='text-sm text-base-content/90'>{comment.content}</div>
		</div>
	);
}
