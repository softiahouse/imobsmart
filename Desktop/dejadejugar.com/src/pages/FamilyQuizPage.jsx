import QuizFlow from '../components/quiz/QuizFlow'
import { FAMILY_QUESTIONS } from '../quiz/questions'

export default function FamilyQuizPage() {
  return (
    <QuizFlow
      title="Test para familiares"
      subtitle="Piensa en alguien cercano por quien te preocupas. Marca lo que más se aproxima a tu observación."
      questions={FAMILY_QUESTIONS}
      quizType="family"
    />
  )
}
