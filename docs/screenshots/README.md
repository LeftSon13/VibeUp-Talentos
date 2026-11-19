# Capturas responsivas

Capturas geradas com `npm run capture:responsive` (Playwright/Chromium, escala 1×). As imagens do feed retratam a visão estudante; a rotina mede overflow horizontal e coleta erros JavaScript.

| Arquivo | Viewport |
|---|---:|
| `desktop-1440x900.png` | 1440 × 900 |
| `laptop-1280x720.png` | 1280 × 720 |
| `compact-desktop-1024x768.png` | 1024 × 768 |
| `tablet-768x1024.png` | 768 × 1024 |
| `mobile-390x844.png` | 390 × 844 |
| `mobile-360x800.png` | 360 × 800 |
| `login-brand-desktop-1440x900.png` | Login, 1440 × 900 |
| `login-brand-mobile-390x844.png` | Login, 390 × 844 |
| `feed-hybrid-desktop.png` | Feed e organização geral, 1440 × 900 |
| `feed-hybrid-mobile.png` | Feed móvel, 390 × 844 |
| `profile-hybrid-desktop.png` | Portfólio em lista, 1440 × 900 |
| `profile-hybrid-mobile.png` | Perfil e abas horizontais, 390 × 844 |

`diagnostics.json` reúne status HTTP, tamanho do documento, presença da navegação móvel, erros de página e carregamento das marcas. Nas seis dimensões do feed não houve overflow horizontal nem erro de página. As duas capturas de login também confirmam o carregamento das marcas de referência.

As quatro capturas `*-hybrid-*` registram uma auditoria visual da composição inspirada na distribuição LinkedIn/GitHub; os nomes indicam a largura de tela usada. A captura móvel do perfil permite rolar horizontalmente pelas abas sem exibir barra de rolagem.

Em 18/11/2026, as 12 rotas principais também foram percorridas em 1440 × 900 e 390 × 844. Todas retornaram HTTP 200, exibiram conteúdo principal e não apresentaram overflow horizontal nem erros de página. A checagem não abre cada modal ou estado de interação; os smokes funcionais cobrem os fluxos principais.
