import QuizFlow from '../components/quiz/QuizFlow'
import { PERSONAL_QUESTIONS } from '../quiz/questions'

export default function QuizPage() {
  return (
    <QuizFlow
      title="Autoavaliação pessoal"
      subtitle="Responda com sinceridade. Não há respostas certas ou erradas — o objetivo é clareza sobre o seu momento."
      questions={PERSONAL_QUESTIONS}
      quizType="personal"
    />
  )
}
