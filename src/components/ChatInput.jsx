export default function ChatInput({
  input,
  setInput,
  onSend,
  loading
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onSend();
    }
  }

  return (
    <div className="chat-input-bar">
      <input
        className="chat-input"
        type="text"
        value={input}
        onChange={(event) =>
          setInput(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Ask about your refund..."
        disabled={loading}
      />

      <button
        className="chat-send-button"
        onClick={onSend}
        disabled={loading || !input.trim()}
      >
        {loading ? "Checking..." : "Send"}
      </button>
    </div>
  );
}