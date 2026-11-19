# Matriz de requisitos — VibeUp Talentos

## Escopo e critério de leitura

O PDF da atividade tem cinco páginas e descreve **11 telas da própria VibeUp**. Exige um protótipo navegável Web/Mobile com identidade visual própria, estrutura, usabilidade e responsividade. Ele diz expressamente que não é necessário banco de dados, autenticação real ou API. Portanto, a simulação local e o `localStorage` são adequados ao escopo; não são pendências de backend.

O texto colado é a proposta do usuário e amplia a atividade com portfólio, competências demonstradas, compatibilidade e portal de empresas. As telas do PDF devem ser adaptadas a essa proposta. Não há cenário ConnectPro nesta atividade.

**Atendido** indica evidência funcional no protótipo. **Parcial** indica que a tela/fluxo existe, mas ainda falta um comportamento listado. Uploads, conta e mensagens são demonstrações locais, sem transmissão real.

## 11 telas do PDF

| # | Tela e rota | Estado atual | Evidência observada e pendência concreta |
|---:|---|---|---|
| 1 | **Login e Cadastro** — `/login` | **Atendido no escopo Front-end** | Campos de e-mail/senha, cadastro com nome/e-mail/senha/nascimento, seleção estudante/empresa, validação básica, recuperação simulada e acesso demonstrativo. Não há autenticação real, conforme o PDF; data de nascimento é validada, mas não armazenada no perfil. |
| 2 | **Dashboard — Feed de Publicações** — `/feed` | **Atendido no escopo local** | Feed, projetos, curtidas, comentários e compartilhamento com fallback de copiar link; filtro cronológico ou por afinidade, explicação dos sinais usados, sugestões de pessoas por interesses/competências, tendências de competências e próximo evento. Sem sinais de afinidade, mantém ordem cronológica. Privacidade e bloqueios são aplicados. Conteúdo e recomendações continuam locais; o feed não recomenda comunidades nesta tela. |
| 3 | **Criar Publicação** — `/publicar` | **Atendido como demonstração local** | Cria publicação/projeto com texto, título, categoria, curso, competências, ferramentas, link, colaboradores escolhidos entre perfis existentes, localização, comunidade, privacidade e expiração de 24 h. Imagens JPG/PNG/WebP têm prévia, compressão e persistência local; cartões e perfil mostram imagem, localização e colaboradores visíveis. Vídeos ainda mostram apenas o nome, sem upload persistente. |
| 4 | **Perfil do Usuário** — `/perfil`, `/perfil/:id` | **Atendido no escopo local** | Seções de Projetos/Portfólio, Competências, Comunidades, Sobre e Atividade; mostra contagem de publicações visíveis, comunidades em que o perfil participa e, nos projetos, autoria, colaboradores visíveis, tecnologias e métricas existentes. A pessoa proprietária pode pré-visualizar e salvar uma capa JPG/PNG/WebP comprimida e editar experiências, cursos complementares e certificados como campos opcionais de texto salvos neste navegador. A aba Sobre exibe campos preenchidos respeitando a visibilidade; certificados são declarações não verificadas. Perfis privados continuam bloqueados e nomes de colaboradores só aparecem quando visíveis. Conquistas derivam de projeto autoral, colaboração registrada e entrega enviada; pontos exibem a composição por evidências visíveis. |
| 5 | **Explorar — Descobrir Conteúdos** — `/explorar` | **Atendido no escopo local** | Busca em talentos, projetos, comunidades e oportunidades; filtros por cidade, unidade, área, competência, ferramenta, colaboração, disponibilidade e curso. Curso filtra talentos/projetos, não comunidades/oportunidades. Talentos também recebem até quatro sugestões públicas, não bloqueadas, não conectadas e compatíveis com os filtros; afinidade explica sinais de interesses (2 pontos) e competências visíveis (3 pontos), sem usar localização. |
| 6 | **Comunidades — Grupos de Interesses** — `/comunidades` | **Parcial** | Lista por categoria com descrição, participantes e conversa recente; entrar/sair e criar comunidade. Sugestões são ranqueadas por interesses e competências, com explicação e fallback por popularidade. Ainda não há página de detalhes nem feed próprio para cada comunidade. |
| 7 | **Desafios — Interação entre Usuários** — `/desafios` | **Atendido no escopo local** | Desafios individuais/coletivos têm inscrição, envio de título/contexto/link, ranking por desafio em ordem de entrega e integração com portfólio. Para desafios coletivos, a equipe pode incluir participantes inscritos sem entrega anterior. Empresas criam desafios; entregas permanecem como avaliação pendente até revisão, sem nota ou feedback inventado. |
| 8 | **Mensagens — Chat** — `/mensagens` | **Atendido como simulação local** | Lista/ busca de contatos, nomes, presença, histórico, envio de texto, reações, nova conversa e acesso direto por `?contact=`. Em 320–390 px apresenta um painel por vez com botão acessível de retorno; tablet/desktop mantêm dois painéis. Anexos são representados pelo nome do arquivo, sem transferência de mídia. |
| 9 | **Eventos e Encontros** — `/eventos` | **Atendido no escopo local** | Agenda e calendário, nome, descrição, data, horário, local, categoria, participantes, participar/cancelar e criar evento. Eventos criados localmente aceitam imagem promocional JPG/PNG/WebP opcional, com prévia antes de salvar, limite de 8 MB na origem e compressão para até 180 KB; a imagem persiste no navegador e aparece no cartão. O bloco de data permanece presente quando não há imagem. |
| 10 | **Notificações** — `/notificacoes` | **Atendido no escopo local** | Curtir, comentar, conectar, enviar mensagem, inscrever-se/enviar desafio e confirmar presença geram avisos persistidos; não há autoaviso nem aviso ao desfazer/cancelar. Há um único controle para marcar todas como lidas e marcação individual. A demonstração inclui avisos seed e sugestões estáticas. |
| 11 | **Configurações e Privacidade** — `/configuracoes` | **Parcial** | Edita nome/bio/cidade/foto, resumo por e-mail e controles por usuário para perfil, projetos, localização e contato; essas regras locais afetam feed, busca e perfil. Permite selecionar perfis para bloquear/desbloquear, oculta bloqueados no feed, perfil e mensagens e impede o envio de mensagem; históricos e entregas são preservados, com nomes de participantes bloqueados mascarados no ranking. Lista participações em comunidades, permite sair e oferece atalho para explorar/entrar. Senha/conta permanecem simulações, como permite o PDF. |

## Requisitos adicionais do pedido VibeUp

| Requisito | Estado atual | Pendência concreta |
|---|---|---|
| Portal de empresas | **Atendido no escopo demonstrativo** | Alternância de perfil, descoberta de talentos, portfólios, favoritos, conversas, publicação de oportunidades e desafios, pipeline e relatórios. Não há backend nem processo real de candidatura/avaliação. |
| Mapa de Competências | **Atendido no protótipo** | Competências declaradas e competências de projetos aparecem no perfil; seleção de habilidade aponta para evidências e a busca consulta habilidades/ferramentas visíveis. |
| Compatibilidade talento/oportunidade | **Atendido no protótipo** | Comparação exata, sem diferenciar maiúsculas/minúsculas, entre requisitos e competências visíveis do perfil/projetos. Exibe correspondências, requisitos ainda não identificados, percentual, contagem, fórmula, contexto e projetos relacionados; cidade não pontua. A pontuação é auxiliar e os dados privados não são revelados. |
| Reputação por contribuição | **Atendido no escopo demonstrativo** | Pontos e ranking são derivados de evidências visíveis: projeto autoral (+20), colaboração registrada (+10), entrega de desafio como autor/equipe (+15) e comentário em post distinto (+2); a mesma publicação vinculada a projeto não conta como projeto adicional. Perfil e cartões mostram contagens por categoria; conquistas usam evidências de projeto, colaboração e entrega. O cálculo é local, sem verificação ou trilha antifraude; entregas não recebem avaliação ou nota automaticamente. |
| Publicações colaborativas | **Atendido no protótipo** | Colaboradores são selecionados entre perfis existentes e gravados por ID; a busca do seletor preserva seleção. Cartões e portfólio mostram colaboração respeitando a privacidade. Não há fluxo de convite/aceite do colaborador. |
| Feed personalizado e comunidades inteligentes | **Atendido no protótipo** | “Para você” ordena publicações pelos interesses e competências em comum e explica a afinidade; “Recentes” permanece cronológico. Feed sugere pessoas; comunidades sugerem grupos por interesses/competências e usam popularidade como fallback. Não há recomendação baseada em aprendizado ou comportamento fora dos dados locais. |
| Dados demonstrativos | **Atendido** | `src/seed.ts` contém 20 estudantes, 30 projetos, 6 empresas, 8 oportunidades, 8 comunidades, 6 desafios e 6 eventos; identidades e cidades são fictícias e contextualizadas em Santa Catarina. |
| Persistência/reset local | **Atendido no protótipo** | `src/store.tsx` persiste estado no `localStorage`; a opção de restaurar volta ao seed. Não há sincronização entre navegadores/dispositivos, o que não é exigido pelo PDF. |
| Identidade própria e responsividade | **Atendido com cobertura parcial de QA** | Símbolo e ícones VibeUp próprios, paleta violeta/rosa/dourada inspirada visualmente no Jovem Programador e marcas de referência claramente separadas. A organização adapta padrões de LinkedIn/GitHub sem copiar suas marcas. Em telas móveis, cabeçalho e navegação inferior recolhem nas duas direções e retornam após 250 ms de pausa; foco os reabre. A busca não mostra placeholder, o menu oferece Configurações e os controles têm alvos de 44 px. Todas as 12 rotas principais foram percorridas em 1440×900 e 390×844: HTTP 200, sem overflow ou erros de página. O script automatizado também captura feed em seis tamanhos e login em dois; estados de modal e interação ainda precisam de regressão própria por rota. |

## Limitações e evolução futura

1. Pontos são calculados localmente das evidências registradas e visíveis, sem verificação, histórico antifraude ou sincronização entre dispositivos; marcos não certificam competência ou credencial.
2. As comunidades ainda não têm página própria com feed e detalhes.
3. A avaliação de entregas de desafio não tem fluxo para a empresa revisar e registrar nota/feedback; por isso, entregas sem revisão ficam pendentes.
4. Mensagens e vídeos não transferem anexos; imagens de publicação/evento e capas ficam apenas no navegador local.
5. Bloqueio, visibilidade e conta são regras demonstrativas no cliente. Uma aplicação real precisaria de backend, autenticação, armazenamento, regras de acesso e avaliação de privacidade.
6. A captura automatizada percorre somente feed/login em sete tamanhos; os demais módulos ainda precisam de uma rodada completa de regressão responsiva antes de uma publicação de produção.

Nenhuma das pendências acima depende de backend para a atividade: todas podem continuar como interações demonstrativas e locais. O PDF isenta autenticação real, API e banco de dados.

## Fluxo de apresentação atualizado

1. Entrar no acesso demonstrativo de estudante, publicar um projeto e relacionar competências.
2. Abrir o perfil, conferir as evidências da competência e a persistência no navegador.
3. Alternar para empresa, buscar talento, consultar oportunidade/compatibilidade e iniciar conversa.
4. Inscrever-se em desafio, enviar título/contexto/link próprios e confirmar a entrega no cartão e no portfólio; a avaliação deve aparecer pendente.
5. Participar de comunidade/evento e consultar notificações demonstrativas.
6. Desativar visibilidade e verificar o resultado para perfil, projetos, localização e contato; restaurar o seed ao final.
