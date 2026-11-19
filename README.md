# VibeUp Talentos

**Conectando talentos em formação ao mercado de trabalho.**

Protótipo acadêmico responsivo para aproximar estudantes, empresas e comunidade educacional por meio de projetos, competências demonstráveis e oportunidades. A VibeUp é uma proposta conceitual independente; não é produto oficial do Senac nem do Programa Jovem Programador.

## Executar localmente

Requisitos: Node.js e npm instalados.

```bash
npm install
npm run dev
```

O Vite informa o endereço local no terminal (normalmente `http://localhost:5173`). Para gerar e conferir a versão de produção:

```bash
npm run test:e2e
npm run lint
npm run build
npm run preview
```

`test:e2e` requer um servidor local iniciado com `npm run dev` em outro terminal.

`build` executa a verificação TypeScript (`tsc -b`) antes de gerar os arquivos em `dist/`. O teste de fumaça Playwright cobre os fluxos principais do protótipo; não há suíte de testes unitários nem backend.

Para repetir as capturas responsivas, mantenha `npm run dev` aberto em outro terminal, instale o Chromium do Playwright uma vez e execute:

```bash
npx playwright install chromium
npm run capture:responsive
```

As capturas do feed e da apresentação das marcas ficam em [`docs/screenshots/`](docs/screenshots/); a lista de arquivos está em [`docs/screenshots/README.md`](docs/screenshots/README.md). `diagnostics.json` registra largura, status HTTP e erros de página. A rotina confere as cinco resoluções solicitadas (1440×900, 1280×720, 768×1024, 390×844 e 360×800), mais um desktop compacto de 1024×768 e duas telas de referência do login.

## Acesso demonstrativo

Na tela `/login`, use os botões **Estudante** ou **Empresa** em “Acesso rápido para apresentação”. Também é possível escolher o papel, informar qualquer e-mail válido e uma senha com pelo menos quatro caracteres; os campos servem apenas à simulação e não autenticam uma conta real.

| Papel | Perfil inicial | E-mail demonstrativo |
|---|---|---|
| Estudante | Ana Luiza Martins, estudante de tecnologia em Chapecó | `estudante1@vibeup.demo` |
| Empresa | NorteLab Tecnologia, Chapecó | `talentos1@empresa.demo` |

No cabeçalho também há um seletor para alternar entre as visões de estudante e empresa sem sair da demonstração.

## Módulos e navegação

- `/login` — entrada, cadastro simulado, seleção de perfil e recuperação demonstrativa de senha.
- `/feed` — publicações de projetos, curtidas, comentários, sugestões e oportunidades.
- `/publicar` — publicação social ou projeto permanente de portfólio; permite associar competências, ferramentas, links, privacidade, comunidade e expiração de 24 horas.
- `/perfil` e `/perfil/:id` — portfólio em lista, competências com projetos de evidência, experiência/cursos/certificados informados, apresentação, atividade, conexão, conversa e favoritos.
- `/explorar` — busca por talentos, projetos, comunidades e oportunidades; filtros por competência, cidade, área, unidade Senac, ferramenta, disponibilidade e colaboração em projetos.
- `/comunidades` — recomendações, categorias, participação e criação de comunidade.
- `/desafios` — desafios individuais ou coletivos, inscrição, entrega em equipe, ranking por ordem de entrega, marcos de contribuição e criação empresarial de desafios.
- `/mensagens` — contatos, conversas e envio de mensagens simuladas.
- `/eventos` — agenda, calendário mensal, categorias, participação e criação de eventos com imagem promocional opcional.
- `/notificacoes` — notificações e marcação individual ou coletiva como lida.
- `/configuracoes` — dados do perfil, privacidade, resumo por e-mail, bloqueio demonstrativo e controles simulados de conta.
- `/empresas/oportunidades` — vagas, estágios e projetos; empresa pode cadastrar oportunidades e acompanhar um pipeline por etapas.
- `/relatorios` — métricas demonstrativas de talentos, projetos, oportunidades e compatibilidade, com filtros e exportação CSV.

Rotas desconhecidas exibem a tela 404. A lista detalhada de adaptação da atividade e as limitações conhecidas estão em [`docs/requirements-matrix.md`](docs/requirements-matrix.md); o roteiro da apresentação está em [`docs/demo-guide.md`](docs/demo-guide.md).

## Jornada principal de demonstração

1. Entre como estudante e abra **Criar publicação**.
2. Publique um projeto, relacionando competências como React ou Figma e as ferramentas utilizadas.
3. Confira o projeto no feed e no portfólio; no perfil, abra a aba **Competências** para ver as evidências relacionadas.
4. Alterne para **Empresa**, abra **Explorar talentos** e pesquise uma competência, por exemplo `React` ou `Figma`.
5. Abra um perfil, salve como talento favorito ou inicie uma conversa. Em **Oportunidades**, compare competências e projetos relacionados.

## Reputação demonstrativa

Os pontos são calculados a partir de evidências registradas e visíveis: projeto autoral **20**, colaboração em projeto **10**, entrega de desafio como autor/equipe **15**, comentário em publicação distinta **2**. O perfil mostra contagens por categoria e o ranking exibe a fórmula. A mesma publicação que representa um projeto não gera pontos duplicados. Esses pontos não medem qualidade e não têm verificação antifraude; podem ser alterados no estado local do navegador.

## Arquitetura resumida

- React, TypeScript, Vite e React Router.
- Interface e tokens CSS em `src/index.css`, `src/App.css`, `src/Features.css`, `src/VisualPolish.css` e `src/HybridReference.css`; componentes comuns em `src/ui.tsx`; estrutura de navegação em `src/Shell.tsx`.
- Rotas em `src/App.tsx`; modelos e regra local de compatibilidade em `src/domain.ts`; conteúdo fictício em `src/seed.ts`; estado e persistência demonstrativa em `src/store.tsx`; telas em `src/pages.tsx`.
- Os dados iniciais incluem 20 estudantes, 6 empresas, 30 projetos, 8 oportunidades, 8 comunidades, 6 desafios e 6 eventos, além de publicações, conversas e notificações relacionadas.
- A compatibilidade técnica é uma comparação local, transparente e exata (sem diferenciar maiúsculas/minúsculas) entre requisitos e competências declaradas ou associadas aos projetos. É uma sugestão de descoberta, nunca avaliação definitiva ou decisão automática de contratação.

## Persistência e restauração

As interações são guardadas no `localStorage` deste navegador sob a chave `vibeup-demo-v1`; não são sincronizadas com outros navegadores ou dispositivos. Para voltar aos dados fictícios originais, use **Configurações → Restaurar dados de demonstração** e confirme. A ação substitui as mudanças locais feitas durante a apresentação.

## Identidade visual

A VibeUp usa símbolo próprio e uma paleta violeta (`#630DC9`), violeta-escuro (`#230254`), rosa (`#F346AB`) e dourado (`#F6A824`), inspirada visualmente nas referências do Programa Jovem Programador. As marcas institucionais ficam separadas da identidade do produto, numa área identificada como referência. A plataforma é uma proposta acadêmica independente, sem vínculo ou endosso oficial. A interface adapta padrões de organização do LinkedIn e do GitHub sem reproduzir suas marcas. Veja decisões e fontes em [`docs/visual-research.md`](docs/visual-research.md).

Os ícones ilustrados da VibeUp ficam em `public/brand/vibeup-icons-v1.png`; o símbolo da marca está em `public/brand/vibeup-mark-v1.png`. As marcas Senac SC e Jovem Programador são assets de referência, não logotipos da VibeUp.

## Limitações do protótipo

- Não há servidor, banco de dados, autenticação, recuperação real de senha, envio externo de mensagens ou controle de acesso no servidor.
- Os dados são fictícios e locais. Controles de privacidade, bloqueio, desativação e exclusão ilustram fluxos de produto, mas não constituem mecanismos de segurança.
- Fotos anexadas a publicações, capas de perfil e imagens promocionais de eventos são pré-visualizadas, comprimidas e persistidas localmente neste navegador. Vídeos de publicação ainda registram apenas o nome do arquivo; não há envio para armazenamento remoto.
- A busca e o mapa de competências operam somente sobre os campos e itens presentes no conjunto local. O protótipo não verifica certificados nem valida competências com uma instituição.
- Datas, empresas, mensagens e resultados são exemplos de apresentação. Compatibilidade e pontos derivados são apoio demonstrativo, não avaliação profissional nem decisão automática de contratação; entregas de desafios ficam pendentes até uma revisão real.
- O enunciado PDF exige imagens de protótipo e HTML/CSS numa pasta compactada; este projeto entrega uma aplicação React executável. Veja a matriz para a relação entre esses formatos e a adaptação funcional.

## Documentos

- [`docs/requirements-matrix.md`](docs/requirements-matrix.md) — distinção entre o PDF original do ConnectPro e o pedido VibeUp, matriz de atendimento e pontos parciais.
- [`docs/demo-guide.md`](docs/demo-guide.md) — roteiro de apresentação acadêmica, jornada de estudante e empresa e fala sugerida.
- [`docs/architecture.md`](docs/architecture.md) — camadas, estado local, rotas e fluxo de dados.
- [`docs/visual-research.md`](docs/visual-research.md) — referências oficiais e decisões independentes de identidade visual.
