"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, MessageSquare, Users, Clock, Phone, Video, MoreVertical } from "lucide-react"

export default function AdminChat() {
  const { t } = useLanguage()
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const conversations = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      avatar: "NA",
      lastMessage: "Tôi muốn hỏi về tour Hạ Long",
      time: "5 phút trước",
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: "user", content: "Xin chào, tôi muốn hỏi về tour Hạ Long", time: "10:30" },
        { id: 2, sender: "admin", content: "Chào bạn! Tôi có thể giúp gì cho bạn về tour Hạ Long?", time: "10:32" },
        { id: 3, sender: "user", content: "Tour 3 ngày 2 đêm giá bao nhiêu ạ?", time: "10:35" },
        { id: 4, sender: "user", content: "Và có bao gồm ăn uống không?", time: "10:35" },
      ],
    },
    {
      id: 2,
      user: "Sarah Johnson",
      avatar: "SJ",
      lastMessage: "Can I change my booking date?",
      time: "15 phút trước",
      unread: 1,
      online: true,
      messages: [
        { id: 1, sender: "user", content: "Hi, I need to change my booking date", time: "10:15" },
        {
          id: 2,
          sender: "admin",
          content:
            "Hello Sarah! I'd be happy to help you change your booking date. Can you provide me with your booking reference?",
          time: "10:17",
        },
        { id: 3, sender: "user", content: "Sure, it's BK-2024-001", time: "10:20" },
        { id: 4, sender: "user", content: "Can I change my booking date?", time: "10:25" },
      ],
    },
    {
      id: 3,
      user: "Trần Thị B",
      avatar: "TB",
      lastMessage: "Cảm ơn về chuyến đi tuyệt vời!",
      time: "1 giờ trước",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: "user", content: "Chào admin, tôi vừa hoàn thành chuyến đi Sapa", time: "09:30" },
        {
          id: 2,
          sender: "admin",
          content: "Chào bạn! Cảm ơn bạn đã chọn dịch vụ của chúng tôi. Chuyến đi có thú vị không?",
          time: "09:32",
        },
        { id: 3, sender: "user", content: "Rất tuyệt vời! Hướng dẫn viên rất nhiệt tình", time: "09:35" },
        { id: 4, sender: "user", content: "Cảm ơn về chuyến đi tuyệt vời!", time: "09:40" },
      ],
    },
    {
      id: 4,
      user: "David Wilson",
      avatar: "DW",
      lastMessage: "What's included in the package?",
      time: "2 giờ trước",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: "user", content: "Hi, I'm interested in the Mekong Delta tour", time: "08:30" },
        {
          id: 2,
          sender: "admin",
          content: "Great choice! The Mekong Delta tour is one of our most popular packages.",
          time: "08:32",
        },
        { id: 3, sender: "user", content: "What's included in the package?", time: "08:35" },
      ],
    },
  ]

  const filteredConversations = conversations.filter((conv) =>
    conv.user.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat)

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      // Add message logic here
      setMessage("")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t("admin.chat.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{t("admin.chat.subtitle")}</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <Card className="shadow-lg border-0 lg:col-span-1">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-orange-600" />
              {t("admin.chat.conversations")}
            </CardTitle>
            <CardDescription>{t("admin.chat.activeChats")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("admin.chat.searchUsers")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-0">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selectedChat === conversation.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{conversation.user}</p>
                        <div className="flex items-center space-x-2">
                          {conversation.unread > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs px-2 py-1">
                              {conversation.unread}
                            </Badge>
                          )}
                          <Badge variant={conversation.online ? "default" : "secondary"} className="text-xs">
                            {conversation.online ? t("admin.chat.online") : t("admin.chat.offline")}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">{conversation.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="shadow-lg border-0 lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {selectedConversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.user}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.online ? t("admin.chat.online") : t("admin.chat.offline")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0 flex flex-col h-[500px]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === "admin"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-blue-100" : "text-gray-500"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder={t("admin.chat.typeMessage")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-white dark:bg-gray-700"
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t("admin.chat.selectConversation")}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
