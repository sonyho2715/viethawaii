import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/messages/unread - Get total unread message count
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const userId = session.user.id;

    // Find all conversations the user is in
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      select: { id: true },
    });

    if (conversations.length === 0) {
      return NextResponse.json({ count: 0 });
    }

    const count = await db.message.count({
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ count: 0 });
  }
}
