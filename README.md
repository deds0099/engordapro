# 🐄 EngordaPro - Sistema de Gestão de Bovinos

Sistema completo para gestão de bovinos em engorda, desenvolvido com React, TypeScript e Firebase.

## ✨ Funcionalidades

### 🏛️ Gestão de Fazendas
- Cadastro e gerenciamento de propriedades
- Visualização de estatísticas por fazenda
- Controle de lotes por propriedade

### 📋 Gestão de Lotes
- Criação e organização de lotes de engorda
- Controle de raça predominante
- Cálculo automático de concentrado diário
- Protocolo de adaptação alimentar

### 🐮 Gestão de Animais
- Cadastro individual de bovinos
- Controle de peso com histórico
- Cálculo de GMD (Ganho Médio Diário)
- Identificação por brinco
- Controle de idade e raça

### 💰 Gestão Financeira
- Registro de transações
- Controle de receitas e despesas
- Balanço por fazenda
- Histórico financeiro

### 🔐 Sistema de Autenticação
- Login seguro com email/senha
- Registro de usuários
- Recuperação de senha
- Isolamento de dados por usuário

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI**: Tailwind CSS + Shadcn/ui
- **Backend**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Build**: Vite
- **Deploy**: Firebase Hosting

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Firebase

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/engordapro.git
cd engordapro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication e Firestore
   - Copie as credenciais para `src/firebase.ts`

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse o sistema**
   - Abra http://localhost:8080
   - Registre sua primeira conta
   - Comece a usar o sistema!

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI (Shadcn)
│   ├── Header.tsx      # Cabeçalho da aplicação
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── FarmManagement.tsx    # Gestão de fazendas
│   ├── LotManagement.tsx     # Gestão de lotes
│   ├── AnimalManagement.tsx  # Gestão de animais
│   └── FinancialManagement.tsx # Gestão financeira
├── hooks/              # Hooks customizados
│   ├── useAuth.ts      # Autenticação
│   ├── useCattleData.ts # Dados dos bovinos
│   └── useUserProfile.ts # Perfil do usuário
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
├── firebase.ts         # Configuração do Firebase
└── main.tsx           # Ponto de entrada
```

## 🔧 Configuração do Firebase

### 1. Criar Projeto
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga o assistente de configuração

### 2. Configurar Authentication
1. No console, vá para "Authentication"
2. Clique em "Get started"
3. Ative "Email/Password"
4. Configure as regras de segurança

### 3. Configurar Firestore
1. Vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode"
4. Copie as regras de segurança do arquivo `firestore.rules`

### 4. Configurar Hosting (Opcional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📊 Funcionalidades Técnicas

### Protocolo de Adaptação
- Sistema automático de adaptação alimentar
- 15 dias de protocolo progressivo
- Cálculo automático de concentrado

### Cálculos Automáticos
- GMD (Ganho Médio Diário)
- Peso médio do lote
- Concentrado diário necessário
- Balanço financeiro

### Segurança
- Autenticação por email/senha
- Isolamento de dados por usuário
- Regras de segurança do Firestore
- Validação de formulários

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para o setor pecuário brasileiro**
