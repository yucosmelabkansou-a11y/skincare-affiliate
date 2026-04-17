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
    <div className="max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-white via-white to-[#FDF5F8]">
      {/* プログレスバー */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#E9ECEF]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/diagnosis" className="text-xs text-[#6C757D] hover:text-[#4DB6AC]">
              ← トップへ
            </Link>
            <p className="text-[10px] tracking-[0.2em] text-[#C2185B] font-semibold">
              QUESTION {currentIndex + 1} / {questions.length}
            </p>
            <button
              onClick={handleReset}
              className="text-xs text-[#6C757D] hover:text-[#C2185B]"
              aria-label="最初からやり直す"
            >
              リセット
            </button>
          </div>
          <div className="h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4DB6AC 0%, #C2185B 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 質問本体 */}
      <div className="px-5 pt-8 pb-12">
        <div key={currentIndex} className="animate-fade-in">
          <h1 className="text-lg font-bold text-[#343A40] leading-relaxed mb-2">
            {currentQuestion.text}
          </h1>
          {currentQuestion.subtext && (
            <p className="text-xs text-[#6C757D] mb-6">{currentQuestion.subtext}</p>
          )}

          {/* 選択肢 */}
          <div className="space-y-2.5 mt-5">
            {currentQuestion.options.map((option, i) => {
              const isSelected = answers[currentIndex] === i
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#C2185B] bg-[#FDF2F6] shadow-sm'
                      : 'border-[#E9ECEF] bg-white hover:border-[#F2C4D6] hover:bg-[#FDF5F8]'
                  }`}
                >
                  {option.emoji && <span className="text-xl flex-shrink-0">{option.emoji}</span>}
                  <span
                    className={`text-sm leading-snug ${
                      isSelected ? 'text-[#343A40] font-semibold' : 'text-[#343A40]'
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
            <div className="mt-8 text-center">
              <button
                onClick={handleBack}
                className="text-xs text-[#6C757D] hover:text-[#4DB6AC] py-2 px-4"
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
