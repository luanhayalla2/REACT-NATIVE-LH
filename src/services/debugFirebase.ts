import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';

export async function debugFirebaseConnection() {
  console.log('\n🔍 INICIANDO DIAGNÓSTICO DO FIREBASE...\n');

  try {
    // Teste 1: Verificar se db está inicializado
    console.log('📍 Teste 1: Verificando inicialização do Firestore...');
    if (!db) {
      console.error('❌ FALHA: db não foi inicializado!');
      return { success: false, error: 'db não inicializado' };
    }
    console.log('✅ Firestore inicializado corretamente\n');

    // Teste 2: Tentar ler da coleção 'users'
    console.log('📍 Teste 2: Tentando ler coleção "users"...');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(1));
    const snapshot = await getDocs(q);
    console.log(`✅ Leitura bem-sucedida. Documentos encontrados: ${snapshot.size}\n`);

    // Teste 3: Criar documento de teste
    console.log('📍 Teste 3: Criando documento de teste...');
    const testData = {
      name: 'TESTE DEBUG - ' + new Date().toLocaleTimeString('pt-BR'),
      email: 'debug@teste.com',
      idade: '99',
      phone: '11999999999',
      testedAt: serverTimestamp(),
    };

    console.log('Enviando dados:', JSON.stringify(testData, null, 2));
    const docRef = await addDoc(collection(db, 'users'), testData);
    console.log('✅ Documento criado com sucesso!');
    console.log(`📄 ID: ${docRef.id}\n`);

    // Resumo final
    console.log('═'.repeat(60));
    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('═'.repeat(60));
    console.log('📊 Resumo:');
    console.log('  ✅ Firebase conectado');
    console.log('  ✅ Firestore acessível');
    console.log('  ✅ Coleção "users" encontrada');
    console.log('  ✅ Documento criado com sucesso');
    console.log('\n🎉 Sua configuração está correta!\n');

    return { success: true, docId: docRef.id };

  } catch (error: any) {
    console.error('\n❌ ERRO DURANTE O DIAGNÓSTICO!\n');
    console.error('Tipo de erro:', error.code || 'DESCONHECIDO');
    console.error('Mensagem:', error.message);
    console.error('Detalhes completos:', error);

    console.log('\n🔧 POSSÍVEIS SOLUÇÕES:\n');

    if (error.code === 'permission-denied') {
      console.log('❌ PROBLEMA: Regras de segurança bloqueando a operação');
      console.log('✅ SOLUÇÃO: No Firebase Console, vá a Firestore > Regras e defina:');
      console.log(`
rules_version = '3';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
      `);
      console.log('   (Para produção, use regras mais seguras)\n');
    }

    if (error.code === 'failed-precondition') {
      console.log('❌ PROBLEMA: Firestore não está habilitado ou índices faltando');
      console.log('✅ SOLUÇÃO: No Firebase Console, habilite o Firestore\n');
    }

    if (error.message.includes('auth')) {
      console.log('❌ PROBLEMA: Erro de autenticação/permissão');
      console.log('✅ SOLUÇÃO: Verifique as credenciais do Firebase\n');
    }

    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

// Função auxiliar para chamar o debug
export function setupDebugLogging() {
  // Executar diagnóstico uma vez ao iniciar
  debugFirebaseConnection();
}
