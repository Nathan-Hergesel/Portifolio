export const navigationItems = [
  { id: "projetos", label: "Projetos" },
  { id: "processo", label: "Processo" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "contato", label: "Contato" }
];

export const contactChannels = {
  email: "nathanhergesel15@gmail.com",
  whatsapp: "5515996746079",
  whatsappLabel: "+55 15 99674-6079"
};

// Opcoes do CTA final. `message` completa a frase da mensagem pre-preenchida do
// WhatsApp e do assunto do e-mail.
export const projectTopics = [
  { id: "site", label: "Site", message: "um site" },
  { id: "app", label: "App", message: "um aplicativo" },
  { id: "sistema", label: "Sistema", message: "um sistema" },
  { id: "identidade", label: "Identidade visual", message: "uma identidade visual" },
  { id: "video", label: "Vídeo", message: "um vídeo" },
  { id: "outro", label: "Ainda não sei", message: "uma ideia que ainda estou definindo" }
];

export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nathan-hergesel/",
    icon: "linkedin"
  },
  {
    label: "X",
    href: "https://x.com/Herisguel",
    icon: "x"
  },
  {
    label: "GitHub",
    href: "https://github.com/Nathan-Hergesel",
    icon: "github"
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hergesel.dev/",
    icon: "instagram"
  }
];

// Modos de pensamento do processo criativo. Cada um corresponde a uma camada da
// prancheta (CreativeProcess), entao a ordem aqui e a ordem da evolucao visual.
export const creativeModes = [
  {
    id: "escutar",
    index: "01",
    verb: "Escutar",
    lead: "Entender antes de desenhar.",
    description:
      "Conversa sobre negócio, público, objetivos e limites. A pergunta certa no começo economiza semanas de retrabalho depois.",
    artifacts: ["Briefing guiado", "Objetivos", "Restrições"]
  },
  {
    id: "referenciar",
    index: "02",
    verb: "Referenciar",
    lead: "Montar repertório.",
    description:
      "Concorrentes, referências visuais e a linguagem do seu público viram um mapa do que funciona e do que evitar.",
    artifacts: ["Moodboard", "Análise de concorrentes", "Tom de voz"]
  },
  {
    id: "esbocar",
    index: "03",
    verb: "Esboçar",
    lead: "Errar no papel, não no código.",
    description:
      "Rascunhos rápidos e caminhos alternativos decidem estrutura e hierarquia antes de qualquer investimento em detalhe.",
    artifacts: ["Wireframes", "Fluxos", "Rotas alternativas"]
  },
  {
    id: "refinar",
    index: "04",
    verb: "Refinar",
    lead: "Lapidar até encaixar.",
    description:
      "Tipografia, cor, movimento e conteúdo ajustados com você até a solução parecer a única possível.",
    artifacts: ["Protótipo", "Sistema visual", "Microinterações"]
  }
];

// `weight` e a fatia da regua de cronograma, proporcional a duracao tipica.
// Prazos de referencia para um site institucional; revisar se mudar o escopo padrao.
export const projectStages = [
  {
    id: "briefing",
    index: "01",
    title: "Briefing",
    duration: "1 a 3 dias",
    weight: 2,
    summary:
      "Conversa sobre objetivos, público, referências e restrições. Levanto o que precisa existir agora e o que pode esperar.",
    deliverables: ["Resumo do briefing", "Escopo inicial"],
    clientRole: "Contar o contexto e responder perguntas."
  },
  {
    id: "planejamento",
    index: "02",
    title: "Planejamento e direção",
    duration: "3 a 5 dias",
    weight: 4,
    summary:
      "Arquitetura de conteúdo, direção visual e cronograma. Escolhemos juntos o caminho antes de começar a produção.",
    deliverables: ["Proposta e cronograma", "Direção visual", "Mapa de páginas"],
    clientRole: "Aprovar a direção e enviar materiais."
  },
  {
    id: "producao",
    index: "03",
    title: "Produção",
    duration: "1 a 4 semanas",
    weight: 12,
    summary:
      "Design, desenvolvimento e conteúdo avançam em paralelo, com prévias frequentes em vez de uma grande revelação no fim.",
    deliverables: ["Prévias navegáveis", "Atualizações semanais"],
    clientRole: "Comentar as prévias."
  },
  {
    id: "validacao",
    index: "04",
    title: "Validação e refinamento",
    duration: "3 a 7 dias",
    weight: 5,
    summary:
      "Testes em diferentes telas e navegadores, revisão de textos, acessibilidade e desempenho, com ajustes finos a partir do seu retorno.",
    deliverables: ["Rodada de ajustes", "Checklist de qualidade"],
    clientRole: "Revisar e apontar ajustes."
  },
  {
    id: "entrega",
    index: "05",
    title: "Entrega e suporte",
    duration: "Lançamento e depois",
    weight: 4,
    summary:
      "Publicação, domínio e configuração final. Depois do lançamento sigo disponível para dúvidas, correções e evoluções.",
    deliverables: ["Projeto publicado", "Arquivos e acessos", "Suporte pós-entrega"],
    clientRole: "Usar, divulgar e contar como está indo."
  }
];

// Depoimentos reais, assinados pela empresa. `id` escolhe o icone do tipo de
// projeto em Testimonials.
export const testimonials = [
  {
    id: "vjs",
    quote:
      "Ficou perfeito, exatamente o que eu queria. Nunca trabalhei com um desenvolvedor tão bom, e aprecio muito o trabalho do Nathan.",
    author: "VJS Sistemas",
    role: "Automação para estacionamentos",
    project: "Site comercial"
  },
  {
    id: "morcegao",
    quote:
      "O trabalho ficou exatamente o que a gente buscava. O portal passa a sensação de um lugar acolhedor para os nossos funcionários.",
    author: "Supermercado Morcegão",
    role: "Portal interno",
    project: "Sistema"
  }
];
