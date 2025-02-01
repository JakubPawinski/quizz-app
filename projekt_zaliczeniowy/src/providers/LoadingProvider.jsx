'use client';
import Loading from '@/components/Loading';

import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
			{isLoading && <Loading />}
		</LoadingContext.Provider>
	);
}

export const useLoading = () => useContext(LoadingContext);
