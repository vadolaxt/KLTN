"use client";

import {useState, useMemo} from "react";
import Link from "next/link"; // Import thẻ Link từ Next.js
import TopBar from "@/shared/components/TopBar";
import Header from "@/shared/components/Header";
import NavBar from "@/shared/components/NavBar";

export default function CertificateConvertView() {
	const [certType, setCertType] = useState("IELTS");
	const [score, setScore] = useState("");

	// Xử lý logic quy đổi điểm
	const convertedScore = useMemo(() => {
		if (!score) return null;

		const numScore = parseFloat(score);
		if (isNaN(numScore)) return null;

		if (certType === "IELTS") {
			if (numScore >= 6.5) return 10.0;
			if (numScore >= 6.0) return 9.5;
			if (numScore >= 5.5) return 9.0;
			if (numScore >= 5.0) return 8.5;
			if (numScore >= 4.5) return 8.0;
			return 0; // Dưới mức quy đổi
		} else {
			if (numScore >= 550) return 10.0;
			if (numScore >= 530) return 9.5;
			if (numScore >= 500) return 9.0;
			if (numScore >= 480) return 8.5;
			if (numScore >= 450) return 8.0;
			return 0; // Dưới mức quy đổi
		}
	}, [certType, score]);

	return (
		<div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
			<TopBar/>
			<Header/>
			<NavBar/>

			{/* Chú thích ở trên cùng */}
			<div className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-center text-sm text-blue-900 flex flex-col sm:flex-row items-center justify-center gap-1 shadow-sm">
        <div>
			  Thí sinh sử dụng điểm đã quy đổi để thay thế cho điểm môn thi tiếng anh trong hồ sơ điểm đối với phương thức THPT.
		  </div>
				<Link
					href="/ho-so/diem-so"
					className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors inline-flex items-center"
				>
					Đi tới hồ sơ điểm số
				</Link>
			</div>

			{/* Main Content */}
			<main className="flex-grow flex items-center justify-center p-6">
				<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
					<h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
						Quy đổi điểm ngoại ngữ
					</h1>

					{/* Chọn loại chứng chỉ */}
					<div className="mb-5">
						<label htmlFor="cert-type" className="block text-sm font-medium text-gray-700 mb-2">
							Loại chứng chỉ
						</label>
						<select
							id="cert-type"
							value={certType}
							onChange={(e) => {
								setCertType(e.target.value);
								setScore(""); // Reset điểm khi đổi loại chứng chỉ
							}}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
						>
							<option value="IELTS">IELTS</option>
							<option value="TOEFL">TOEFL ITP</option>
						</select>
					</div>

					{/* Nhập điểm chứng chỉ */}
					<div className="mb-6">
						<label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
							Nhập điểm {certType}
						</label>
						<input
							id="score"
							type="number"
							step={certType === "IELTS" ? "0.5" : "1"}
							min="0"
							value={score}
							onChange={(e) => setScore(e.target.value)}
							placeholder={`Ví dụ: ${certType === "IELTS" ? "6.5" : "550"}`}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
						/>
					</div>

					{/* Hiển thị kết quả */}
					<div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center">
            <span className="text-sm font-medium text-blue-800 mb-2">
              Điểm Đại Học Quy Đổi
            </span>
						<span className="text-4xl font-extrabold text-blue-600">
              {convertedScore === null
					  ? "-"
					  : convertedScore === 0
						  ? "Không đạt"
						  : convertedScore.toFixed(1).replace(".", ",")}
            </span>
						{convertedScore === 0 && (
							<span className="text-xs text-red-500 mt-2">
                * Điểm chưa đạt mức tối thiểu để quy đổi (IELTS 4.5 hoặc TOEFL 450)
              </span>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}