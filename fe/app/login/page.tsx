'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('http://localhost:8081/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({email, password}),
			});

			const result = await response.json();

			if (response.ok) {
				const token = result.data?.token;

				if (token) {
					localStorage.setItem('token', token);
					router.push('/homepage');
				} else {
					setError('Server không trả về token hợp lệ');
				}
			} else {
				setError(result.message || 'Đăng nhập thất bại');
			}
		} catch (err) {
			console.error("Lỗi Fetch:", err);
			setError('Không thể kết nối đến server (Check CORS hoặc Network)');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-gray-100">
			<div
				className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
				<h2 className="text-2xl font-bold text-center">Đăng nhập</h2>

				{error &&
                <p className="text-red-500 text-sm text-center">{error}</p>}

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium">Email</label>
						<input
							type="email"
							className="w-full px-4 py-2 mt-1 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Mật khẩu</label>
						<input
							type="password"
							className="w-full px-4 py-2 mt-1 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
							loading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					>
						{loading ? 'Đang xử lý...' : 'Đăng nhập'}
					</button>
				</form>
			</div>
		</div>
	);
}