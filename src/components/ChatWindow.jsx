import { useEffect, useRef } from "react";
import "../app/chat/chat.css";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="chat-shell">
      <div className="chat-window" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`message-row ${message.role}`}
          >
            <MessageBubble message={message} />
          </div>
        ))}

        {loading && (
          <div className="typing-indicator-wrap" aria-live="polite">
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
            <span className="typing-text">RefundAI is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}