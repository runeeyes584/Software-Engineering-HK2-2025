"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider-fixed";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: t("chatbot.welcome"),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [t, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Set new message notification
  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };


  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    // 1. Thêm tin nhắn của người dùng vào giao diện
    const userMessage: Message = {
      id: Date.now(), // Dùng timestamp hoặc một cách tạo ID khác để tránh trùng lặp
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = message; // Lưu tin nhắn lại để gửi đi
    setMessage(""); // Xóa nội dung trong ô input

    setIsTyping(true); // Hiển thị hiệu ứng "Bot đang gõ..."

    try {
      // Gửi yêu cầu đến server AI
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: messageToSend,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi mạng hoặc server");
      }

      const data = await response.json();

      // 3. Thêm câu trả lời của AI vào giao diện
      const botMessage: Message = {
        id: Date.now() + 1, // Tạo ID mới
        text: data.answer, // Lấy câu trả lời từ API
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gọi API chatbot:", error);
      // Hiển thị thông báo lỗi trên giao diện nếu muốn
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // Luôn tắt hiệu ứng "đang gõ"
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    handleSendMessage();
  };

  const suggestions = [
    t("chatbot.suggestion.beaches"),
    t("chatbot.suggestion.booking"),
    t("chatbot.suggestion.cancellation"),
    t("chatbot.suggestion.discounts"),
    t("chatbot.suggestion.bestTime"),
  ];

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 relative"
          aria-label={t("chatbot.title")}
        >
          <MessageCircle className="h-6 w-6" />
          {hasNewMessage && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              !
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 sm:w-96">
          <Card className="shadow-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-lg font-semibold">
                {t("chatbot.title")}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMinimize}
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  aria-label={
                    isMinimized ? t("chatbot.expand") : t("chatbot.minimize")
                  }
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  aria-label={t("chatbot.close")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                <CardContent className="p-0">
                  <ScrollArea className="h-80 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-start space-x-2 max-w-[80%] ${
                              msg.sender === "user"
                                ? "flex-row-reverse space-x-reverse"
                                : ""
                            }`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  msg.sender === "bot"
                                    ? "/placeholder.svg?height=32&width=32"
                                    : undefined
                                }
                              />
                              <AvatarFallback className="text-xs">
                                {msg.sender === "bot" ? "🤖" : "👤"}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg px-3 py-2 text-sm ${
                                msg.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">
                                🤖
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Suggestions */}
                      {messages.length === 1 && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground font-medium">
                            {t("chatbot.suggestions")}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className="text-xs h-8"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full space-x-2">
                    <Input
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t("chatbot.placeholder")}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      aria-label={t("chatbot.send")}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
