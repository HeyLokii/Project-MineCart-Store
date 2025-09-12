# Vercel Environment Variables Setup

Você precisa adicionar essas variáveis de ambiente no painel do Vercel:

## Como configurar:

1. Acesse https://vercel.com/dashboard
2. Selecione o projeto "Project-MineCart-Store" 
3. Vá em Settings → Environment Variables
4. Adicione uma por uma:

### Firebase Variables:

```
VITE_FIREBASE_API_KEY=AIzaSyAf2Li7xXh30EUjMAjgZjGogkMWzr9SNaA
VITE_FIREBASE_AUTH_DOMAIN=minecartstore.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=minecartstore
VITE_FIREBASE_STORAGE_BUCKET=minecartstore.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=891786982150
VITE_FIREBASE_APP_ID=1:891786982150:web:f52ae4391e8bc927c76487
VITE_FIREBASE_MEASUREMENT_ID=G-RR7F9G54RP
```

### Important:
- Certifique-se de que todas as variáveis têm o prefixo `VITE_`
- Aplique para Production, Preview e Development environments
- Após adicionar, faça um novo deploy

## Alternativa rápida via Vercel CLI:

Se você tiver acesso ao Vercel CLI:

```bash
npx vercel login
npx vercel env add VITE_FIREBASE_API_KEY production
npx vercel env add VITE_FIREBASE_AUTH_DOMAIN production
npx vercel env add VITE_FIREBASE_PROJECT_ID production
npx vercel env add VITE_FIREBASE_STORAGE_BUCKET production
npx vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
npx vercel env add VITE_FIREBASE_APP_ID production
npx vercel env add VITE_FIREBASE_MEASUREMENT_ID production
```