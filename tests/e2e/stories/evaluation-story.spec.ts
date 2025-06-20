/**
 * 評価機能のストーリーベーステスト
 */

import { describeStory, testCriteria } from '../utils/story-test';
import { evaluationStories } from '@/lib/user-stories/stories/evaluation-stories';
import { expect } from '@playwright/test';
import { mockAuth } from '../auth/mock-auth';

// ストーリー: EVAL-001 - 自己評価の入力
const selfEvaluationStory = evaluationStories.find(s => s.id === 'EVAL-001')!;

describeStory(selfEvaluationStory, () => {
  // AC-001-1: アクティブな評価サイクルが存在する時、評価フォームが表示される
  testCriteria(selfEvaluationStory.acceptanceCriteria[0], async ({ page }) => {
    // 従業員としてログイン
    await mockAuth(page, 'member');
    
    // 評価ページにアクセス
    await page.goto('/evaluations');
    
    // アクティブな評価サイクルの確認
    await expect(page.locator('[data-testid="active-cycle-card"]')).toBeVisible();
    
    // 自己評価ボタンが表示される
    await expect(page.locator('text=自己評価を開始')).toBeVisible();
  });

  // AC-001-2: 入力内容が自動保存される
  testCriteria(selfEvaluationStory.acceptanceCriteria[1], async ({ page }) => {
    await mockAuth(page, 'member');
    await page.goto('/evaluations/test-eval-id');
    
    // 総合評価を入力
    await page.locator('[data-rating="4"]').click();
    
    // コメントを入力
    await page.fill('#overallComments', 'テスト評価コメント');
    
    // 5秒待機（自動保存のタイミング）
    await page.waitForTimeout(5500);
    
    // 保存インジケーターの確認
    await expect(page.locator('text=保存済み')).toBeVisible();
  });

  // AC-001-3: 評価を送信できる
  testCriteria(selfEvaluationStory.acceptanceCriteria[2], async ({ page }) => {
    await mockAuth(page, 'member');
    await page.goto('/evaluations/test-eval-id');
    
    // 必須項目を入力
    await page.locator('[data-rating="4"]').click();
    await page.fill('#overallComments', 'この期間の成果について...');
    
    // コンピテンシー評価も入力
    await page.locator('text=コンピテンシー評価').click();
    await page.locator('[data-competency-rating="1"]').first().click();
    
    // 確認画面へ
    await page.locator('text=確認・送信').click();
    
    // 送信ボタンをクリック
    await page.locator('button:has-text("評価を送信")').click();
    
    // 確認メッセージ
    await expect(page.locator('text=評価を送信しました')).toBeVisible();
  });
});

// ストーリー: EVAL-002 - 部下の評価レビュー
const managerReviewStory = evaluationStories.find(s => s.id === 'EVAL-002')!;

describeStory(managerReviewStory, () => {
  // AC-002-1: レビュー待ちの評価が表示される
  testCriteria(managerReviewStory.acceptanceCriteria[0], async ({ page }) => {
    // マネージャーとしてログイン
    await mockAuth(page, 'manager');
    
    // 評価一覧ページへ
    await page.goto('/evaluations');
    
    // レビュー待ちタブをクリック
    await page.locator('text=レビュー待ち').click();
    
    // 提出済み評価が表示される
    await expect(page.locator('[data-status="SUBMITTED"]')).toBeVisible();
  });

  // AC-002-2: 評価を承認できる
  testCriteria(managerReviewStory.acceptanceCriteria[1], async ({ page }) => {
    await mockAuth(page, 'manager');
    await page.goto('/evaluations/submitted-eval-id/results');
    
    // レビューボタンをクリック
    await page.locator('button:has-text("レビュー")').click();
    
    // 承認ボタンをクリック
    await page.locator('button:has-text("承認")').click();
    
    // ステータス更新の確認
    await expect(page.locator('[data-status="REVIEWED"]')).toBeVisible();
  });

  // AC-002-3: 評価を差し戻しできる
  testCriteria(managerReviewStory.acceptanceCriteria[2], async ({ page }) => {
    await mockAuth(page, 'manager');
    await page.goto('/evaluations/submitted-eval-id/results');
    
    // レビューボタンをクリック
    await page.locator('button:has-text("レビュー")').click();
    
    // コメントを入力
    await page.fill('textarea[placeholder*="理由"]', '具体例をもう少し追加してください');
    
    // 差し戻しボタンをクリック
    await page.locator('button:has-text("差し戻し")').click();
    
    // ステータスがDRAFTに戻る
    await expect(page.locator('[data-status="DRAFT"]')).toBeVisible();
  });
});