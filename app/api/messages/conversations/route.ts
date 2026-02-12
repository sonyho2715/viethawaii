import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/messages/conversations - List user's conversations
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: { select: { id: true, name: true, image: true } },
        participant2: { select: { id: true, name: true, image: true } },
        listing: { select: { id: true, title: true, listingType: true, images: { take: 1, select: { imageUrl: true } } } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, senderId: true, createdAt: true, isRead: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Add unread count per conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        const otherUser = conv.participant1Id === userId
          ? conv.participant1Id === userId ? conv.participant2 : conv.participant1
          : conv.participant1;

        return {
          ...conv,
          otherUser,
          unreadCount,
          lastMessage: conv.messages[0] || null,
        };
      })
    );

    return NextResponse.json({ success: true, data: conversationsWithUnread });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

const createConversationSchema = z.object({
  recipientId: z.string().min(1),
  listingId: z.number().int().positive().optional(),
  message: z.string().min(1).max(2000),
});

// POST /api/messages/conversations - Start a new conversation (or send to existing)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validated = createConversationSchema.parse(body);

    if (validated.recipientId === userId) {
      return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
    }

    // Check if recipient exists
    const recipient = await db.user.findUnique({
      where: { id: validated.recipientId },
      select: { id: true },
    });
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Find existing conversation between these users for this listing
    const existingConversation = await db.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: validated.recipientId, listingId: validated.listingId ?? null },
          { participant1Id: validated.recipientId, participant2Id: userId, listingId: validated.listingId ?? null },
        ],
      },
    });

    let conversation;

    if (existingConversation) {
      // Add message to existing conversation
      conversation = existingConversation;
      await db.$transaction([
        db.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: validated.message,
          },
        }),
        db.conversation.update({
          where: { id: conversation.id },
          data: { lastMessageAt: new Date() },
        }),
      ]);
    } else {
      // Create new conversation with first message
      conversation = await db.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: validated.recipientId,
          listingId: validated.listingId,
          messages: {
            create: {
              senderId: userId,
              content: validated.message,
            },
          },
        },
      });
    }

    // Create notification for recipient
    const senderName = session.user.name || session.user.email || 'Someone';
    let listingTitle = '';
    if (validated.listingId) {
      const listing = await db.listing.findUnique({
        where: { id: validated.listingId },
        select: { title: true },
      });
      listingTitle = listing?.title ? ` về "${listing.title}"` : '';
    }

    await db.notification.create({
      data: {
        userId: validated.recipientId,
        type: 'NEW_MESSAGE',
        title: `Tin nhắn mới từ ${senderName}`,
        titleEn: `New message from ${senderName}`,
        message: validated.message.length > 100 ? validated.message.slice(0, 100) + '...' : validated.message,
        messageEn: validated.message.length > 100 ? validated.message.slice(0, 100) + '...' : validated.message,
        referenceType: 'conversation',
        referenceId: conversation.id,
        referenceUrl: `/tai-khoan/tin-nhan?id=${conversation.id}`,
        actorId: userId,
        actorName: senderName,
      },
    });

    return NextResponse.json({ success: true, data: { conversationId: conversation.id } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
