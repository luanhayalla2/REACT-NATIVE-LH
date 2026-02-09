# 📱 CRUD React Native com Firebase Firestore

## 📝 Descrição

Aplicação mobile desenvolvida em **React Native** com **TypeScript**, integrada ao **Firebase Firestore** para gerenciamento de dados em nuvem. O projeto inclui autenticação, formulários de cadastro e listagem de usuários com sincronização em tempo real.

---

## 🎥 Demonstração do Projeto

📹 **Assista ao vídeo de demonstração:**
- [Video HAYALLASLZ](./videos/video-HAYALLASLZ.webm) - Demonstração completa da aplicação em funcionamento

### 📸 Screenshots do App

| Tela de Login | Cadastro | Recuperar Senha |
|---------------|----------|-----------------|
| ![Login Screen](./screenshots/login.svg) | ![Register Screen](./screenshots/register.svg) | ![Forgot Password](./screenshots/forgot-password.svg) |

| Listagem de Usuários | Tema Claro/Escuro |
|---------------------|------------------|
| ![List Screen](./screenshots/list.svg) | ![Dark Mode](./screenshots/theme.svg) |

---

## ✨ Funcionalidades

- ✅ **Autenticação segura** com Firebase
- ✅ **Cadastro de usuários** com validação em tempo real
- ✅ **Operações CRUD completas** (Create, Read, Update, Delete)
- ✅ **Sincronização com Firestore** em nuvem
- ✅ **Armazenamento local** com AsyncStorage
- ✅ **Interface responsiva** com React Navigation
- ✅ **Type safety** completo com TypeScript
- ✅ **Tratamento de erros** robusto
- ✅ **Loading states** e feedback do usuário
- ✅ **Recuperação de senha** via email com Firebase

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| React Native | Latest | Framework móvel |
| Expo | Latest | Plataforma de desenvolvimento |
| TypeScript | Latest | Type safety |
| Firebase | Latest | Backend e Firestore |
| React Navigation | Latest | Navegação entre telas |
| AsyncStorage | Latest | Armazenamento local |

---

## 📦 Requisitos de Instalação

### Pré-requisitos:
- **Node.js** 16+ instalado
- **npm** ou **yarn**
- **Expo CLI** instalado globalmente (`npm install -g expo-cli`)
- Conta no **Firebase** com projeto criado

---

## 🚀 Configuração Inicial

### 1️⃣ Clonar o Repositório
```bash
git clone <seu-repositorio>
cd REACT-NATIVE--HX--O
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com suas credenciais do Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCAlU5u8w_c_3e49KmmZxfRQ7WP7cN04s8
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=react-native-6deb2.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=react-native-6deb2
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=react-native-6deb2.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=810695809271
EXPO_PUBLIC_FIREBASE_APP_ID=1:810695809271:web:87eee592f73cb13bcddbf2
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HXQK8GEBMQ
```

### 4️⃣ Limpar Cache e Iniciar
```bash
npm install source-map@0.6.1 --save-exact
npx expo start --clear
```

---

## 📱 Como Executar

### Opção 1: No Emulador Android/iOS
```bash
npx expo start
# Pressione 'a' para Android ou 'i' para iOS
```

### Opção 2: No Expo Go (Celular Real)
```bash
npx expo start
# Escaneie o QR code com o Expo Go
```

### Opção 3: Na Web
```bash
npx expo start --web
# Abre automaticamente no navegador
```

---

## 📚 Estrutura do Projeto

```
src/
├── services/
│   ├── firebaseConfig.ts          # Inicialização Firebase
│   └── firestoreService.ts        # Funções CRUD
├── screens/
│   ├── LoginScreen.tsx            # Tela de login
│   ├── RegisterScreen.tsx         # Cadastro de usuários
│   ├── ForgotPasswordScreen.tsx   # Recuperação de senha
│   ├── ListScreen.tsx             # Listagem de usuários
│   ├── HomeScreen.tsx             # Tela inicial
│   └── ProfileScreen.tsx          # Perfil do usuário
├── navigation/
│   └── AppNavigator.tsx           # Configuração de rotas
└── components/
    └── ...

assets/                             # Imagens e ícones
node_modules/                       # Dependências
.env                               # Variáveis de ambiente
app.json                           # Config do Expo
package.json                       # Dependências do npm
tsconfig.json                      # Config do TypeScript
```

---

## 🔧 API do Firestore Service

### Adicionar Documento
```typescript
import { addDocument } from './src/services/firestoreService';

await addDocument('users', {
  name: 'João Silva',
  email: 'joao@email.com',
  idade: '25',
  phone: '11999999999',
  createdAt: new Date()
});
```

### Buscar Todos os Documentos
```typescript
import { getDocuments } from './src/services/firestoreService';

const users = await getDocuments('users');
```

### Buscar Documento Específico
```typescript
import { getDocument } from './src/services/firestoreService';

const user = await getDocument('users', 'docId');
```

### Atualizar Documento
```typescript
import { updateDocument } from './src/services/firestoreService';

await updateDocument('users', 'docId', { name: 'Novo Nome' });
```

### Deletar Documento
```typescript
import { deleteDocument } from './src/services/firestoreService';

await deleteDocument('users', 'docId');
```

### Filtrar por Campo
```typescript
import { queryByField } from './src/services/firestoreService';

const usersByEmail = await queryByField('users', 'email', 'joao@email.com');
```

### Recuperar Senha
```typescript
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './src/config/firebaseConfig';

// Enviar email de recuperação de senha
await sendPasswordResetEmail(auth, 'usuario@email.com');
```

Uso na tela:
1. Usuário clica em "Esqueci minha senha" na tela de Login
2. Digita seu email cadastrado
3. Clica em "Enviar Link de Redefinição"
4. Recebe email com link seguro do Firebase
5. Segue o link e define uma nova senha
6. Volta ao Login com a nova senha

---

## 🔐 Segurança

### Boas Práticas Implementadas:
- 🔒 Credenciais no `.env` (nunca commitadas)
- 🔒 Variáveis de ambiente via Expo
- 🔒 Validação de dados no cliente
- 🔒 Type safety com TypeScript

### Configurar Regras do Firestore:
Acesse [Firebase Console](https://console.firebase.google.com) e configure as regras:

**Modo de Teste (Desenvolvimento):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Modo de Produção (Recomendado):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## ⚠️ Troubleshooting

| Problema | Solução |
|----------|---------|
| `Cannot find module 'source-map/lib/util'` | Execute: `npm install source-map@0.6.1 --save-exact` |
| `Firebase not initialized` | Verifique se `.env` está correto e na raiz do projeto |
| `Erro de autenticação` | Confirme a **API Key** no `.env` |
| `Dados não aparecem no Firestore` | Verifique as **regras de segurança** no Console |
| `Erro de permissão` | Configure o Firestore em **modo de teste** |
| `Porta 19000 já em uso` | Execute: `lsof -ti:19000 | xargs kill -9` |

---

## 📊 Fluxo de Dados

```
Usuário preenche formulário
    ↓
Validação local (email, campos obrigatórios)
    ↓
Envia para Firebase Firestore
    ↓
Firestore cria documento na coleção 'users'
    ↓
Sincroniza e salva localmente (AsyncStorage)
    ↓
Exibe mensagem de sucesso e limpa formulário
```

---

## 🚦 Scripts Disponíveis

```bash
# Iniciar o servidor Expo
npm start

# Iniciar com cache limpo
npx expo start --clear

# Executar testes (se configurado)
npm test

# Build para iOS
eas build --platform ios

# Build para Android
eas build --platform android

# Auditar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

---

## 📋 Checklist de Configuração

- [ ] Node.js 16+ instalado
- [ ] Projeto Firebase criado
- [ ] Arquivo `.env` preenchido com credenciais
- [ ] `npm install` executado com sucesso
- [ ] `npm install source-map@0.6.1 --save-exact` executado
- [ ] `npx expo start --clear` rodando sem erros
- [ ] App carregando no emulador/Expo Go
- [ ] Formulário de cadastro funcionando
- [ ] Dados aparecendo no Firebase Console

---

## 🎓 Próximos Passos

1. **Configurar Autenticação:** ✅
   - ✅ Implementar login com email/senha
   - ✅ Implementar recuperação de senha
   - [ ] Adicionar login social (Google, Apple)

2. **Melhorar UX:**
   - Adicionar temas (dark/light mode) - ✅ Implementado
   - Implementar animações
   - Melhorar feedback do usuário

3. **Otimizações:**
   - Implementar paginação
   - Adicionar busca/filtro avançado
   - Cache inteligente

4. **Testes:**
   - Testes unitários (Jest)
   - Testes de integração
   - Testes E2E (Detox)

---

## 📚 Recursos Úteis

- 🔗 [Documentação Firebase](https://firebase.google.com/docs)
- 🔗 [React Native Docs](https://reactnative.dev/)
- 🔗 [Expo Documentation](https://docs.expo.dev/)
- 🔗 [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contribuindo

Para contribuir com este projeto:

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 💬 Suporte

Tiver dúvidas ou problemas? Abra uma **issue** ou entre em contato com o time de desenvolvimento.

---

## 🎉 Créditos

Desenvolvido para a **SENAC - Técnico em Desenvolvimento de Sistemas**

**Última atualização:** Fevereiro 2026

---

**Aproveite! 🚀**
