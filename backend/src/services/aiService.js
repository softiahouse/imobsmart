const db = require('../database');

let OpenAI;
try {
  OpenAI = require('openai').default || require('openai');
} catch (e) {
  // OpenAI não instalado ainda
}

async function generateAIResponse(tenantId, conversationHistory, incomingMessage) {
  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(tenantId);
  if (!tenant || !tenant.ai_enabled || !tenant.openai_api_key) {
    return null;
  }

  // Verificar regras customizadas primeiro
  const rules = db.prepare('SELECT * FROM ai_rules WHERE tenant_id = ? AND active = 1').all(tenantId);
  for (const rule of rules) {
    if (rule.trigger_keyword && incomingMessage.toLowerCase().includes(rule.trigger_keyword.toLowerCase())) {
      return rule.response;
    }
  }

  // Usar OpenAI
  if (!OpenAI) return null;

  try {
    const client = new OpenAI({ apiKey: tenant.openai_api_key });

    const messages = [
      { role: 'system', content: tenant.ai_prompt },
      ...conversationHistory.slice(-10).map(m => ({
        role: m.from_me ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: incomingMessage },
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Erro OpenAI:', error.message);
    return null;
  }
}

module.exports = { generateAIResponse };
