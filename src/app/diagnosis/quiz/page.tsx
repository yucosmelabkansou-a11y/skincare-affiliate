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
        background: `
          radial-gradient(60% 60% at 80% 5%, oklch(0.96 0.025 30 / .5), transparent 70%),
          radial-gradient(50% 60% at 10% 95%, oklch(0.97 0.02 80 / .7), transparent 70%),
          linear-gradient(180deg, var(--bg-ivory) 0%, var(--bg-cream) 60%, var(--bg-warm) 100%)
        `,
      }}
    >
      {/* プログレスバー */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md"
        style={{
          background: 'oklch(0.985 0.008 85 / 0.9)',
          borderBottom: '1px solid var(--line-soft)',
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/diagnosis"
              className="transition-opacity hover:opacity-70"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--ink-mute)',
              }}
            >
              ← トップへ
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '0.32em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              Question {String(currentIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
            </p>
            <button
              onClick={handleReset}
              className="transition-opacity hover:opacity-70"
              aria-label="最初からやり直す"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--ink-mute)',
              }}
            >
              reset
            </button>
          </div>
          <div
            className="h-[2px] overflow-hidden"
            style={{ background: 'var(--line-soft)' }}
          >
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, var(--gold) 0%, var(--gold-deep) 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 質問本体 */}
      <div className="px-5 pt-12 pb-16">
        <div key={currentIndex} className="animate-fade-in">
          {/* eyebrow rule */}
          <div
            className="flex items-center justify-center gap-3 mb-5"
            aria-hidden
          >
            <span
              className="block w-7 h-px"
              style={{ background: 'var(--gold)' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '0.42em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              Q. {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span
              className="block w-7 h-px"
              style={{ background: 'var(--gold)' }}
            />
          </div>

          <h1
            className="text-center mx-auto"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 'clamp(17px, 4.6vw, 21px)',
              lineHeight: 1.7,
              letterSpacing: '0.08em',
              color: 'var(--ink)',
              wordBreak: 'keep-all',
              maxWidth: '24ch',
            }}
          >
            {currentQuestion.text}
          </h1>
          {currentQuestion.subtext && (
            <p
              className="text-center mt-3"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 12,
                letterSpacing: '0.12em',
                color: 'var(--ink-mute)',
              }}
            >
              — {currentQuestion.subtext} —
            </p>
          )}

          {/* 選択肢 */}
          <div className="space-y-2.5 mt-9 max-w-md mx-auto">
            {currentQuestion.options.map((option, i) => {
              const isSelected = answers[currentIndex] === i
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-5 py-4 transition-all active:scale-[0.98] flex items-center gap-3"
                  style={
                    isSelected
                      ? {
                          background: '#fff',
                          border: '1px solid var(--gold)',
                          boxShadow:
                            '0 14px 32px -22px oklch(0.5 0.06 70 / .35)',
                        }
                      : {
                          background: '#fff',
                          border: '1px solid var(--line-soft)',
                        }
                  }
                >
                  {/* 選択番号 (絵文字の代わりにエディトリアルなナンバリング) */}
                  <span
                    className="flex-shrink-0"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      fontSize: 13,
                      letterSpacing: '0.04em',
                      color: isSelected ? 'var(--gold-deep)' : 'var(--ink-mute)',
                      width: 24,
                    }}
                  >
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-jp)',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      letterSpacing: '0.06em',
                      color: 'var(--ink)',
                    }}
                  >
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 戻るボタン */}
          {currentIndex > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={handleBack}
                className="transition-opacity hover:opacity-70 py-2 px-4"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  color: 'var(--ink-mute)',
                }}
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
