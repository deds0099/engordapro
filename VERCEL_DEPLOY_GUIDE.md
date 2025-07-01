# 🚀 Guia de Deploy no Vercel - EngordaPro

## 📋 Pré-requisitos

1. **Conta no Vercel**: https://vercel.com
2. **Projeto no GitHub**: https://github.com/deds0099/engordapro
3. **Projeto no Firebase**: Configurado e funcionando

## 🔧 Configuração do Firebase para Produção

### 1. Configurar Domínios Autorizados

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá para **Authentication** → **Settings** → **Authorized domains**
3. Adicione seu domínio do Vercel:
   - `seu-projeto.vercel.app`
   - `www.seu-projeto.vercel.app`
   - Seu domínio customizado (se tiver)

### 2. Configurar Regras do Firestore

1. No Firebase Console, vá para **Firestore Database** → **Rules**
2. Cole as regras atualizadas do arquivo `firestore.rules`
3. Clique em **Publish**

### 3. Verificar Configuração do Projeto

Certifique-se de que o arquivo `src/firebase.ts` está correto:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHljGGlXWdlkFhFbcB8Ja9AycvwIO9Ruo",
  authDomain: "engordapro.firebaseapp.com",
  projectId: "engordapro",
  storageBucket: "engordapro.firebasestorage.app",
  messagingSenderId: "280264421838",
  appId: "1:280264421838:web:a9d6aa67f561fb03507b9f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

## 🚀 Deploy no Vercel

### 1. Conectar com GitHub

1. Acesse https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **New Project**
4. Importe o repositório `deds0099/engordapro`

### 2. Configurar Build

**Framework Preset**: Vite  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### 3. Variáveis de Ambiente (Opcional)

Se você quiser usar variáveis de ambiente, adicione no Vercel:

```
VITE_FIREBASE_API_KEY=AIzaSyDHljGGlXWdlkFhFbcB8Ja9AycvwIO9Ruo
VITE_FIREBASE_AUTH_DOMAIN=engordapro.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=engordapro
VITE_FIREBASE_STORAGE_BUCKET=engordapro.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=280264421838
VITE_FIREBASE_APP_ID=1:280264421838:web:a9d6aa67f561fb03507b9f
```

### 4. Deploy

1. Clique em **Deploy**
2. Aguarde o build completar
3. Teste o site no domínio fornecido

## 🔍 Debug de Problemas

### Problema: Não consegue cadastrar fazendas

**Possíveis causas:**
1. **Domínio não autorizado no Firebase**
2. **Regras do Firestore muito restritivas**
3. **Usuário não autenticado**

**Soluções:**

#### 1. Verificar Console do Navegador
- Abra F12 no navegador
- Vá para a aba Console
- Tente cadastrar uma fazenda
- Veja os logs de erro

#### 2. Verificar Autenticação
```javascript
// No console do navegador
import { auth } from './src/firebase';
console.log('Usuário atual:', auth.currentUser);
```

#### 3. Testar Regras do Firestore
```javascript
// No console do navegador
import { db } from './src/firebase';
import { collection, addDoc } from 'firebase/firestore';

try {
  const docRef = await addDoc(collection(db, 'test'), {
    test: true,
    userId: auth.currentUser?.uid
  });
  console.log('Teste OK:', docRef.id);
} catch (error) {
  console.error('Erro:', error);
}
```

### Problema: Erro de CORS

**Solução:**
1. Verifique se o domínio está na lista de domínios autorizados do Firebase
2. Limpe o cache do navegador
3. Teste em modo incógnito

### Problema: Build falha no Vercel

**Soluções:**
1. Verifique se todas as dependências estão no `package.json`
2. Execute `npm run build` localmente para testar
3. Verifique os logs de build no Vercel

## 📱 Testando o Deploy

### 1. Teste de Autenticação
- Registre uma nova conta
- Faça login
- Verifique se o usuário aparece no Firebase Console

### 2. Teste de Funcionalidades
- Cadastre uma fazenda
- Crie um lote
- Adicione animais
- Registre pesagens
- Teste o controle financeiro

### 3. Teste de Responsividade
- Teste em diferentes tamanhos de tela
- Teste no celular
- Verifique se todos os botões funcionam

## 🔄 Atualizações

Para atualizar o site:

1. **Faça as mudanças no código**
2. **Commit e push para o GitHub**
3. **O Vercel fará deploy automático**

```bash
# Comandos para atualizar
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Descrição da atualização"
& "C:\Program Files\Git\bin\git.exe" push
```

## 📞 Suporte

Se ainda houver problemas:

1. **Verifique os logs** no console do navegador
2. **Teste localmente** primeiro
3. **Verifique as regras** do Firestore
4. **Confirme a configuração** do Firebase

---

**🎯 Dica**: Sempre teste localmente antes de fazer deploy! 