import { Link } from "react-router-dom";

export default function TermosPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0" }}>
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          fontFamily: "DM Sans, sans-serif",
          color: "#333",
          lineHeight: 1.75,
        }}
      >
        <Link
          to="/"
          style={{ color: "#3B6D11", fontSize: "0.88rem", textDecoration: "none" }}
        >
          ← Voltar
        </Link>

        <h1
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.8rem",
            margin: "1.5rem 0 0.5rem",
            color: "#1a1a1a",
          }}
        >
          Termo de Uso e Condições Gerais de Acesso
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "2.5rem" }}>
          Última atualização: 13 de abril de 2026 — Versão 1.0
        </p>

        {[
          {
            titulo: "Preâmbulo",
            texto:
              'O presente instrumento tem por objeto estabelecer os termos e condições gerais de acesso e utilização da plataforma digital PareDeJogar, mantida pelo Instituto ISTOP, doravante denominada simplesmente "PLATAFORMA", bem como disciplinar o relacionamento jurídico entre a instituição e os usuários dos serviços disponibilizados.',
          },
          {
            titulo: "Cláusula Primeira — Da Natureza Jurídica e Finalidade",
            texto: `A PLATAFORMA é operada pelo Instituto ISTOP, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº 430.629.970-87, com sede em Salvador Isais 1336, Santa Maria-RS, CEP 97015-015.

A INSTITUIÇÃO dedica-se ao desenvolvimento e aplicação do Método ISTOP (Intervenção Sistematizada para Tratamento de Dependência em Jogos Online), protocolo clínico-científico fundamentado em evidências para abordagem da dependência comportamental relacionada a jogos digitais, reconhecida pela OMS na CID-11 (Código 6C51).

Os serviços prestados possuem natureza informativa, educativa e de apoio comportamental, não substituindo diagnóstico médico, tratamento psiquiátrico especializado ou acompanhamento psicológico individualizado quando indicados.`,
          },
          {
            titulo: "Cláusula Segunda — Dos Destinatários e Requisitos de Acesso",
            texto: `Podem utilizar a PLATAFORMA: (a) pessoas físicas maiores de 18 anos, plenamente capazes; (b) menores de 18 anos, desde que assistidos por responsáveis legais; (c) profissionais de saúde, familiares e cuidadores.

O acesso pressupõe dispositivo eletrônico compatível, conexão à internet, navegador atualizado e endereço de e-mail válido.

É vedado o acesso por pessoas interditadas, usuários com acesso suspenso por descumprimento destes Termos ou pessoas que não concordem integralmente com as disposições aqui estabelecidas.`,
          },
          {
            titulo: "Cláusula Terceira — Do Cadastro e Autenticação",
            texto: `O acesso aos serviços especializados está condicionado à prévia realização de cadastro com informações verdadeiras, exatas, atuais e completas, incluindo nome completo, e-mail, senha segura, data de nascimento, CPF e informações clínicas relevantes quando aplicável.

O USUÁRIO é integralmente responsável pelo sigilo de suas credenciais e por todas as atividades realizadas sob seu cadastro.`,
          },
          {
            titulo: "Cláusula Quarta — Dos Serviços Disponibilizados",
            texto: `A PLATAFORMA disponibiliza: questionários de triagem, o Programa ISTOP estruturado em 5 etapas, materiais educativos, acompanhamento clínico (quando contratado), suporte para familiares e comunidade de apoio moderada por profissionais.

Os serviços não constituem atendimento de emergência. Em situações de crise ou risco, o USUÁRIO deve contatar: CVV — 188 (24h), SAMU — 192, ou UPA/Pronto-Socorro mais próximo.`,
          },
          {
            titulo: "Cláusula Quinta — Das Obrigações do Usuário",
            texto: `O USUÁRIO obriga-se a utilizar a PLATAFORMA exclusivamente para fins lícitos, fornecer informações clínicas verdadeiras, respeitar profissionais e demais usuários, e comunicar eventuais violações de segurança.

É expressamente proibido: uso comercial ou publicitário, acesso não autorizado a dados de terceiros, reprodução de conteúdos sem autorização, uso de ferramentas automatizadas, publicação de conteúdos ofensivos, simulação de identidade de terceiros e compartilhamento de credenciais.`,
          },
          {
            titulo: "Cláusula Sexta — Da Propriedade Intelectual",
            texto: `Todos os direitos sobre a PLATAFORMA — incluindo softwares, marcas, conteúdos, metodologias e o Método ISTOP — são de titularidade exclusiva da INSTITUIÇÃO, protegidos pela Lei nº 9.610/1998 e legislação correlata.

É concedida ao USUÁRIO licença pessoal, intransferível, não-exclusiva e revogável para uso da PLATAFORMA exclusivamente para fins pessoais e não-comerciais.`,
          },
          {
            titulo: "Cláusula Sétima — Da Proteção de Dados Pessoais",
            texto: `A INSTITUIÇÃO trata dados pessoais em conformidade com a LGPD (Lei nº 13.709/2018). Dados sensíveis relacionados à saúde são coletados com base no consentimento específico do titular.

Todos os profissionais vinculados estão sujeitos ao sigilo profissional previsto em seus respectivos Códigos de Ética, sendo vedada a divulgação de informações confidenciais, salvo nas hipóteses legais.`,
          },
          {
            titulo: "Cláusula Oitava — Da Responsabilidade Civil",
            texto: `A INSTITUIÇÃO responderá por danos causados quando configuradas falha no serviço, dano efetivo e nexo causal. A responsabilidade é excluída em casos de culpa exclusiva do USUÁRIO, caso fortuito, uso indevido ou informações falsas fornecidas.

Em qualquer hipótese, a responsabilidade total da INSTITUIÇÃO não excederá R$ 5.000,00, exceto em casos de dolo ou negligência grave comprovada.`,
          },
          {
            titulo: "Cláusula Nona — Da Modalidade de Contratação e Valores",
            texto:
              "A PLATAFORMA disponibiliza serviços gratuitos (questionários de tr...",
          },
        ].map((item) => (
          <section key={item.titulo} style={{ marginBottom: "1.8rem" }}>
            <h2
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "1.15rem",
                marginBottom: "0.45rem",
                color: "#1f1f1f",
              }}
            >
              {item.titulo}
            </h2>
            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{item.texto}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
