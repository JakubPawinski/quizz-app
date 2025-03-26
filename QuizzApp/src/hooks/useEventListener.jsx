import { useEffect, useRef } from 'react';

export default function useEventListener(eventName, callback, element = window) {
	const callbackRef = useRef();

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const eventListener = (event) => callbackRef.current(event);
		element.addEventListener(eventName, eventListener);

		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
}
