import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithOrganization } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma';
import { generateEvaluations } from '@/services/evaluation.service';

interface RouteParams {
  params: {
    id: string;
  };
}

// 特定の評価サイクル取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser } = await requireAuthWithOrganization();

    const cycle = await prisma.evaluationCycle.findFirst({
      where: {
        id: params.id,
        organizationId: dbUser.organizationId,
      },
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
        evaluations: {
          include: {
            evaluatee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            evaluator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            evaluations: true,
          },
        },
      },
    });

    if (!cycle) {
      return NextResponse.json(
        { error: '評価サイクルが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(cycle);
  } catch (error) {
    console.error('Error fetching evaluation cycle:', error);
    return NextResponse.json(
      { error: '評価サイクルの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 評価サイクル更新
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser } = await requireAuthWithOrganization();

    // 管理者またはマネージャーのみ更新可能
    if (dbUser.role !== 'ADMIN' && dbUser.role !== 'MANAGER') {
      return NextResponse.json(
        { error: '評価サイクルの更新権限がありません' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, startDate, endDate, status } = body;

    const cycle = await prisma.evaluationCycle.findFirst({
      where: {
        id: params.id,
        organizationId: dbUser.organizationId,
      },
    });

    if (!cycle) {
      return NextResponse.json(
        { error: '評価サイクルが見つかりません' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (status) updateData.status = status;

    const updatedCycle = await prisma.evaluationCycle.update({
      where: { id: params.id },
      data: updateData,
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(updatedCycle);
  } catch (error) {
    console.error('Error updating evaluation cycle:', error);
    return NextResponse.json(
      { error: '評価サイクルの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// 評価サイクル削除
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser } = await requireAuthWithOrganization();

    // 管理者のみ削除可能
    if (dbUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '評価サイクルの削除権限がありません' },
        { status: 403 }
      );
    }

    const cycle = await prisma.evaluationCycle.findFirst({
      where: {
        id: params.id,
        organizationId: dbUser.organizationId,
      },
    });

    if (!cycle) {
      return NextResponse.json(
        { error: '評価サイクルが見つかりません' },
        { status: 404 }
      );
    }

    // アクティブなサイクルは削除不可
    if (cycle.status === 'ACTIVE') {
      return NextResponse.json(
        { error: 'アクティブな評価サイクルは削除できません' },
        { status: 400 }
      );
    }

    await prisma.evaluationCycle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting evaluation cycle:', error);
    return NextResponse.json(
      { error: '評価サイクルの削除に失敗しました' },
      { status: 500 }
    );
  }
}