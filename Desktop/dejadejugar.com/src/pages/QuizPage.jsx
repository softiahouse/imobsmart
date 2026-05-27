import QuizFlow from '../components/quiz/QuizFlow'
import { PERSONAL_QUESTIONS } from '../quiz/questions'

export default function QuizPage() {
  return (
    <QuizFlow
      title="Autoevaluación personal"
      subtitle="Responde con sinceridad. No hay respuestas correctas o incorrectas — el objetivo es claridad sobre tu momento."
      questions={PERSONAL_QUESTIONS}
      quizType="personal"
    />
  )
}
