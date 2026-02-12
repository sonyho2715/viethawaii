import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import MessagesPageClient from './MessagesPageClient';

export const metadata = {
  title: 'Tin nhắn | VietHawaii',
  description: 'Hộp thư tin nhắn của bạn',
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/dang-nhap?callbackUrl=/tai-khoan/tin-nhan');
  }

  const userId = session.user.id;

  const rawConversations = await db.conversation.findMany({
    where: {
      OR: [
        { participant1Id: userId },
        { participant2Id: userId },
      ],
    },
    include: {
      participant1: { select: { id: true, name: true, image: true } },
      participant2: { select: { id: true, name: true, image: true } },
      listing: {
        select: {
          id: true,
          title: true,
          listingType: true,
          images: { take: 1, select: { imageUrl: true } },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, senderId: true, createdAt: true, isRead: true },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  // Get unread counts per conversation and serialize for client
  const conversations = await Promise.all(
    rawConversations.map(async (conv) => {
      const unreadCount = await db.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          isRead: false,
        },
      });

      const otherUser = conv.participant1Id === userId
        ? conv.participant2
        : conv.participant1;

      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        otherUser,
        listing: conv.listing
          ? {
              id: conv.listing.id,
              title: conv.listing.title,
              listingType: conv.listing.listingType,
              images: conv.listing.images.map((img) => ({ imageUrl: img.imageUrl })),
            }
          : null,
        lastMessage: lastMsg
          ? {
              content: lastMsg.content,
              senderId: lastMsg.senderId,
              createdAt: lastMsg.createdAt.toISOString(),
              isRead: lastMsg.isRead,
            }
          : null,
        unreadCount,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt.toISOString(),
      };
    })
  );

  return (
    <MessagesPageClient
      conversations={conversations}
      currentUserId={userId}
    />
  );
}
