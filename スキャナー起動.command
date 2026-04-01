#!/bin/bash
# ================================================
# 🌸 商品写真自動スキャナー 起動スクリプト
# このファイルをダブルクリックして起動してください
# ================================================

cd "$(dirname "$0")"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  🌸 商品写真自動スキャナー 起動中...      ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📦 必要なパッケージを確認・インストール中..."

# Homebrewのpip3を優先して使う（macOSのシステムPythonより安定）
PIP3=$(which pip3)
PYTHON3=$(which python3)

$PIP3 install google-generativeai watchdog Pillow --quiet 2>/dev/null
if [ $? -ne 0 ]; then
    $PIP3 install google-generativeai watchdog Pillow --quiet --break-system-packages 2>/dev/null || \
    $PIP3 install google-generativeai watchdog Pillow --quiet --user
fi

# pillow-heifは任意（なくてもsipsで対応可能）
$PIP3 install pillow-heif --quiet 2>/dev/null || true

echo "✅ パッケージ確認完了"
echo ""
echo "🔍 HEIC変換方法: macOS sips を使用します（iPhoneの写真対応）"
echo ""

# スクリプト実行
$PYTHON3 scripts/product_scanner.py

EXIT_CODE=$?
echo ""
if [ $EXIT_CODE -ne 0 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ エラーが発生しました（上記のメッセージを確認）"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "✅ 正常に終了しました"
fi

echo ""
echo "このウィンドウを閉じるには何かキーを押してください..."
read -n 1
