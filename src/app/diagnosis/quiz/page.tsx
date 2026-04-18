'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { questions, calculateResult, type Answers } from '@/lib/diagnosis'

const STORAGE_KEY = 'yun_skincare_diagnosis_answers'

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>([])
  const [hydrated, setHydrated] = useState(false)

  // localStorage から復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setAnswers(parsed)
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // 回答を保存
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    } catch {
      // ignore
    }
  }, [answers, hydrated])

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + (answers[currentIndex] !== undefined ? 1 : 0)) / questions.length) * 100

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setAnswers(newAnswers)

    // 0.4秒後に次へ
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // 結果計算してページ遷移
        const result = calculateResult(newAnswers)
        const params = new URLSearchParams()
        if (result.concern) params.set('concern', result.concern)
        const query = params.toString()
        router.push(`/diagnosis/result/${result.primaryType}${query ? `?${query}` : ''}`)
      }
    }, 350)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    if (confirm('診断を最初からやり直しますか？')) {
      setAnswers([])
      setCurrentIndex(0)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }
  }

  if (!hydrated) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-sm text-[#6C757D]">準備中…</div>
      </div>
    )
  }

  return (
    <div
      className="max-w-2xl mx-auto min-h-screen"
      style={{
        background:
          'linear-gradient(180deg, #FDF5F8 0%, #FAF0F2 50%, #F5EDE8 100%)',
      }}
    >
      {/* プログレスバー */}
      <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-[#F2EAEF]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/diagnosis" className="text-xs text-[#9B8E94] hover:text-[#C2185B] font-serif italic">
              ← トップへ
            </Link>
            <p className="text-[10px] tracking-[0.3em] text-[#D4829E] font-serif">
              QUESTION {String(currentIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
            </p>
            <button
              onClick={handleReset}
              className="text-xs text-[#9B8E94] hover:text-[#C2185B] font-serif italic"
              aria-label="最初からやり直す"
            >
              reset
            </button>
          </div>
          <div className="h-[3px] bg-[#F2EAEF] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #D4829E 0%, #C2185B 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 質問本体 */}
      <div className="px-5 pt-10 pb-16">
        <div key={currentIndex} className="animate-fade-in">
          {/* 装飾ドット */}
          <div className="text-center text-[10px] tracking-[0.5em] text-[#D4829E] mb-4" aria-hidden>
            · · ·
          </div>

          <h1 className="text-lg font-bold text-[#4A3F45] leading-relaxed mb-2 text-center">
            {currentQuestion.text}
          </h1>
          {currentQuestion.subtext && (
            <p className="text-xs text-[#9B8E94] mb-6 text-center font-serif italic">
              — {currentQuestion.subtext} —
            </p>
          )}

          {/* 選択肢 */}
          <div className="space-y-2.5 mt-7">
            {currentQuestion.options.map((option, i) => {
              const isSelected = answers[currentIndex] === i
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#C2185B] bg-white shadow-[0_4px_20px_rgba(212,130,158,0.18)]'
                      : 'border-[#F2EAEF] bg-white/80 hover:border-[#E8C7D4] hover:bg-white'
                  }`}
                >
                  {option.emoji && <span className="text-xl flex-shrink-0">{option.emoji}</span>}
                  <span
                    className={`text-sm leading-snug ${
                      isSelected ? 'text-[#4A3F45] font-semibold' : 'text-[#4A3F45]'
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 戻るボタン */}
          {currentIndex > 0 && (
            <div className="mt-9 text-center">
              <button
                onClick={handleBack}
                className="text-xs text-[#9B8E94] hover:text-[#C2185B] py-2 px-4 font-serif italic transition-colors"
              >
                ← 前の質問に戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
