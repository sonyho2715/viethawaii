'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  User,
  ChevronRight,
} from 'lucide-react';

interface ConversationUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface ConversationListing {
  id: number;
  title: string;
  listingType: string;
  images: { imageUrl: string }[];
}

interface LastMessage {
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

interface ConversationSummary {
  id: number;
  otherUser: ConversationUser;
  listing: ConversationListing | null;
  lastMessage: LastMessage | null;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
}

interface MessageData {
  id: number;
  conversationId: number;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: ConversationUser;
}

interface ConversationDetail {
  id: number;
  listing: (ConversationListing & { price: number | null; status: string }) | null;
  otherUser: ConversationUser;
  createdAt: string;
}

interface MessagesPageClientProps {
  conversations: ConversationSummary[];
  currentUserId: string;
}

export default function MessagesPageClient({
  conversations: initialConversations,
  currentUserId,
}: MessagesPageClientProps) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [conversationDetail, setConversationDetail] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Open conversation from URL param
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setActiveConversationId(parseInt(id));
    }
  }, [searchParams]);

  // Fetch messages when conversation is selected
  const fetchMessages = useCallback(async (conversationId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data.messages);
        setConversationDetail(data.data.conversation);
        // Update unread count in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  // Poll for new messages in active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    const interval = setInterval(() => {
      fetchMessages(activeConversationId);
    }, 10000);
    return () => clearInterval(interval);
  }, [activeConversationId, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversationId || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    // Optimistic update
    const optimisticMessage: MessageData = {
      id: Date.now(),
      conversationId: activeConversationId,
      senderId: currentUserId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: { id: currentUserId, name: 'You', image: null },
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await fetch(`/api/messages/conversations/${activeConversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? data.data : m))
        );
        // Update sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  lastMessage: {
                    content,
                    senderId: currentUserId,
                    createdAt: new Date().toISOString(),
                    isRead: false,
                  },
                  lastMessageAt: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setNewMessage(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openConversation = (id: number) => {
    setActiveConversationId(id);
    router.push(`/tai-khoan/tin-nhan?id=${id}`, { scroll: false });
  };

  const closeConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setConversationDetail(null);
    router.push('/tai-khoan/tin-nhan', { scroll: false });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return language === 'vn' ? 'Hôm qua' : 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    }
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const listingTypeLabels: Record<string, { vn: string; en: string }> = {
    GENERAL: { vn: 'Rao vặt', en: 'Classifieds' },
    HOUSING: { vn: 'Nhà ở', en: 'Housing' },
    JOB: { vn: 'Việc làm', en: 'Jobs' },
    SERVICE: { vn: 'Dịch vụ', en: 'Services' },
  };

  // CONVERSATION LIST VIEW
  if (!activeConversationId) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">
          {language === 'vn' ? 'Tin nhắn' : 'Messages'}
        </h1>

        {conversations.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {language === 'vn' ? 'Chưa có tin nhắn' : 'No messages yet'}
            </h3>
            <p className="text-gray-400">
              {language === 'vn'
                ? 'Khi bạn nhắn tin cho người bán, cuộc hội thoại sẽ hiển thị ở đây.'
                : 'When you message a seller, conversations will appear here.'}
            </p>
          </Card>
        ) : (
          <Card className="divide-y divide-gray-100 overflow-hidden">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                  conv.unreadCount > 0 ? 'bg-blue-50/50' : ''
                }`}
              >
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={conv.otherUser.image || undefined} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-medium truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conv.otherUser.name || (language === 'vn' ? 'Người dùng' : 'User')}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                    </span>
                  </div>

                  {conv.listing && (
                    <div className="flex items-center gap-1 mb-0.5">
                      {conv.listing.images[0] && (
                        <ImageIcon className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-xs text-teal-600 truncate">
                        {conv.listing.title}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                      {conv.lastMessage
                        ? `${conv.lastMessage.senderId === currentUserId ? (language === 'vn' ? 'Bạn: ' : 'You: ') : ''}${conv.lastMessage.content}`
                        : (language === 'vn' ? 'Bắt đầu cuộc trò chuyện' : 'Start the conversation')}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 flex-shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-[11px] font-medium text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </Card>
        )}
      </div>
    );
  }

  // CONVERSATION DETAIL VIEW
  const activeConvSummary = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={closeConversation}
          className="lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <button onClick={closeConversation} className="hidden lg:block">
          <ArrowLeft className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={conversationDetail?.otherUser.image || activeConvSummary?.otherUser.image || undefined} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">
            {conversationDetail?.otherUser.name || activeConvSummary?.otherUser.name || (language === 'vn' ? 'Người dùng' : 'User')}
          </p>
          {(conversationDetail?.listing || activeConvSummary?.listing) && (
            <p className="text-xs text-teal-600 truncate">
              {conversationDetail?.listing?.title || activeConvSummary?.listing?.title}
            </p>
          )}
        </div>

        {/* Listing context card */}
        {conversationDetail?.listing && (
          <a
            href={`/${
              conversationDetail.listing.listingType === 'HOUSING' ? 'nha-o' :
              conversationDetail.listing.listingType === 'JOB' ? 'viec-lam' :
              conversationDetail.listing.listingType === 'SERVICE' ? 'dich-vu' : 'rao-vat'
            }/chi-tiet/${conversationDetail.listing.id}`}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs text-gray-500">
              {listingTypeLabels[conversationDetail.listing.listingType]?.[language] || 'Listing'}
            </span>
            {conversationDetail.listing.price && (
              <span className="text-xs font-semibold text-teal-600">
                ${conversationDetail.listing.price.toLocaleString()}
              </span>
            )}
          </a>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>{language === 'vn' ? 'Gửi tin nhắn đầu tiên!' : 'Send the first message!'}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isOwn = msg.senderId === currentUserId;
              const showAvatar =
                idx === 0 || messages[idx - 1].senderId !== msg.senderId;
              const showTime =
                idx === messages.length - 1 ||
                messages[idx + 1].senderId !== msg.senderId ||
                new Date(messages[idx + 1].createdAt).getTime() -
                  new Date(msg.createdAt).getTime() >
                  5 * 60 * 1000;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {!isOwn && showAvatar ? (
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarImage src={msg.sender.image || undefined} />
                      <AvatarFallback className="text-xs">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    !isOwn && <div className="w-7 flex-shrink-0" />
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm ${
                        isOwn
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-none'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {showTime && (
                      <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t pt-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'vn' ? 'Nhập tin nhắn...' : 'Type a message...'}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[42px] max-h-[120px]"
            rows={1}
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="h-[42px] px-4 bg-teal-600 hover:bg-teal-700 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
