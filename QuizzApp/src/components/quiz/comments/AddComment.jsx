import { useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/config';
import { useUser } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function AddComment({ quizId, onCommentAdded }) {
	const [content, setContent] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showForm, setShowForm] = useState(false);

	//Context
	const { user } = useUser();

	//Function to handle form submit
	const handleSubmit = async (e) => {
		// console.log('handleSubmit');
		e.preventDefault();
		if (!content.trim()) return;

		try {
			setIsSubmitting(true);
			const response = await axios.post(
				`${ENDPOINTS.QUIZ}/${quizId}/comment`,
				{
					content: content,
				},
				{
					withCredentials: true,
				}
			);
			console.log('response:', response);

			if (response.data) {
				setContent('');
				setShowForm(false);
				onCommentAdded?.(response.data.data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user) {
		return (
			<div className='text-center text-sm text-base-content/70 p-4'>
				Please <Link href='/login'>Log in </Link> to add a comment.
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{!showForm ? (
				<button
					onClick={() => setShowForm(true)}
					className='btn btn-primary btn-sm w-full'
				>
					Add Comment
				</button>
			) : (
				<form onSubmit={handleSubmit} className='space-y-4'>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder='Napisz swój komentarz...'
						className='textarea textarea-bordered w-full min-h-[100px] text-sm'
						disabled={isSubmitting}
						autoFocus
					/>
					<div className='flex justify-end gap-2'>
						<button
							type='button'
							onClick={() => setShowForm(false)}
							className='btn btn-ghost btn-sm'
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type='submit'
							className='btn btn-primary btn-sm'
							disabled={!content.trim() || isSubmitting}
						>
							{isSubmitting ? (
								<span className='loading loading-spinner loading-xs' />
							) : (
								'Public'
							)}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
