import './globals.scss';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { AuthProvider } from '@/providers/AuthProvider';
import { LoadingProvider } from '@/providers/LoadingProvider';
import Footer from '@/components/layout/Footer';
import { NotificationProvider } from '@/providers/NotificationProvider';

export const metadata = {
	title: 'QuizzApp',
	description: 'Create and play quizzes',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className='text-base-content min-h-screen flex flex-col'>
				<AuthProvider>
					<LoadingProvider>
						<NotificationProvider>
							<Navbar />
							<Breadcrumbs />
							<main className='flex-grow'>{children}</main>

							<Footer />
						</NotificationProvider>
					</LoadingProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
