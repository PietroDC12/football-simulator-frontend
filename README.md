# ⚽ Football Simulator — Frontend

Interface mobile-first para simulação de partidas de futebol em tempo real, com eventos animados, placar ao vivo, estatísticas e efeitos sonoros.

---

## 🚀 Tecnologias

- **React** — biblioteca para construção da interface
- **Vite** — bundler e servidor de desenvolvimento
- **Axios** — requisições HTTP para a API
- **Web Audio / MP3** — efeitos sonoros por tipo de evento
- **JavaScript (ES6+)** — linguagem principal
- **CSS-in-JS** — estilização inline por componente

---

## 📁 Estrutura do projeto

```
football-simulator-frontend/
├── public/
│   └── sounds/
│       ├── whistle.mp3     # Apito de início
│       ├── halftime.mp3    # Apito de intervalo
│       ├── fulltime.mp3    # Apito de fim de jogo
│       ├── goal.mp3        # Som de gol
│       └── foul.mp3        # Som de falta/cartão
├── src/
│   ├── components/
│   │   ├── SelectScreen.jsx  # Tela de seleção de times e formato
│   │   └── MatchScreen.jsx   # Tela da partida em tempo real
│   ├── api.js                # Funções de chamada à API
│   ├── useSound.js           # Gerenciador de efeitos sonoros
│   ├── App.jsx               # Componente raiz e controle de telas
│   ├── main.jsx              # Entrada da aplicação
│   └── index.css             # Estilos globais
└── package.json
```

---

## ⚙️ Instalação

**Pré-requisito:** backend rodando em `http://localhost:3001`.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/football-simulator-frontend.git
cd football-simulator-frontend

# Instale as dependências
npm install
```

---

## ▶️ Rodando o projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
```

A aplicação abre em `http://localhost:5173`

---

## 🎮 Como usar

1. **Tela de seleção** — escolha o campeonato e o time da casa, depois o campeonato e o visitante
2. **Formato** — selecione entre 90 minutos ou 120 minutos com prorrogação e pênaltis
3. **Apitar partida** — a simulação começa automaticamente com eventos em tempo real
4. **Acompanhe** — placar, estatísticas e feed de eventos atualizam a cada lance
5. **Novo jogo** — ao fim da partida, volte para a tela de seleção

---

## 🔊 Sons

Os arquivos de áudio ficam em `public/sounds/`. Para substituir algum som, basta trocar o arquivo MP3 mantendo o mesmo nome. O mapeamento de eventos para sons está em `src/useSound.js`.

---

## 📱 Resolução

A interface foi desenvolvida em **390×844px** (mobile-first), ideal para gravação e publicação em formato 9:16 no Instagram Reels, TikTok e YouTube Shorts.

Para gravar, use o DevTools do Chrome em modo mobile (F12 → ícone de celular → iPhone 12 Pro) e capture a janela com OBS em resolução 1080×1920.

---

## 🌐 Variáveis de ambiente

Crie um `.env.local` na raiz do projeto para apontar para o backend em produção:

```env
VITE_API_URL=https://sua-api.railway.app/api
```

E atualize o `src/api.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
})
```

---

## 📄 Licença

MIT
