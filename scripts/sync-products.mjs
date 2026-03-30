/**
 * Google スプレッドシートから products.csv を同期するスクリプト
 *
 * 使い方:
 *   npm run sync
 *
 * 事前準備:
 *   1. Google スプレッドシートを開く
 *   2. メニュー「ファイル」→「共有」→「ウェブに公開」
 *   3. 「リンク」タブで「カンマ区切りの値（.csv）」を選択して「公開」
 *   4. 表示されたURLをコピーして、下の SHEET_CSV_URL に貼り付ける
 *
 * スプレッドシートのカラム順（1行目はヘッダー行）:
 *   A: id
 *   B: name
 *   C: brand
 *   D: tags        ← 複数タグはカンマ区切り（例: セラミド,乾燥,敏感肌）
 *   E: review
 *   F: image_filename
 *   G: amazon_url
 *   H: rakuten_url
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ============================================================
// ここにスプレッドシートの公開CSVのURLを貼り付けてください
// ============================================================
const SHEET_CSV_URL = 'YOUR_GOOGLE_SHEET_CSV_URL_HERE'
// ============================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'products.csv')

async function syncProducts() {
  if (SHEET_CSV_URL === 'YOUR_GOOGLE_SHEET_CSV_URL_HERE') {
    console.error('❌ SHEET_CSV_URL が設定されていません。')
    console.error('   scripts/sync-products.mjs を開いてURLを設定してください。')
    process.exit(1)
  }

  console.log('🔄 スプレッドシートからデータを取得中...')

  let csvText
  try {
    const res = await fetch(SHEET_CSV_URL)
    if (!res.ok) {
      throw new Error(`HTTPエラー: ${res.status} ${res.statusText}`)
    }
    csvText = await res.text()
  } catch (err) {
    console.error('❌ 取得に失敗しました:', err.message)
    console.error('   URLが正しいか、スプレッドシートが「ウェブに公開」されているか確認してください。')
    process.exit(1)
  }

  // 空チェック
  const lines = csvText.trim().split('\n').filter((l) => l.trim() !== '')
  if (lines.length < 2) {
    console.error('❌ データが空です。スプレッドシートに商品データが入力されているか確認してください。')
    process.exit(1)
  }

  // バックアップ
  if (fs.existsSync(OUTPUT_PATH)) {
    const backupPath = OUTPUT_PATH.replace('.csv', `.backup_${Date.now()}.csv`)
    fs.copyFileSync(OUTPUT_PATH, backupPath)
    console.log(`📦 バックアップ作成: ${path.basename(backupPath)}`)
  }

  // 書き込み
  fs.writeFileSync(OUTPUT_PATH, csvText, 'utf-8')

  const dataCount = lines.length - 1 // ヘッダー除く
  console.log(`✅ 同期完了！ ${dataCount} 件の商品データを更新しました。`)
  console.log(`   保存先: public/data/products.csv`)
}

syncProducts()
