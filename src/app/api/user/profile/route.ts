import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithOrganization } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { dbUser } = await requireAuthWithOrganization();

    const body = (await request.json()) as { name?: unknown };
    const { name } = body;

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: '名前は必須です' }, { status: 400 });
    }

    // ユーザープロフィールを更新
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    logError(error as Error, 'PUT /api/user/profile');
    return NextResponse.json({ error: 'プロフィールの更新に失敗しました' }, { status: 500 });
  }
}
