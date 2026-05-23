import ChatView from "@/features/chat/chat.view";
import AuthRequired from "@/shared/components/AuthRequired";

export default function ChatPage() {
	return (
		<AuthRequired featureName="chatbot tư vấn tuyển sinh">
			<ChatView/>
		</AuthRequired>
	)
}
