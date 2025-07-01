# 🔥 Guia de Configuração do Firebase Authentication

## Erro: auth/configuration-not-found

Este erro ocorre quando o Firebase Authentication não está ativado no console do Firebase.

## Passos para Resolver:

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Faça login com sua conta Google
- Selecione o projeto "engordapro"

### 2. Ative o Authentication
- No menu lateral esquerdo, clique em "Authentication"
- Clique em "Começar" ou "Get started"
- Você verá uma tela de configuração

### 3. Configure o Provedor de E-mail/Senha
- Na aba "Sign-in method", clique em "Email/Password"
- Clique no botão de toggle para **ATIVAR** (deve ficar verde)
- Marque as opções:
  - ✅ "Email/Password" (ativado)
  - ✅ "Email link (passwordless sign-in)" (opcional)
- Clique em "Salvar"

### 4. Configure o Template de E-mail (Opcional)
- Na aba "Templates", clique em "Password reset"
- Personalize o assunto e conteúdo do e-mail
- Clique em "Salvar"

### 5. Configure as Regras do Firestore
- No menu lateral, clique em "Firestore Database"
- Clique na aba "Regras"
- Substitua as regras existentes pelas regras do arquivo `firestore.rules`
- Clique em "Publicar"

### 6. Verifique as Credenciais
- No menu lateral, clique na engrenagem (⚙️) ao lado de "Visão geral do projeto"
- Clique em "Configurações do projeto"
- Role para baixo até "Seus aplicativos"
- Verifique se o app web está registrado
- Se não estiver, clique em "Adicionar aplicativo" > "Web"

### 7. Teste a Configuração
Após fazer essas configurações:
1. Volte para a aplicação
2. Recarregue a página
3. Tente fazer login ou criar uma conta

## Verificação Rápida

Para verificar se está funcionando, abra o console do navegador (F12) e procure por:
- ✅ "Firebase Auth initialized"
- ❌ "auth/configuration-not-found" (não deve aparecer)

## Solução de Problemas

### Se ainda aparecer o erro:
1. **Limpe o cache do navegador**
2. **Verifique se está no projeto correto** no Firebase Console
3. **Confirme que o Authentication está ativado**
4. **Verifique se as credenciais estão corretas** no `src/firebase.ts`

### Se o projeto não existir:
1. Crie um novo projeto no Firebase Console
2. Ative o Firestore Database
3. Ative o Authentication
4. Registre um novo app web
5. Copie as novas credenciais para `src/firebase.ts`

## Credenciais Atuais (src/firebase.ts)

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDHljGGlXWdlkFhFbcB8Ja9AycvwIO9Ruo",
  authDomain: "engordapro.firebaseapp.com",
  projectId: "engordapro",
  storageBucket: "engordapro.firebasestorage.app",
  messagingSenderId: "280264421838",
  appId: "1:280264421838:web:a9d6aa67f561fb03507b9f"
};
```

**Verifique se estas credenciais correspondem ao seu projeto no Firebase Console.** 