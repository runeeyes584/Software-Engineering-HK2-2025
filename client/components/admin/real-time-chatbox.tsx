"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "admin" | "user"
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

interface Conversation {
  id: string
  userName: string
  userEmail: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  isTyping: boolean
}

export default function RealTimeChatbox() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hi, I need help with my booking",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      isTyping: false,
    },
    {
      id: "2",
      userName: "David Chen",
      userEmail: "david@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thank you for your help!",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
    },
    {
      id: "3",
      userName: "Maria Garcia",
      userEmail: "maria@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "When is the best time to visit?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      isTyping: true,
    },
  ])

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        text: "Hi, I need help with my booking",
        sender: "user",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: "read",
      },
      {
        id: "2",
        text: "I can't find my confirmation email",
        sender: "user",
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
        status: "read",
      },
    ],
    "2": [
      {
        id: "3",
        text: "Hello! How can I help you today?",
        sender: "admin",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        status: "read",
      },
      {
        id: "4",
        text: "Thank you for your help!",
        sender: "user",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: "read",
      },
    ],
    "3": [
      {
        id: "5",
        text: "When is the best time to visit?",
        sender: "user",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "delivered",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "admin",
      timestamp: new Date(),
      status: "sent",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }))

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation ? { ...conv, lastMessage: message, timestamp: new Date() } : conv,
      ),
    )

    setMessage("")

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
        ),
      }))
    }, 1000)

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg,
        ),
      }))
    }, 3000)
  }

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
    return `${Math.floor(minutes / 1440)}d`
  }

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {totalUnreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300",
          isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            {selectedConversation && !isMinimized ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <img
                      src={selectedConv?.avatar || "/placeholder.svg"}
                      alt={selectedConv?.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <Circle
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full",
                        selectedConv?.isOnline ? "fill-green-500 text-green-500" : "fill-slate-400 text-slate-400",
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{selectedConv?.userName}</h3>
                    <p className="text-xs text-blue-100">
                      {selectedConv?.isTyping
                        ? t("admin.chat.typing")
                        : selectedConv?.isOnline
                          ? t("admin.chat.online")
                          : t("admin.chat.offline")}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-medium text-sm">{t("admin.chat.liveSupport")}</h3>
                  {!isMinimized && <p className="text-xs text-blue-100">{t("admin.chat.activeConversations")}</p>}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {selectedConversation && !isMinimized && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Content */}
            {selectedConversation ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 h-[440px] p-4">
                  <div className="space-y-4">
                    {(messages[selectedConversation] || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={cn("flex", msg.sender === "admin" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            msg.sender === "admin"
                              ? "bg-blue-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
                          )}
                        >
                          <p>{msg.text}</p>
                          <div
                            className={cn(
                              "flex items-center justify-between mt-1 text-xs",
                              msg.sender === "admin" ? "text-blue-100" : "text-slate-500",
                            )}
                          >
                            <span>{formatTime(msg.timestamp)}</span>
                            {msg.sender === "admin" && (
                              <span className="ml-2">
                                {msg.status === "sent" && "✓"}
                                {msg.status === "delivered" && "✓✓"}
                                {msg.status === "read" && "✓✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedConv?.isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("admin.chat.typeMessage")}
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="h-8 w-8 bg-blue-500 hover:bg-blue-600"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Conversations List */
              <ScrollArea className="h-[520px]">
                <div className="p-4 space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={conversation.avatar || "/placeholder.svg"}
                          alt={conversation.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <Circle
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full",
                            conversation.isOnline ? "fill-green-500 text-green-500" : "fill-slate-400 text-slate-400",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                            {conversation.userName}
                          </h4>
                          <span className="text-xs text-slate-500">{formatTime(conversation.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {conversation.isTyping ? (
                            <span className="italic">{t("admin.chat.typing")}</span>
                          ) : (
                            conversation.lastMessage
                          )}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </>
        )}
      </div>
    </div>
  )
}
