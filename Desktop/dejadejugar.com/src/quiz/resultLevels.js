/** Faixas: 0–12, 13–24, 25–36, 37–48 */

export function getLevel(score) {
  if (score <= 12) {
    return {
      key: 'baixo',
      label: 'Baixo risco',
      color: '#3B6D11',
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
    color: '#993C1D',
  }
}

const copyPersonal = {
  baixo:
    'Seu resultado indica baixo risco neste momento. Isso não substitui uma avaliação clínica, mas é um bom sinal. Continue cuidando do seu tempo, das finanças e do bem-estar — e saiba que estamos aqui se quiser fortalecer hábitos saudáveis.',
  moderado:
    'Há sinais que merecem atenção. Muitas pessoas passam por fases de maior envolvimento sem perceber. Reconhecer isso já é um passo. Buscar informação, apoio e ferramentas pode ajudar a evitar que o padrão cresça.',
  alto:
    'Seu resultado aponta um nível de risco elevado: o jogo pode estar impactando várias áreas da sua vida. Você não está sozinho. Pedir ajuda é um ato de coragem — e existem caminhos baseados em ciência para recuperar o controle.',
  critico:
    'Seu resultado indica um nível crítico de urgência. Recomendamos fortemente buscar apoio profissional (saúde mental, serviços especializados) além do programa. O PareDeJogar pode complementar sua jornada com educação e estrutura, mas não substitui atendimento clínico quando necessário.',
}

const copyFamily = {
  baixo:
    'Com base nas respostas, o que você observa sugere baixo risco neste momento. Continue o diálogo com empatia e atenção. Se algo mudar ou se a preocupação crescer, voltar a avaliar e buscar orientação é sempre válido.',
  moderado:
    'O que você percebe indica sinais moderados que merecem atenção. Apoiar alguém com jogo problemático pede limites, escuta e, muitas vezes, ajuda especializada para a família. Você não precisa carregar isso sozinho.',
  alto:
    'Suas observações sugerem um impacto relevante na vida da pessoa e, possivelmente, da família. Buscar orientação — para ela e para vocês — pode fazer diferença. Cuidar de você também conta.',
  critico:
    'O resultado indica um cenário de alta preocupação. Priorize segurança emocional e financeira da família e considere apoio profissional urgente. O programa pode oferecer educação e ferramentas, mas situações graves exigem rede de saúde e serviços adequados.',
}

export function getResultMessage(levelKey, quizType) {
  const table = quizType === 'family' ? copyFamily : copyPersonal
  return table[levelKey] ?? copyPersonal[levelKey]
}
