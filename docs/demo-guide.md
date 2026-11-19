# Roteiro de demonstração acadêmica

## Objetivo da apresentação

Apresentar como um projeto feito durante a formação pode se tornar uma evidência prática de competências, ser encontrado por uma empresa e iniciar uma conversa profissional. O protótipo usa perfis e empresas fictícios. A proposta VibeUp é acadêmica e independente, sem vínculo oficial com o Senac ou com o Programa Jovem Programador.

## Preparação antes de apresentar

1. Instale dependências e inicie a aplicação com `npm install` e `npm run dev`.
2. Abra o endereço local indicado pelo Vite e acesse `/login`.
3. Confirme que o acesso rápido de **Estudante** abre o feed; a pessoa inicial é Ana Luiza Martins.
4. Use **Configurações → Restaurar dados de demonstração** se quiser começar com o conjunto limpo. Essa ação apaga alterações salvas no `localStorage` daquele navegador.
5. Para a troca de papel, use o seletor no cabeçalho. A empresa demonstrativa é NorteLab Tecnologia.

Não é necessário cadastrar e-mail real. O protótipo não envia mensagens ou arquivos para terceiros.

## Roteiro de 6 a 8 minutos

### 1. Problema e proposta de valor — 45 segundos

**Fala sugerida:** “Muitos estudantes já desenvolveram projetos práticos, mas ainda têm dificuldade para mostrar o que sabem antes da primeira experiência formal. Empresas, por sua vez, precisam descobrir talentos iniciantes por habilidades que possam ser demonstradas. A VibeUp organiza projetos, competências e oportunidades num mesmo espaço.”

Mostre a tela inicial e explique que a interface distingue estudante e empresa. A marca é uma proposta própria para a atividade.

### 2. Jornada do estudante: publicar uma evidência — 1 minuto

1. Entre como **Estudante**.
2. Abra **Criar publicação**.
3. Mantenha **Adicionar ao portfólio** ativo.
4. Preencha um título e uma descrição, selecione uma categoria e informe competências (por exemplo, `React, TypeScript`) e ferramentas (`VS Code, Figma`).
5. Publique. O novo item deve aparecer no feed e no portfólio do perfil atual.

Se quiser demonstrar a temporalidade, volte ao formulário e ative **Publicação temporária**. Ela fica marcada com expiração de 24 horas e deixa de aparecer no feed após esse prazo; projetos permanentes continuam no portfólio.

### 3. Evidências no perfil — 1 minuto

1. Abra o próprio perfil pelo menu móvel ou pela navegação.
2. Na aba **Portfólio**, localize o projeto.
3. Abra **Competências** e selecione uma habilidade. Mostre a relação entre a habilidade e os projetos que a demonstram, além das ferramentas utilizadas.
4. Mostre **Sobre** e **Atividade** para explicar a apresentação e as publicações.

**Fala sugerida:** “A competência não aparece isolada: a empresa pode ver em que projeto foi aplicada. A busca combina esse sinal com as habilidades declaradas no perfil.”

### 4. Descoberta pela empresa — 1 a 2 minutos

1. Troque para **Visão empresa**.
2. Abra **Explorar talentos** e pesquise `React` ou `Figma`.
3. Mostre a contagem, os filtros e o cartão de Ana Luiza Martins; abra o perfil e confira as evidências.
4. Favorita o perfil e escolha **Conversar** para iniciar uma conversa demonstrativa.
5. Abra **Oportunidades** e veja uma vaga relacionada, como Estágio Front-end. Explique quais competências coincidem e de onde vem o percentual.

**Fala sugerida:** “A compatibilidade é uma comparação local entre requisitos e competências do perfil e dos projetos. Ela ajuda a encontrar evidências; não mede a capacidade total de uma pessoa nem decide uma contratação.”

### 5. Oportunidade, participação e comunidade — 1 minuto

Conforme o tempo, demonstre uma destas ações:

- **Empresa:** em Oportunidades, publique uma vaga ou estágio com requisitos separados por vírgula; depois consulte a listagem, o pipeline e o painel de relatórios.
- **Estudante:** entre num desafio e use **Enviar resultado**. A ação cria um projeto demonstrativo no portfólio.
- **Comunidade:** filtre uma categoria, participe ou crie uma comunidade.
- **Evento:** alterne Agenda e Calendário, confirme presença ou crie um encontro.

### 6. Fechamento — 30 segundos

**Fala sugerida:** “O diferencial da proposta é aproximar formação e mercado por meio de evidências de trabalho, com busca por competências, projetos colaborativos e oportunidades. Este protótipo simula os fluxos no navegador; uma evolução real exigiria autenticação segura, regras de privacidade, armazenamento de mídia e validação com estudantes, docentes e empresas.”

## Ações e resultado esperado

| Ação | Resultado que deve aparecer |
|---|---|
| Publicar projeto de portfólio | Nova publicação no feed e novo projeto no perfil do autor |
| Curtir ou comentar publicação | Contagem ou comentário atualizado no cartão |
| Pesquisar competência | Resultados de talentos/projetos com essa competência, mais contagem e filtros |
| Favoritar talento | Perfil aparece na lista de talentos salvos do portal empresarial |
| Enviar mensagem | Nova mensagem na conversa selecionada; contato pode iniciar conversa |
| Participar de comunidade/evento/desafio | Estado de participação e contagem atualizados |
| Criar oportunidade/evento/comunidade | Item aparece na área correspondente após salvar |
| Marcar notificação como lida | Estado de leitura e contador atualizado |
| Restaurar dados | Estado volta ao conjunto fictício original deste navegador |

## Percurso opcional pelas telas do PDF

Para apresentar a adaptação da atividade, mostre: login em `/login`; painel/feed em `/feed`; gestão/busca em `/explorar`; cadastro/edição em `/login`, `/perfil` e `/configuracoes`; detalhes em `/perfil/:id`; pipeline em `/empresas/oportunidades` → **Pipeline**; cadastro de oportunidade no mesmo portal; agenda e cadastro de compromisso em `/eventos`; relatórios em `/relatorios` com filtro e **Exportar CSV**.

O PDF original propõe um CRM ConnectPro. A demonstração aplica suas ideias de navegação, listagem, formulários, detalhes, etapas, agenda e indicadores ao produto VibeUp, sem transformar estudantes em clientes comerciais.

## Recomendações para a banca

- Reforce que os nomes, empresas, contatos e cidades exibidos são fictícios.
- Mostre a jornada estudante → projeto → competência → pesquisa empresarial, que evidencia o principal diferencial.
- Explique compatibilidade como apoio à descoberta e evite apresentá-la como nota profissional.
- Diga que o LocalStorage mantém as mudanças no mesmo navegador e que a opção Restaurar recupera o estado inicial.
- Identifique como futuras evoluções: backend e autenticação, proteção de dados de menores, mídia real, verificação de competências/certificados, filtros adicionais e validação de usabilidade com usuários.
