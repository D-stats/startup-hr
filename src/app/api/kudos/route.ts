import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithOrganization } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma';
import { sendKudosNotification } from '@/lib/slack/notifications';
import { sendKudosEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const { dbUser } = await requireAuthWithOrganization();
    
    const body = await request.json();
    const { receiverId, message, category, isPublic } = body;

    if (!receiverId || !message || !category) {
      return NextResponse.json(
        { error: '必要な項目が入力されていません' },
        { status: 400 }
      );
    }

    // 受信者が同じ組織のメンバーかチェック
    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        organizationId: dbUser.organizationId,
        isActive: true,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: '無効な受信者です' },
        { status: 400 }
      );
    }

    // 自分自身にKudosを送ることはできない
    if (receiverId === dbUser.id) {
      return NextResponse.json(
        { error: '自分自身にKudosを送ることはできません' },
        { status: 400 }
      );
    }

    const validCategories = ['TEAMWORK', 'INNOVATION', 'LEADERSHIP', 'PROBLEM_SOLVING', 'CUSTOMER_FOCUS', 'LEARNING', 'OTHER'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: '無効なカテゴリです' },
        { status: 400 }
      );
    }

    // Kudosを作成
    const kudos = await prisma.kudos.create({
      data: {
        senderId: dbUser.id,
        receiverId,
        message,
        category,
        isPublic: Boolean(isPublic),
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Slack通知を送信（非同期で実行）
    sendKudosNotification({
      receiverId: kudos.receiverId,
      senderName: kudos.sender.name,
      category: kudos.category,
      message: kudos.message,
    }).catch(error => {
      console.error('Failed to send Slack notification:', error);
    });

    // メール通知を送信（非同期で実行）
    sendKudosEmail({
      receiverEmail: kudos.receiver.email,
      receiverName: kudos.receiver.name,
      senderName: kudos.sender.name,
      category: kudos.category,
      message: kudos.message,
    }).catch(error => {
      console.error('Failed to send email notification:', error);
    });

    return NextResponse.json(kudos, { status: 201 });
  } catch (error) {
    console.error('Error creating kudos:', error);
    return NextResponse.json(
      { error: 'Kudosの作成に失敗しました' },
      { status: 500 }
    );
  }
}