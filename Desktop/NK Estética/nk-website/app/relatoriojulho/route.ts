import { NextResponse } from 'next/server'

const html = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NK Estética — Prestação de Contas</title>
<style>
  :root {
    --bg: #FAF8F5;
    --surface: #FFFFFF;
    --surface2: #F2EFE9;
    --border: #E0D9CF;
    --text: #1C1A17;
    --text2: #7A7268;
    --gold: #B8935A;
    --gold-light: #D4AA72;
    --danger: #C0392B;
    --danger-bg: #FDF2F0;
    --success: #2E7D52;
    --success-bg: #F0F7F3;
    --pending: #7A5C1E;
    --pending-bg: #FBF5E8;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0E0C0A;
      --surface: #181512;
      --surface2: #211D18;
      --border: #2E2820;
      --text: #F0EDE7;
      --text2: #8A8278;
      --gold: #C9A96E;
      --gold-light: #E0C088;
      --danger: #E05555;
      --danger-bg: #1F1210;
      --success: #5A9E6F;
      --success-bg: #0E1F15;
      --pending: #C9A030;
      --pending-bg: #1A1508;
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: Georgia, 'Times New Roman', serif;
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  .page { max-width: 820px; margin: 0 auto; }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid var(--gold);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .eyebrow {
    font-family: system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.4rem;
  }

  .clinic-name {
    font-size: 2rem;
    font-weight: normal;
    color: var(--text);
    line-height: 1.15;
  }

  .subtitle {
    font-family: system-ui, sans-serif;
    font-size: 0.82rem;
    color: var(--text2);
    margin-top: 0.4rem;
  }

  .header-date {
    font-family: system-ui, sans-serif;
    font-size: 0.78rem;
    color: var(--text2);
    text-align: right;
    white-space: nowrap;
  }

  .header-date strong {
    display: block;
    font-size: 1rem;
    color: var(--text);
    font-weight: 600;
    margin-bottom: 0.15rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem 1.25rem 1rem;
  }

  .stat-label {
    font-family: system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text2);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: normal;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .stat-value.gold { color: var(--gold); }
  .stat-value.danger { color: var(--danger); }

  .stat-sub {
    font-family: system-ui, sans-serif;
    font-size: 0.72rem;
    color: var(--text2);
    margin-top: 0.3rem;
  }

  .section-title {
    font-family: system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .deliverables {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .deliverable {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem 1.1rem;
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
  }

  .del-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--success-bg);
    border: 1px solid var(--success);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .del-title {
    font-family: system-ui, sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.2rem;
  }

  .del-desc {
    font-family: system-ui, sans-serif;
    font-size: 0.74rem;
    color: var(--text2);
    line-height: 1.5;
  }

  .del-hours {
    font-family: system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--gold);
    margin-top: 0.3rem;
  }

  .table-wrap { overflow-x: auto; margin-bottom: 1rem; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: system-ui, sans-serif;
    font-size: 0.82rem;
  }

  th {
    text-align: left;
    padding: 0.6rem 0.9rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text2);
    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 0.7rem 0.9rem;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }

  tr:last-child td { border-bottom: none; }

  .total-row td {
    font-weight: 700;
    border-top: 1px solid var(--gold);
    border-bottom: none;
    padding-top: 0.8rem;
    color: var(--gold);
  }

  .hours-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .hour-row {
    background: var(--surface2);
    border-radius: 4px;
    padding: 0.6rem 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: system-ui, sans-serif;
    font-size: 0.8rem;
  }

  .hour-label { color: var(--text2); }

  .hour-val {
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }

  .hour-total {
    grid-column: 1 / -1;
    background: var(--surface);
    border: 1px solid var(--gold);
    border-radius: 4px;
    padding: 0.75rem 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: system-ui, sans-serif;
    font-size: 0.9rem;
  }

  .hour-total .hour-label { color: var(--gold); font-weight: 600; }
  .hour-total .hour-val { color: var(--gold); font-size: 1.1rem; }

  .pending-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .pending-item {
    background: var(--pending-bg);
    border: 1px solid color-mix(in srgb, var(--pending) 30%, transparent);
    border-radius: 4px;
    padding: 0.7rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: system-ui, sans-serif;
    font-size: 0.82rem;
    color: var(--pending);
  }

  .pending-tag {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--pending) 15%, transparent);
    padding: 0.2rem 0.5rem;
    border-radius: 99px;
    white-space: nowrap;
  }

  .footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-family: system-ui, sans-serif;
    font-size: 0.72rem;
    color: var(--text2);
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 600px) {
    .stats { grid-template-columns: 1fr; }
    .deliverables { grid-template-columns: 1fr; }
    .hours-grid { grid-template-columns: 1fr; }
    .hour-total { grid-column: 1; }
    .header { flex-direction: column; }
    .header-date { text-align: left; }
    .footer { flex-direction: column; gap: 0.3rem; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="header-left">
      <div class="eyebrow">Prestação de Contas · Softiahouse</div>
      <h1 class="clinic-name">NK Medicina Estética</h1>
      <p class="subtitle">Relatório de serviços prestados</p>
    </div>
    <div class="header-date">
      <strong>15 jul 2026</strong>
      Início: 27 mai 2026
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Horas investidas</div>
      <div class="stat-value gold">47h+</div>
      <div class="stat-sub">desde 27 mai 2026</div>
    </div>
    <div class="stat">
      <div class="stat-label">Recebido até hoje</div>
      <div class="stat-value danger">€0</div>
      <div class="stat-sub">—</div>
    </div>
  </div>

  <div class="section-title">Entregas realizadas</div>
  <div class="deliverables">
    <div class="deliverable">
      <div class="del-icon">✓</div>
      <div class="del-body">
        <div class="del-title">Site profissional completo</div>
        <div class="del-desc">Next.js · bilíngue PT/ES · deploy VPS · galeria, serviços, contacto, WhatsApp float</div>
        <div class="del-hours">~25 horas</div>
      </div>
    </div>
    <div class="deliverable">
      <div class="del-icon">✓</div>
      <div class="del-body">
        <div class="del-title">Meta Business Manager</div>
        <div class="del-desc">Conta configurada · Instagram @clinicas.nk conectado · pagamento em Euro ativo</div>
        <div class="del-hours">~2 horas</div>
      </div>
    </div>
    <div class="deliverable">
      <div class="del-icon">✓</div>
      <div class="del-body">
        <div class="del-title">Campanha Botox + Lábios 299€</div>
        <div class="del-desc">Criativo · copy em espanhol · público 25-55 anos Torrevieja · WhatsApp CTA</div>
        <div class="del-hours">~3 horas</div>
      </div>
    </div>
    <div class="deliverable">
      <div class="del-icon">✓</div>
      <div class="del-body">
        <div class="del-title">Campanha Protocolo Glow NK 100€</div>
        <div class="del-desc">Criativo Hydrafacial · copy · configuração completa · troubleshooting EU</div>
        <div class="del-hours">~5 horas</div>
      </div>
    </div>
    <div class="deliverable">
      <div class="del-icon">✓</div>
      <div class="del-body">
        <div class="del-title">Reuniões presenciais (×3)</div>
        <div class="del-desc">Planeamento, aprovação de design e revisões estratégicas com a equipa NK</div>
        <div class="del-hours">6h+ presenciais</div>
      </div>
    </div>
    <div class="deliverable">
      <div class="del-icon">✓</div>
      <div class="del-body">
        <div class="del-title">Gestão e monitorização</div>
        <div class="del-desc">Acompanhamento de campanhas · troubleshooting pagamentos · relatórios</div>
        <div class="del-hours">~6 horas</div>
      </div>
    </div>
  </div>

  <div class="section-title">Resultado das campanhas</div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Campanha</th>
          <th>Gasto</th>
          <th>Impressões</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Botox + Lábios 299€</td>
          <td>€60,52</td>
          <td>~15.000</td>
          <td>Concluída</td>
        </tr>
        <tr>
          <td>Glow Facial 100€</td>
          <td>€40,91</td>
          <td>~10.800</td>
          <td>Concluída</td>
        </tr>
        <tr class="total-row">
          <td>Total investido pela NK</td>
          <td>€101,43</td>
          <td>~25.800</td>
          <td>+ leads WhatsApp</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pending-list" style="margin-bottom:2rem;">
    <div class="pending-item" style="flex-direction:column;align-items:flex-start;gap:0.3rem;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
        <strong>Cópias melhoradas e variações criadas</strong>
        <span class="pending-tag" style="background:color-mix(in srgb,#4ade80 15%,transparent);color:#4ade80;">Entregue</span>
      </div>
      <span style="font-size:0.78rem;opacity:0.8;">Múltiplas versões de anúncios duplicadas e otimizadas com novos textos, imagens e públicos segmentados — testes A/B prontos para ativar</span>
    </div>
    <div class="pending-item" style="flex-direction:column;align-items:flex-start;gap:0.3rem;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
        <strong>Troubleshooting restrições EU + pagamento</strong>
        <span class="pending-tag" style="background:color-mix(in srgb,#4ade80 15%,transparent);color:#4ade80;">Resolvido</span>
      </div>
      <span style="font-size:0.78rem;opacity:0.8;">Erros de Flow JSON, restrições Meta UE e falhas de cartão resolvidos — cartão da Natasha ativado e campanhas no ar</span>
    </div>
  </div>

  <div class="section-title">Horas por área</div>
  <div class="hours-grid">
    <div class="hour-row"><span class="hour-label">Reuniões presenciais</span><span class="hour-val">6h+</span></div>
    <div class="hour-row"><span class="hour-label">Planeamento e design</span><span class="hour-val">5h</span></div>
    <div class="hour-row"><span class="hour-label">Desenvolvimento do site</span><span class="hour-val">20h</span></div>
    <div class="hour-row"><span class="hour-label">Deploy VPS</span><span class="hour-val">3h</span></div>
    <div class="hour-row"><span class="hour-label">Meta Ads (setup + campanhas)</span><span class="hour-val">8h</span></div>
    <div class="hour-row"><span class="hour-label">Gestão e comunicação</span><span class="hour-val">5h</span></div>
    <div class="hour-total"><span class="hour-label">Total de horas</span><span class="hour-val">47h+</span></div>
  </div>

  <div class="section-title">Serviços em Fase de Construção</div>
  <div class="pending-list">
    <div class="pending-item" style="flex-direction:column;align-items:flex-start;gap:0.25rem;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
        <strong>Agente IA para WhatsApp</strong>
        <span class="pending-tag">Em aguardo</span>
      </div>
      <span style="font-size:0.76rem;opacity:0.8;">Iniciado, mas pausado — os tokens de IA estão a consumir créditos pessoais do Paulo. Retoma assim que houver investimento da clínica.</span>
    </div>
    <div class="pending-item" style="flex-direction:column;align-items:flex-start;gap:0.25rem;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
        <strong>Postagem automática nas redes sociais</strong>
        <span class="pending-tag">Em aguardo</span>
      </div>
      <span style="font-size:0.76rem;opacity:0.8;">Iniciado, mas pausado — a geração de conteúdo via IA também consome tokens da conta pessoal do Paulo. Aguarda investimento para retomar.</span>
    </div>
    <div class="pending-item" style="flex-direction:column;align-items:flex-start;gap:0.25rem;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
        <strong>Meta Pixel + CRM de agendamentos</strong>
        <span class="pending-tag">Em aguardo</span>
      </div>
      <span style="font-size:0.76rem;opacity:0.8;">O Pixel sozinho não basta: é necessário integrar um CRM para identificar quantos leads agendam, quantos fecham e por qual motivo não fecham — decisão estratégica que requer alinhamento com a clínica.</span>
    </div>
    <div class="pending-item" style="flex-direction:column;align-items:flex-start;gap:0.25rem;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
        <strong>Criativos em 3 formatos (1:1, 4:5, 9:16)</strong>
        <span class="pending-tag">Em aguardo</span>
      </div>
      <span style="font-size:0.76rem;opacity:0.8;">Briefing preparado. Aguarda material visual e aprovação da clínica para produção pelo designer.</span>
    </div>
  </div>

  <div class="footer">
    <span>Softiahouse · softiahouse@gmail.com</span>
    <span>Gerado em 15 jul 2026</span>
  </div>

</div>
</body>
</html>`

export async function GET() {
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
