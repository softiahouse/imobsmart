/** Rangos: 0–12, 13–24, 25–36, 37–48 */

export function getLevel(score) {
  if (score <= 12) {
    return {
      key: 'baixo',
      label: 'Bajo riesgo',
      color: '#1A3A6B',
    }
  }
  if (score <= 24) {
    return {
      key: 'moderado',
      label: 'Moderado',
      color: '#BA7517',
    }
  }
  if (score <= 36) {
    return {
      key: 'alto',
      label: 'Alto',
      color: '#D85A30',
    }
  }
  return {
    key: 'critico',
    label: 'Crítico',
    color: '#C8962A',
  }
}

const copyPersonal = {
  baixo:
    'Tu resultado indica bajo riesgo en este momento. No sustituye una evaluación clínica, pero es una buena señal. Sigue cuidando tu tiempo, tus finanzas y tu bienestar — y sabe que estamos aquí si quieres reforzar hábitos saludables.',
  moderado:
    'Hay señales que merecen atención. Muchas personas pasan por etapas de mayor implicación sin darse cuenta. Reconocerlo ya es un paso. Buscar información, apoyo y herramientas puede ayudar a evitar que el patrón crezca.',
  alto:
    'Tu resultado apunta a un nivel de riesgo elevado: el juego puede estar impactando varias áreas de tu vida. No estás solo. Pedir ayuda es un acto de valentía — y existen caminos basados en ciencia para recuperar el control.',
  critico:
    'Tu resultado indica un nivel crítico de urgencia. Recomendamos encarecidamente buscar apoyo profesional (salud mental, servicios especializados) además del programa. El DejaDeJugar puede complementar tu camino con educación y estructura, pero no sustituye atención clínica cuando es necesaria.',
}

const copyFamily = {
  baixo:
    'En base a tus respuestas, lo que observas sugiere bajo riesgo en este momento. Mantén el diálogo con empatía y atención. Si algo cambia o la preocupación crece, volver a evaluar y buscar orientación siempre es válido.',
  moderado:
    'Lo que percibes indica señales moderadas que merecen atención. Apoyar a alguien con juego problemático requiere límites, escucha y, muchas veces, ayuda especializada para la familia. No tienes que cargar esto solo.',
  alto:
    'Tus observaciones sugieren un impacto relevante en la vida de esa persona y, posiblemente, de la familia. Buscar orientación — para ella y para vosotros — puede marcar la diferencia. Cuidarte también cuenta.',
  critico:
    'El resultado indica un escenario de alta preocupación. Prioriza la seguridad emocional y financiera de la familia y considera apoyo profesional urgente. El programa puede ofrecer educación y herramientas, pero las situaciones graves requieren una red de salud y servicios adecuados.',
}

export function getResultMessage(levelKey, quizType) {
  const table = quizType === 'family' ? copyFamily : copyPersonal
  return table[levelKey] ?? copyPersonal[levelKey]
}
