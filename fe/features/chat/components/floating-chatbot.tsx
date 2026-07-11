"use client";

import {useState} from "react";

import ChatPanel from "@/features/chat/components/chat-panel";
import {MessageCircleQuestionMark} from "lucide-react";

export default function FloatingChatbot() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
			{isOpen ? (
				<div
					role="dialog"
					aria-label="NLU Assistant"
					className="
            h-[min(620px,calc(100dvh-88px))]
            w-[calc(100vw-32px)]
            max-w-[390px]
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
          "
				>
					<ChatPanel onClose={() => setIsOpen(false)}/>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					aria-label="Mở chatbot NLU Assistant"
					className="
            group
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            border-2
            border-yellow-400
            bg-green-700
            text-2xl
            text-white
            shadow-xl
            transition
            hover:scale-105
            hover:bg-green-800
            focus:outline-none
            focus-visible:ring-4
            focus-visible:ring-green-300
          "
				>
          <span
				 aria-hidden="true"
				 className="transition group-hover:rotate-6">
            <MessageCircleQuestionMark/>
          </span>
				</button>
			)}
		</div>
	);
}