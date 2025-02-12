'use client';
import { useState, useEffect } from 'react';
import { ENDPOINTS } from '@/utils/config';
import axios from 'axios';

export default function ManageCategories() {
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(`${ENDPOINTS.QUIZ}/categories`);
				setCategories(response.data.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchCategories();
	}, []);

	const handleDeleteCategory = async (categoryId) => {
		try {
			const response = await axios.delete(
				`${ENDPOINTS.QUIZ}/category/${categoryId}`
			);
			setCategories((prevCategories) =>
				prevCategories.filter((category) => category._id !== categoryId)
			);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className='flex flex-col items-center'>
			<div className='card bg-base-200 p-6 w-full max-w-md hover:shadow-lg'>
				<h2 className='text-2xl font-bold mb-4 text-primary text-center'>
					Categories List
				</h2>
				{categories.length > 0 ? (
					<ul className='space-y-4 overflow-y-auto max-h-56'>
						{categories.map((category) => (
							<li
								key={category._id}
								className='flex items-center justify-between p-4 bg-base-300 rounded-lg shadow-md transition-all hover:shadow-xl'
							>
								<span className='text-lg font-medium text-base-content'>
									{category.name}
								</span>
								<button
									onClick={() => handleDeleteCategory(category._id)}
									className='btn btn-error btn-sm'
								>
									Delete
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className='text-center'>No categories available.</p>
				)}
			</div>
		</div>
	);
}
