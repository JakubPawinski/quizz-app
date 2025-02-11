import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export const useChart = (config, dependencies = []) => {
	const chartRef = useRef(null);
	const chartInstance = useRef(null);

	useEffect(() => {
		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		if (chartRef.current) {
			chartInstance.current = new Chart(chartRef.current, config);
		}

		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, dependencies);

	return chartRef;
};
