export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const decision = message.decision?.toUpperCase();
  const events = Array.isArray(message.events) ? message.events : [];

  return (
    <div className={`message-bubble ${isUser ? "user" : "assistant"}`}>
      <div className="message-meta">
        {isUser ? "You" : "RefundAI"}
      </div>

      <div className="message-content">{message.content}</div>

      {!isUser && decision && (
        <div className={`decision-pill ${decision.toLowerCase()}`}>
          {decision}
        </div>
      )}

      {!isUser && events.length > 0 && (
        <div className="tool-activity">
          {events.map((event, index) => (
            <div key={`${event.tool || event.type}-${index}`} className="tool-item">
              <span className={`tool-status ${String(event.status || "info").toLowerCase()}`}>
                {event.status || "INFO"}
              </span>
              <span className="tool-label">{event.tool || event.type}</span>
              <p>{event.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}