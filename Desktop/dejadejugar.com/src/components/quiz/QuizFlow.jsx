import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SCALE_OPTIONS } from '../../quiz/questions'
import '../../quiz/quiz.css'

/**
 * @param {{ title: string, subtitle?: string, questions: string[], quizType: 'personal' | 'family' }} props
 */
export default function QuizFlow({ title, subtitle, questions, quizType }) {
  const navigate = useNavigate()
  const total = questions.length
  const [answers, setAnswers] = useState([])

  const index = answers.length
  const answered = answers.length
  const progress = total > 0 ? (answered / total) * 100 : 0

  const handleSelect = (value) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const next = [...answers, value]
    if (next.length === total) {
      const score = next.reduce((a, b) => a + b, 0)
      navigate('/resultado', { state: { score, quizType } })
    } else {
      setAnswers(next)
    }
  }

  const q = questions[index]

  return (
    <div className="quiz-shell">
      <div className="quiz-inner">
        <h1 className="quiz-title">{title}</h1>
        {subtitle ? <p className="quiz-sub">{subtitle}</p> : null}

        <div className="quiz-progress-wrap">
          <div className="quiz-progress-label">
            <span>Progresso</span>
            <span>
              {answered} de {total}
            </span>
          </div>
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="quiz-card">
          <p className="quiz-q-index">
            Pergunta {index + 1} de {total}
          </p>
          <p className="quiz-question-text">{q}</p>
          <p className="quiz-scale-legend">Escala: 0 = Nunca · 4 = Quase sempre</p>
          <div className="quiz-options">
            {SCALE_OPTIONS.map(({ value, label }) => (
              <button key={value} type="button" className="quiz-option" onClick={() => handleSelect(value)}>
                <span className="quiz-option-num">{value}</span>
                <span>
                  <strong>{label}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
