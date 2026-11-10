# Aplicativo PWA & Player Web da Rádio de Pátria e Querência

Um aplicativo web progressivo (PWA) instalável diretamente pelo navegador em smartphones (Android/iOS) e computadores, com player de transmissão contínua ao vivo da **Rádio de Pátria e Querência** (Parobé, RS), temporizador de sono, pedidos de música via WhatsApp e equalizador dinâmico no estilo gaúcho moderno.

---

## Decisões Confirmadas & Respostas do Usuário

> [!IMPORTANT]
> As decisões de design e escopo foram confirmadas nas perguntas iniciais:
> - **Estilo Visual**: *Gaúcho moderno com tons couro, dourado e verde escuro* — paleta nobre com fundo escuro profundo, detalhes em couro queimado, âmbar dourado e verde pampa, com tipografia refinada e alto contraste.
> - **Experiência de Download & Instalação**: *Instalador PWA direto com botão de instalação rápida e guia passo a passo* — captura do evento nativo `beforeinstallprompt` com botão de instalação de 1 clique, além de modal ilustrado com instruções para Android, iPhone/iPad (Safari) e Desktop (Chrome/Edge).
> - **Recursos Integrados ao Player**: *Pedido de música via WhatsApp, temporizador de sono (sleep timer) e equalizador visual animado* — além do suporte ao MediaSession API para controle na tela de bloqueio e fones de ouvido.

---

## 1. Visão Geral & Conceito

- **O que faz**: Permite que os ouvintes acessem a transmissão ao vivo da Rádio de Pátria e Querência e baixem/instalem o aplicativo diretamente em sua tela inicial com um toque, funcionando como um app nativo sem precisar de loja de aplicativos.
- **Público-alvo**: Tradicionalistas, gaúchos e amantes da música nativista e folclórica no Rio Grande do Sul, no Brasil e no exterior.
- **Proposta de Valor**: Reprodução instantânea e contínua do áudio oficial (`https://stm8.painelvox.com:6822/stream`), sem travamentos, com controles acessíveis de volume, temporizador programável para dormir escutando rádio e envio rápido de pedidos musicais para a equipe da rádio.

---

## 2. Experiência do Usuário & Design Visual

### Fluxos Principais do Usuário

1. **Acesso & Player Principal**:
   - Ao carregar a página, o usuário vê o emblema nobre da rádio, o status da transmissão ("Ao Vivo - Parobé/RS"), visualizador de frequências e botão tátil central de **Play / Pausar**.
   - Controle de volume com slider preciso e botão de mudo rápido.
   - Status de conectividade com reconexão automática em caso de oscilação de rede.

2. **Instalação do Aplicativo (PWA)**:
   - Banner de destaque no topo e botão dedicado **"Baixar / Instalar Aplicativo"**.
   - No Android e Desktop: dispara diretamente a janela de instalação nativa do sistema.
   - No iOS (iPhone/iPad): abre modal explicativo interativo ("Toque em Compartilhar no Safari e selecione Adicionar à Tela de Início").
   - Detecção automática de modo standalone (esconde botões de instalação se o app já estiver instalado).

3. **Temporizador de Sono (Sleep Timer)**:
   - Botão para definir desligamento automático da rádio (15, 30, 45, 60 ou 90 minutos).
   - Contagem regressiva ativa no card com fade-out suave de áudio no término.

4. **Pedido de Música via WhatsApp**:
   - Modal rápido para preencher: Nome, Cidade, Nome da Música e Artista/Conjunto.
   - Botão que abre o WhatsApp diretamente com a mensagem formatada para a emissora.

5. **Compartilhamento & Redes Sociais**:
   - Botão de compartilhamento nativo (`navigator.share`) para enviar a rádio para amigos e grupos de WhatsApp.
   - Links rápidos para o site oficial e programação.

### Identidade Visual & Tema (Gaúcho Moderno)

- **Paleta de Cores**:
  - *Fundo Primário*: Preto profundo e ardósia noturna (`#090E11` / `#111A1F`)
  - *Couro / Madeira Nobre*: Tons de sela e couro rústico (`#8B4513`, `#78350F`, `#9A3412`)
  - *Âmbar / Ouro Pampeano*: Destaques e acentos dourados (`#F59E0B`, `#D97706`, `#FBBF24`)
  - *Verde Pampa Tradicional*: Verde escuro floresta para elementos de sucesso e transmissão ativa (`#064E3B`, `#047857`, `#10B981`)
- **Tipografia**:
  - Títulos elegantes com porte clássico tradicionalista (`Cinzel` / `Plus Jakarta Sans` com peso bold)
  - Textos de apoio limpos e legíveis para leitura sob o sol ou à noite.
- **Equalizador Visual**:
  - Barras animadas com gradiente dourado/verde que pulsam suavemente de acordo com a reprodução.

---

## 3. Decisões do Produto & Arquitetura Técnica

- **Decisão 1: PWA com Vite PWA & Service Worker**:
  - *Abordagem*: Configurar `vite-plugin-pwa` com manifesto completo (`manifest.webmanifest`), ícones de 192x192 e 512x512, tema compatível com mobile, e cache offline de casca do app.
  - *Por que*: Atende com perfeição o requisito de "ser baixado através do site", dispensando a burocracia de lojas de aplicativos e ocupando menos de 1 MB de memória.
- **Decisão 2: Transmissão de Áudio Direta em HTTPS**:
  - *Abordagem*: Utilizar o endpoint real verificado `https://stm8.painelvox.com:6822/stream` (Shoutcast/Icecast em HTTPS com suporte a CORS e stream contínuo AAC/MP3).
  - *Por que*: Garante funcionamento sem bloqueio de conteúdo misto (Mixed Content) nos navegadores modernos e celulares.
- **Decisão 3: Suporte a MediaSession API**:
  - *Abordagem*: Integrar a API padrão `navigator.mediaSession` com título ("Rádio de Pátria e Querência"), artista ("Música Tradicionalista Gaúcha") e arte gráfica.
  - *Por que*: Permite que o ouvinte pause e controle a rádio pela tela de bloqueio do celular, smartwatch ou fones Bluetooth sem interromper a reprodução ao bloquear a tela.

---

## 4. Diagrama de Arquitetura & Fluxo de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Navegador / Tela Inicial (PWA)                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐         ┌──────────────────────────────┐  │
│  │   TopBar & Instalação   │         │    Modais Auxiliares         │  │
│  │  - Status de Conexão    │         │  - Modal Como Instalar (Guia)│  │
│  │  - Botão "Instalar App" │───────> │  - Modal Pedido no WhatsApp  │  │
│  │  - Compartilhar         │         │  - Modal Temporizador Sono   │  │
│  └───────────┬─────────────┘         └──────────────────────────────┘  │
│              │                                                         │
│  ┌───────────▼──────────────────────────────────────────────────────┐  │
│  │                     Card Principal do Player                     │  │
│  │  - Brasão & Identidade da Rádio                                  │  │
│  │  - Equalizador Visual Dinâmico (CSS Canvas/Bars)                 │  │
│  │  - Botão Central Tátil Play / Pause com feedback visual          │  │
│  │  - Controle de Volume deslizante (0 a 100%) + Botão Mudo         │  │
│  │  - Informações do Programa & Cidade (Parobé / Rio Grande do Sul) │  │
│  └───────────────────────────────────┬──────────────────────────────┘  │
│                                      │                                 │
│  ┌───────────────────────────────────▼──────────────────────────────┐  │
│  │                     Módulo de Áudio & PWA                        │  │
│  │  - HTMLAudioElement (https://stm8.painelvox.com:6822/stream)      │  │
│  │  - MediaSession Controller (Controles de Bloqueio de Tela)       │  │
│  │  - Service Worker (Cache de assets & funcionamento offline da UI) │  │
│  │  - Sleep Timer Controller (Contagem regressiva com fade out)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Próximos Passos na Execução

1. Adicionar o pacote `vite-plugin-pwa` para suporte completo à instalação e manifesto.
2. Criar os ícones do aplicativo (`icon.svg`, `pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`) com identidade gaúcha nobre.
3. Atualizar o `vite.config.ts`, `index.html` e `metadata.json` com títulos, meta-tags e manifesto.
4. Construir o player responsivo em `src/App.tsx` e componentes auxiliares (`PWAInstallModal`, `SleepTimerModal`, `SongRequestModal`, `AudioVisualizer`).
5. Verificar build e compilação com `compile_applet` e `lint_applet`.
