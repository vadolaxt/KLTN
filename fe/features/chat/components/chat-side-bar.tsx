"use client";
import { useState } from "react";

interface ChatSidebarProps {
	onSelectTopic: (topic: string) => void;
}

export default function ChatSidebar({ onSelectTopic}: ChatSidebarProps) {
	const [activeTab, setActiveTab] = useState("topics");

	return (
		<aside className="w-[320px] bg-white border-r border-gray-200 flex flex-col overflow-hidden h-full">
			{/* Tabs */}
			<div className="flex border-b border-gray-200">
				{["topics", "faq"].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`flex-1 py-3 text-sm font-semibold capitalize border-b-2 transition-all ${
							activeTab === tab ? "text-green-600 border-green-600" : "text-gray-500 border-transparent"
						}`}
					>
						{tab === "topics" ? "Chủ đề" : "FAQ"}
					</button>
				))}
			</div>

			{/* List Content */}
			<div className="flex-1 overflow-y-auto">
				{activeTab === "topics" && (
					<div className="p-2">
						<button onClick={() => onSelectTopic("Học phí 2025")} className="w-full text-left p-3 hover:bg-green-50 rounded-lg text-sm font-medium">
							Học phí các ngành
						</button>
					</div>
				)}
			</div>
		</aside>
	);
}