import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/messages/conversations/[id] - Get messages in a conversation
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversationId = parseInt(id, 10);
    if (isNaN(conversationId)) {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    const userId = session.user.id;

    // Verify user is a participant
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
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
            price: true,
            status: true,
            images: { take: 1, select: { imageUrl: true } },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get messages with pagination
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: parseInt(cursor) }, skip: 1 } : {}),
    });

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    // Mark unread messages from other user as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    const otherUser = conversation.participant1Id === userId
      ? conversation.participant2
      : conversation.participant1;

    return NextResponse.json({
      success: true,
      data: {
        conversation: {
          id: conversation.id,
          listing: conversation.listing ? {
            ...conversation.listing,
            price: conversation.listing.price ? Number(conversation.listing.price) : null,
          } : null,
          otherUser,
          createdAt: conversation.createdAt,
        },
        messages: messages.reverse(),
        hasMore,
        nextCursor: hasMore ? messages[0]?.id : null,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

// POST /api/messages/conversations/[id] - Send a message
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversationId = parseInt(id, 10);
    if (isNaN(conversationId)) {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validated = sendMessageSchema.parse(body);

    // Verify user is a participant
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Create message and update conversation timestamp
    const [message] = await db.$transaction([
      db.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: validated.content,
        },
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      }),
      db.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ]);

    // Notify the other participant
    const recipientId = conversation.participant1Id === userId
      ? conversation.participant2Id
      : conversation.participant1Id;

    const senderName = session.user.name || session.user.email || 'Someone';

    await db.notification.create({
      data: {
        userId: recipientId,
        type: 'NEW_MESSAGE',
        title: `Tin nhắn mới từ ${senderName}`,
        titleEn: `New message from ${senderName}`,
        message: validated.content.length > 100 ? validated.content.slice(0, 100) + '...' : validated.content,
        messageEn: validated.content.length > 100 ? validated.content.slice(0, 100) + '...' : validated.content,
        referenceType: 'conversation',
        referenceId: conversationId,
        referenceUrl: `/tai-khoan/tin-nhan?id=${conversationId}`,
        actorId: userId,
        actorName: senderName,
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
