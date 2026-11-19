import type { Community, DemoData, EventItem, Opportunity, Project, User } from './domain'

const students = [
  ['Ana Luiza Martins', 'Tecnologia em Análise e Desenvolvimento de Sistemas', 'Tecnologia', ['React', 'TypeScript', 'Figma'], ['Figma', 'VS Code', 'Git']],
  ['Lucas Ribeiro', 'Programador Full Stack', 'Tecnologia', ['JavaScript', 'Node.js', 'SQL'], ['VS Code', 'GitHub', 'Postman']],
  ['Marina Costa', 'Design Gráfico', 'Design', ['Figma', 'Branding', 'Illustrator'], ['Figma', 'Illustrator', 'Photoshop']],
  ['Rafael Nunes', 'Técnico em Administração', 'Gestão', ['Excel', 'Power BI', 'Organização'], ['Excel', 'Power BI', 'Trello']],
  ['Isabela Fernandes', 'Gastronomia', 'Gastronomia', ['Confeitaria', 'Food styling', 'Custos'], ['Canva', 'Excel', 'Lightroom']],
  ['Pedro Henrique Alves', 'Programador de Sistemas', 'Tecnologia', ['Python', 'Django', 'PostgreSQL'], ['Python', 'Git', 'Docker']],
  ['Beatriz Souza', 'Marketing Digital', 'Comunicação', ['SEO', 'Conteúdo', 'Analytics'], ['Canva', 'Google Analytics', 'CapCut']],
  ['Caio Mendes', 'Design de Interfaces', 'Design', ['UX Research', 'Figma', 'Prototipação'], ['Figma', 'FigJam', 'Notion']],
  ['Luana Oliveira', 'Técnico em Enfermagem', 'Saúde', ['Acolhimento', 'Primeiros socorros', 'Comunicação'], ['Microsoft 365', 'Canva']],
  ['Gabriel Rocha', 'Logística', 'Logística', ['Excel', 'Estoque', 'Análise de dados'], ['Excel', 'Power BI', 'SAP']],
  ['Sofia Lima', 'Fotografia e Vídeo', 'Comunicação', ['Fotografia', 'Edição', 'Storytelling'], ['Lightroom', 'Premiere', 'CapCut']],
  ['Davi Martins', 'Programador Front-end', 'Tecnologia', ['React', 'CSS', 'Acessibilidade'], ['React', 'VS Code', 'Figma']],
  ['Clara Monteiro', 'Gestão Comercial', 'Comércio', ['Vendas', 'Atendimento', 'Negociação'], ['HubSpot', 'Excel', 'Canva']],
  ['Enzo Carvalho', 'Desenvolvimento Web', 'Tecnologia', ['React', 'Python', 'API REST'], ['GitHub', 'VS Code', 'Postman']],
  ['Júlia Cardoso', 'Estética e Cosmética', 'Beleza', ['Atendimento', 'Biossegurança', 'Visagismo'], ['Canva', 'Instagram']],
  ['Vitor Azevedo', 'Administração', 'Gestão', ['Excel', 'Gestão de projetos', 'Power BI'], ['Excel', 'Power BI', 'Trello']],
  ['Helena Duarte', 'Design Gráfico', 'Design', ['Ilustração', 'Identidade visual', 'Figma'], ['Illustrator', 'Figma', 'Procreate']],
  ['Miguel Freitas', 'Programador Full Stack', 'Tecnologia', ['JavaScript', 'React', 'Firebase'], ['VS Code', 'Firebase', 'GitHub']],
  ['Alice Barros', 'Gastronomia', 'Gastronomia', ['Cozinha brasileira', 'Ficha técnica', 'Confeitaria'], ['Excel', 'Canva', 'Lightroom']],
  ['Theo Gonçalves', 'Marketing Digital', 'Comunicação', ['Social media', 'Copywriting', 'SEO'], ['Canva', 'Meta Business Suite', 'Notion']],
] as const

const cities = ['Chapecó', 'Joinville', 'Florianópolis', 'Blumenau', 'Criciúma', 'Lages', 'Itajaí', 'São Miguel do Oeste']
const coverColors = ['#f2eafb', '#fff1d4', '#fce8f3', '#e8e2f2', '#f4edfb', '#f5f1f8']
const units = ['Senac Chapecó', 'Senac Florianópolis', 'Senac Joinville', 'Senac Blumenau', 'Senac Criciúma']

const studentUsers: User[] = students.map(([name, course, area, skills, tools], index) => ({
  id: `student-${index + 1}`,
  name,
  role: 'student',
  email: `estudante${index + 1}@vibeup.demo`,
  city: cities[index % cities.length],
  unit: units[index % units.length],
  course,
  area,
  avatar: '',
  cover: coverColors[index % coverColors.length],
  bio: `${area} em formação, com vontade de transformar aprendizado em projetos com impacto.`,
  skills: [...skills],
  tools: [...tools],
  interests: [area, index % 2 ? 'colaboração' : 'tecnologia', 'aprendizado prático'],
  availability: (['Estágio', 'Projetos', 'Emprego', 'Estágio'] as const)[index % 4],
  connections: 18 + index * 3,
  online: index < 5,
  createdAt: index < 8 ? `2026-09-${String(1 + index).padStart(2, '0')}` : index < 15 ? `2026-10-${String(index - 7).padStart(2, '0')}` : `2026-11-${String(index - 14).padStart(2, '0')}`,
}))

const companies: User[] = [
  ['NorteLab Tecnologia', 'Tecnologia', 'Chapecó'],
  ['Estúdio Brava', 'Design', 'Florianópolis'],
  ['Verde Campo Alimentos', 'Gastronomia', 'Chapecó'],
  ['Ponte Gestão', 'Gestão', 'Joinville'],
  ['Clínica Aurora', 'Saúde', 'Blumenau'],
  ['Rota Sul Logística', 'Logística', 'Itajaí'],
].map(([name, area, city], index) => ({
  id: `company-${index + 1}`, name, role: 'company', email: `talentos${index + 1}@empresa.demo`, city,
  unit: 'Santa Catarina', course: 'Empresa parceira', area, avatar: '', cover: coverColors[(index + 2) % coverColors.length],
  bio: `Empresa fictícia de ${area.toLocaleLowerCase('pt-BR')} que acredita em talentos em formação.`,
  skills: [], tools: [], interests: [area, 'estágio', 'projetos'], availability: 'Não informado', connections: 72 + index * 8,
  createdAt: `2026-10-${String(10 + index).padStart(2, '0')}`,
}))

const projectTitles = [
  'Painel de indicadores para pequenos negócios', 'Identidade visual Feira do Oeste', 'App de receitas sem desperdício',
  'Site acessível para serviços locais', 'Campanha Jovens que Criam', 'Organização inteligente de estoque',
  'Portfólio interativo de fotografia', 'Protótipo de agenda de saúde', 'Landing page para cafeteria de bairro',
  'Dashboard de vendas regional', 'Guia de primeiros passos em React', 'Embalagem sustentável Raízes',
  'Catálogo digital de artesanato', 'Sistema de reservas para eventos', 'Plano de conteúdo para negócios locais',
  'Mapa de trilhas e turismo do Oeste', 'Ficha técnica digital de cozinha', 'Experiência de onboarding inclusiva',
  'Chat de apoio para estudos', 'Campanha de prevenção e cuidado', 'Loja virtual de produtos locais',
  'Automação de relatórios comerciais', 'Projeto de fotografia: cotidiano', 'Organizador de estudos colaborativo',
  'Cardápio acessível e interativo', 'Pesquisa de experiência do estudante', 'Mini CRM para empreendedores',
  'Dashboard de logística reversa', 'Aplicação de tarefas com React', 'Marca para feira de inovação',
]

const projectDescriptions = [
  'Projeto desenvolvido em aula com foco em resolver uma necessidade real da comunidade.',
  'Pesquisa, prototipação e validação com colegas para transformar uma ideia em experiência simples.',
  'Uma solução prática construída em equipe, documentada e apresentada ao final do módulo.',
]

const projectSkillSets = [
  ['React', 'TypeScript', 'Acessibilidade'], ['Figma', 'Branding', 'Illustrator'], ['Excel', 'Power BI', 'Análise de dados'],
  ['Atendimento', 'Organização', 'Comunicação'], ['Fotografia', 'Storytelling', 'Edição'], ['Python', 'SQL', 'Git'],
]

export const seedProjects: Project[] = projectTitles.map((title, index) => {
  const ownerIndex = index % studentUsers.length
  const skills = projectSkillSets[index % projectSkillSets.length]
  const owner = studentUsers[ownerIndex]
  return {
    id: `project-${index + 1}`, title,
    description: projectDescriptions[index % projectDescriptions.length],
    category: owner.area, ownerId: owner.id,
    collaborators: index % 4 === 0 ? [studentUsers[(ownerIndex + 1) % studentUsers.length].id] : [],
    skills: [...skills], tools: [...owner.tools].slice(0, 3),
    cover: coverColors[index % coverColors.length], createdAt: `2026-11-${String(17 - (index % 12)).padStart(2, '0')}`,
    likes: 8 + (index * 7) % 58,
  }
})

export const seedData = (): DemoData => {
  const users = [...studentUsers, ...companies]
  const projects = seedProjects
  const posts = projects.slice(0, 10).map((project, index) => ({
    id: `post-${index + 1}`, authorId: project.ownerId,
    text: [
      'Fechamos a primeira versão do projeto e já testamos com colegas. Aprendizado que quero levar para o próximo desafio!',
      'Compartilhando uma entrega que nasceu de uma atividade prática no curso. O que vocês melhorariam?',
      'Foi muito bom colaborar com outras áreas para tirar essa ideia do papel. Processo e resultado no portfólio.',
    ][index % 3],
    projectId: project.id, createdAt: `2026-11-${String(17 - (index % 6)).padStart(2, '0')}`,
    likedBy: index % 3 === 0 ? ['student-2', 'student-3'] : ['student-1'],
    comments: index % 2 === 0 ? [{ id: `comment-${index}`, authorId: users[(index + 3) % users.length].id, text: 'Adorei ver o processo por trás dessa entrega!' }] : [],
  }))
  const opportunities: Opportunity[] = [
    ['Estágio Front-end', 1, 'Estágio', ['React', 'TypeScript', 'Figma']],
    ['Assistente de Design', 2, 'Emprego', ['Figma', 'Branding', 'Illustrator']],
    ['Projeto de Dados para Varejo', 4, 'Projeto', ['Excel', 'Power BI', 'Análise de dados']],
    ['Estágio em Marketing Digital', 3, 'Estágio', ['SEO', 'Conteúdo', 'Analytics']],
    ['Jovem talento em logística', 6, 'Emprego', ['Excel', 'Estoque', 'Organização']],
    ['Desafio de produto digital', 1, 'Projeto', ['React', 'UX Research', 'Acessibilidade']],
    ['Assistente de atendimento', 5, 'Emprego', ['Atendimento', 'Comunicação', 'Organização']],
    ['Estágio em gastronomia criativa', 3, 'Estágio', ['Confeitaria', 'Custos', 'Food styling']],
  ].map(([title, companyNo, type, requirements], index) => ({
    id: `opportunity-${index + 1}`, companyId: `company-${companyNo}`, title: String(title), type: type as Opportunity['type'],
    city: cities[index % cities.length], mode: (['Híbrido', 'Presencial', 'Remoto'] as const)[index % 3],
    description: `Uma oportunidade para aprender fazendo, com acompanhamento da equipe e espaço para compartilhar ideias.`,
    requirements: requirements as string[], deadline: `2026-12-${String(5 + index).padStart(2, '0')}`,
    stage: (['Nova', 'Em análise', 'Entrevista', 'Nova', 'Finalista', 'Em análise', 'Concluída', 'Nova'] as Opportunity['stage'][])[index],
    salary: index % 2 === 0 ? 'Bolsa compatível' : undefined,
    createdAt: `2026-11-${String(10 + (index % 8)).padStart(2, '0')}`,
  }))
  const communities: Community[] = [
    ['Dev SC em Formação', 'Tecnologia', 'Trocas de código, portfólio e carreira para quem está começando.', '#f2eafb'],
    ['Design que Aproxima', 'Design', 'Pesquisa, interfaces e boas ideias feitas em conjunto.', '#fce8f3'],
    ['Cozinha Criativa', 'Gastronomia', 'Receitas, técnicas e projetos de gastronomia com identidade regional.', '#fff1d4'],
    ['Dados sem Mistério', 'Gestão', 'Excel, indicadores e decisões mais claras no dia a dia.', '#e8e2f2'],
    ['Primeiro Portfólio', 'Carreira', 'Um espaço para tirar o primeiro case do papel e receber feedback.', '#f4edfb'],
    ['Mulheres em Tecnologia SC', 'Tecnologia', 'Rede de apoio, referências e colaboração na área tech.', '#fce8f3'],
    ['Conexões do Oeste', 'Comunidade', 'Estudantes e empresas da região compartilhando oportunidades.', '#fff1d4'],
    ['Comunicação em Ação', 'Comunicação', 'Conteúdo, audiovisual e narrativas que geram conexão.', '#f5f1f8'],
  ].map(([name, category, description, color], index) => ({
    id: `community-${index + 1}`, name: String(name), category: String(category), description: String(description),
    members: Array.from({ length: 9 + index * 3 }, (_, i) => `student-${((i + index) % studentUsers.length) + 1}`),
    color: String(color), post: ['Encontro aberto nesta semana: traga seu projeto em andamento.', 'Desafio da comunidade: compartilhe uma dica que facilitou seu processo.'][index % 2],
  }))
  const challenges = [
    ['Desafio: site de impacto local', 'company-1', 'Tecnologia', 'Crie uma experiência digital simples para conectar projetos sociais e voluntários.', '2026-11-28', 120, 'Coletivo'],
    ['Identidade para um café consciente', 'company-2', 'Design', 'Apresente conceito de marca e aplicações para um café com produtores locais.', '2026-12-02', 100, 'Individual'],
    ['Cozinha de aproveitamento integral', 'company-3', 'Gastronomia', 'Desenhe uma receita acessível usando ingredientes regionais e aproveitamento integral.', '2026-12-05', 90, 'Individual'],
    ['Dados para uma cidade melhor', 'company-4', 'Gestão', 'Conte uma história com dados abertos que ajude a entender um desafio da cidade.', '2026-12-09', 140, 'Coletivo'],
    ['Experiência de cuidado acolhedora', 'company-5', 'Saúde', 'Proponha uma jornada de atendimento simples, inclusiva e acolhedora.', '2026-12-12', 110, 'Coletivo'],
    ['Logística reversa na prática', 'company-6', 'Logística', 'Mapeie uma melhoria viável para retorno e reaproveitamento de embalagens.', '2026-12-15', 130, 'Individual'],
  ].map(([title, companyId, category, description, deadline, points, mode], index) => ({
    id: `challenge-${index + 1}`, title: String(title), companyId: String(companyId), category: String(category), description: String(description),
    deadline: String(deadline), points: Number(points), participants: index === 0 ? ['student-1', 'student-6'] : ['student-2', 'student-3'], mode: mode as 'Individual' | 'Coletivo',
  }))
  const events: EventItem[] = [
    ['Feira de Talentos do Oeste', 'Feira profissional', 'Encontre empresas, apresente seu portfólio e converse com profissionais.', '2026-11-21', '14:00', 'Senac Chapecó · Auditório', 'company-1'],
    ['Workshop: portfólio que conta histórias', 'Workshop', 'Uma oficina prática para transformar projetos em cases claros.', '2026-11-24', '19:00', 'Senac Chapecó · Lab Criativo', 'company-2'],
    ['Hackathon Soluções Locais', 'Hackathon', 'Um dia para formar equipes e criar protótipos para desafios regionais.', '2026-11-28', '09:00', 'Centro de Inovação de Chapecó', 'company-1'],
    ['Conversa aberta: primeiro emprego', 'Palestra', 'Dicas e perguntas abertas com profissionais de RH e egressos.', '2026-12-02', '18:30', 'Online · Meet', 'company-4'],
    ['Encontro Gastronomia e Território', 'Encontro', 'Sabores, técnicas e ideias para valorizar ingredientes locais.', '2026-12-05', '10:00', 'Senac Chapecó · Cozinha escola', 'company-3'],
    ['Mostra de Projetos VibeUp', 'Feira profissional', 'Uma vitrine de projetos feitos por estudantes de diferentes áreas.', '2026-12-12', '15:00', 'Senac Florianópolis · Hall', 'company-2'],
  ].map(([title, category, description, date, time, location, organizerId], index) => ({
    id: `event-${index + 1}`, title: String(title), category: String(category), description: String(description), date: String(date), time: String(time),
    location: String(location), organizerId: String(organizerId), attendees: index % 2 === 0 ? ['student-1', 'student-2', 'student-4'] : ['student-3', 'student-5'], color: coverColors[index % coverColors.length],
  }))
  return {
    currentUserId: 'student-1', users, projects, posts, opportunities, communities, challenges, events,
    conversations: [
      { id: 'conversation-1', participants: ['student-1', 'company-1'], messages: [
        { id: 'message-1', authorId: 'company-1', text: 'Oi, Ana! Vimos seu projeto de painel e gostamos muito da solução. Você teria disponibilidade para conversar?', time: '10:42' },
        { id: 'message-2', authorId: 'student-1', text: 'Oi! Obrigada pelo contato. Tenho sim, podemos combinar um horário nesta semana.', time: '10:48' },
      ] },
      { id: 'conversation-2', participants: ['student-1', 'student-3'], messages: [
        { id: 'message-3', authorId: 'student-3', text: 'Vamos formar um grupo para o hackathon?', time: 'Ontem' },
      ] },
      { id: 'conversation-3', participants: ['student-1', 'student-6'], messages: [
        { id: 'message-4', authorId: 'student-6', text: 'Adorei o feedback no protótipo. Vou subir as melhorias hoje.', time: 'Seg' },
      ] },
    ],
    notifications: [
      { id: 'notice-1', userId: 'student-1', text: 'NorteLab Tecnologia visitou seu projeto Painel de indicadores.', kind: 'Visita', time: 'há 12 min', read: false },
      { id: 'notice-2', userId: 'student-1', text: 'Caio Mendes comentou no seu projeto.', kind: 'Comentário', time: 'há 1 h', read: false },
      { id: 'notice-3', userId: 'student-1', text: 'Você recebeu um convite para o Desafio: site de impacto local.', kind: 'Desafio', time: 'ontem', read: true },
      { id: 'notice-4', userId: 'student-1', text: 'A Feira de Talentos do Oeste acontece neste sábado.', kind: 'Evento', time: 'ontem', read: true },
      { id: 'notice-5', userId: 'student-1', text: 'Você ganhou pontos ao participar da comunidade Dev SC em Formação.', kind: 'Comunidade', time: '2 dias atrás', read: true },
      { id: 'notice-6', userId: 'student-1', text: 'Sua inscrição no Desafio: site de impacto local foi confirmada.', kind: 'Desafio', time: '3 dias atrás', read: true },
      { id: 'notice-7', userId: 'student-1', text: 'Lucas Ribeiro enviou uma nova mensagem.', kind: 'Mensagem', time: '4 dias atrás', read: true },
      { id: 'notice-9', userId: 'company-1', text: 'Ana Luiza Martins demonstrou interesse na oportunidade Estágio Front-end.', kind: 'Candidatura', time: 'há 1 h', read: false },
      { id: 'notice-10', userId: 'company-1', text: 'Seu anúncio Estágio Front-end recebeu 4 visitas de estudantes.', kind: 'Oportunidade', time: 'ontem', read: true },
    ],
    submittedChallenges: [], favorites: [], applications: [], connections: ['student-3', 'student-6'], blocked: [],
    privacy: { profilePublic: true, projectsPublic: true, showCity: true, showContact: false }, notifyByEmail: true,
  }
}
