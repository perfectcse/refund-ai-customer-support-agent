"use client";

import { useEffect, useRef, useState } from "react";

import Navigation from "@/components/Navigation";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import "./chat.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI customer support agent. I can help you check your order and determine whether it qualifies for a refund."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: input.trim()
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const assistantMessage = {
        role: "assistant",
        content: data.response,
        decision: data.decision || null,
        events: Array.isArray(data.events) ? data.events : []
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while processing your request.",
          decision: null,
          events: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navigation />
      <main className="chat-page">
        <div className="chat-container">
          <header className="chat-header">
            <h1 className="chat-title">Customer Support Agent</h1>
            <span className="chat-status">● Online</span>
          </header>

          <ChatWindow messages={messages} loading={loading} />

          <div ref={endOfMessagesRef} />

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        </div>
      </main>
    </>
  );
}