import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
