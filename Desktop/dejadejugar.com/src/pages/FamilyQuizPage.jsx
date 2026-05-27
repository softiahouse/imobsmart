import QuizFlow from '../components/quiz/QuizFlow'
import { FAMILY_QUESTIONS } from '../quiz/questions'

export default function FamilyQuizPage() {
  return (
    <QuizFlow
      title="Teste para familiares"
      subtitle="Pense em uma pessoa próxima sobre a qual você está preocupado(a). Marque o que mais se aproxima da sua observação."
      questions={FAMILY_QUESTIONS}
      quizType="family"
    />
  )
}
