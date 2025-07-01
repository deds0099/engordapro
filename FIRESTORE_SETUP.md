# Configuração do Firestore para o EngordaPro

## Passos para Configurar o Firestore

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "engordapro")
4. Siga os passos para criar o projeto

### 2. Ativar o Firestore Database

1. No painel do Firebase, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione a localização mais próxima (ex: "us-central1")

### 3. Configurar Autenticação

1. No painel do Firebase, clique em "Authentication"
2. Clique em "Começar"
3. Ative o provedor "E-mail/senha"
4. Configure as configurações de e-mail conforme necessário
5. Opcional: Configure templates de e-mail para recuperação de senha

### 4. Configurar Regras de Segurança

1. No Firestore Database, clique na aba "Regras"
2. Substitua as regras existentes pelas regras do arquivo `firestore.rules`
3. Clique em "Publicar"

### 5. Obter Credenciais

1. No painel do Firebase, clique na engrenagem (⚙️) ao lado de "Visão geral do projeto"
2. Clique em "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique em "Adicionar aplicativo" e escolha "Web"
5. Registre o aplicativo e copie as credenciais
6. Substitua as credenciais no arquivo `src/firebase.ts`

### 6. Estrutura das Coleções

O Firestore deve ter as seguintes coleções:

- `fazendas` - Dados das fazendas (com campo `userId`)
- `transacoes` - Registros financeiros (com campo `userId`)

Cada documento deve ter um campo `userId` para identificar o proprietário.

## Sistema de Autenticação

### Funcionalidades Implementadas

- **Login/Registro**: Usuários podem criar contas com e-mail e senha
- **Recuperação de Senha**: Sistema de reset de senha por e-mail
- **Proteção de Rotas**: Todas as páginas são protegidas por autenticação
- **Logout**: Botão de logout no header
- **Isolamento de Dados**: Cada usuário só acessa seus próprios dados

### Segurança

- Senhas são criptografadas pelo Firebase Auth
- Tokens JWT são gerenciados automaticamente
- Regras do Firestore garantem isolamento de dados
- Sessões são mantidas automaticamente

## Regras de Segurança

As regras no arquivo `firestore.rules` garantem que:
- Apenas usuários autenticados podem acessar os dados
- Cada usuário só pode acessar seus próprios dados
- Os dados são protegidos por ID de usuário
- Operações de criação verificam o userId
- Subcoleções (lotes e animais) herdam a segurança da fazenda pai

## Solução de Problemas

### Erro de Permissão
Se você receber erros de permissão:
1. Verifique se as regras foram publicadas corretamente
2. Confirme que o usuário está autenticado
3. Verifique se o campo `userId` está presente nos documentos
4. Teste o login/registro primeiro

### Erro de Conexão
Se houver problemas de conexão:
1. Verifique se as credenciais do Firebase estão corretas
2. Confirme se o projeto está ativo
3. Verifique se o Firestore está habilitado
4. Confirme se a autenticação está ativada

### Problemas de Autenticação
Se houver problemas com login:
1. Verifique se a autenticação por e-mail/senha está ativada
2. Confirme se o template de e-mail de recuperação está configurado
3. Teste a criação de uma nova conta
4. Verifique os logs do console para erros específicos

# Configuração do Firestore - Solução para Problemas de Permissão

## Problema Identificado
O erro "Missing or insufficient permissions" indica que as regras de segurança do Firestore estão muito restritivas ou não foram configuradas corretamente.

## Solução Passo a Passo

### 1. Acesse o Firebase Console
1. Vá para [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecione seu projeto
3. No menu lateral, clique em **Firestore Database**

### 2. Configure as Regras de Segurança
1. Clique na aba **Regras**
2. Substitua todo o conteúdo pelas regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários - usuário só pode acessar seu próprio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para fazendas - usuário só pode acessar suas próprias fazendas
    match /fazendas/{farmId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow list: if request.auth != null;
      
      // Regras para lotes dentro de fazendas
      match /lotes/{lotId} {
        allow read, write, create: if request.auth != null && 
          get(/databases/$(database)/documents/fazendas/$(farmId)).data.userId == request.auth.uid;
        
        // Regras para animais dentro de lotes
        match /animais/{animalId} {
          allow read, write, create: if request.auth != null && 
            get(/databases/$(database)/documents/fazendas/$(farmId)).data.userId == request.auth.uid;
        }
      }
    }
    
    // Regras para transações - usuário só pode acessar suas próprias transações
    match /transacoes/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow list: if request.auth != null;
    }
  }
}
```

### 3. Publique as Regras
1. Clique em **Publicar** para salvar as regras
2. Aguarde a confirmação de que as regras foram publicadas

### 4. Verifique a Configuração
1. Certifique-se de que o Firestore está em modo de produção (não em modo de teste)
2. Verifique se a autenticação está habilitada no Firebase Console

## Regras Explicadas

### Para Fazendas (`/fazendas/{farmId}`)
- **read, write**: Usuário pode ler/escrever apenas suas próprias fazendas
- **create**: Usuário pode criar fazendas com seu próprio userId
- **list**: Usuário autenticado pode listar fazendas (necessário para o query)

### Para Lotes (`/fazendas/{farmId}/lotes/{lotId}`)
- **read, write, create**: Usuário pode gerenciar lotes apenas em suas próprias fazendas

### Para Animais (`/fazendas/{farmId}/lotes/{lotId}/animais/{animalId}`)
- **read, write, create**: Usuário pode gerenciar animais apenas em seus próprios lotes

### Para Transações (`/transacoes/{transactionId}`)
- **read, write**: Usuário pode ler/escrever apenas suas próprias transações
- **create**: Usuário pode criar transações com seu próprio userId
- **list**: Usuário autenticado pode listar transações

## Teste Após a Configuração

1. Recarregue a aplicação no navegador
2. Faça login novamente se necessário
3. Tente cadastrar uma nova fazenda
4. Verifique se não há mais erros de permissão no console

## Troubleshooting

### Se ainda houver problemas:
1. **Limpe o cache do navegador** (Ctrl+F5)
2. **Faça logout e login novamente** na aplicação
3. **Verifique se as regras foram publicadas** no Firebase Console
4. **Aguarde alguns minutos** para as regras propagarem

### Para Desenvolvimento (NÃO USE EM PRODUÇÃO)
Se precisar de regras mais permissivas para desenvolvimento:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **ATENÇÃO**: Esta regra permite acesso total a qualquer usuário autenticado. Use apenas para desenvolvimento! 