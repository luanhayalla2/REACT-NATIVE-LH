import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../config/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useTheme } from '../context/ThemeContext';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  idade?: string;
  telefone: string;
  data: string;
  cpf?: string;
  senha?: string; // se existir localmente (não recomendado)
  uid?: string; // uid do Firebase Auth quando sincronizado
}

export default function ListScreen({ navigation }: any) {
  const { isDark, toggleTheme, colors } = useTheme();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.popToTop();
      return true;
    });

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      // Carregar dados do AsyncStorage (local)
      let usuariosLocais: Usuario[] = [];
      const dadosArmazenados = await AsyncStorage.getItem('usuarios');
      console.log('[LIST] Dados armazenados:', dadosArmazenados);
      
      if (dadosArmazenados) {
        try {
          usuariosLocais = JSON.parse(dadosArmazenados);
          console.log('[LIST] Usuários locais carregados:', usuariosLocais.length);
        } catch (e) {
          console.error('[LIST] Erro ao parsear usuários:', e);
          usuariosLocais = [];
        }
      }
      
      // Carregar dados do Firebase
      let usuariosFirebase: Usuario[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        usuariosFirebase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Usuario));
        console.log('[LIST] Usuários Firebase carregados:', usuariosFirebase.length);
      } catch (erroFirebase) {
        console.warn('Erro ao carregar do Firebase:', erroFirebase);
        // Continua mesmo se Firebase falhar
      }
      
      // Combinar dados (remove duplicatas usando email como identificador)
      const usuariosCombinados = [...usuariosLocais];
      const emailsLocais = new Set(usuariosLocais.map(u => u.email));
      
      usuariosFirebase.forEach(usuarioFB => {
        if (!emailsLocais.has(usuarioFB.email)) {
          usuariosCombinados.push(usuarioFB);
        }
      });
      
      console.log('[LIST] Total de usuários combinados:', usuariosCombinados.length);
      setUsuarios(usuariosCombinados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
      console.error('[LIST] Erro geral:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const deletarUsuario = async (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar este cadastro? Isso também irá remover a conta.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              const usuarioParaDeletar = usuarios.find(u => u.id === id);
              
              // Deletar do Firebase Firestore
              try {
                await deleteDoc(doc(db, 'usuarios', id));
                console.log('Usuário deletado do Firestore');
              } catch (erroFirestore) {
                console.warn('Erro ao deletar do Firestore:', erroFirestore);
              }

              // Deletar conta do Firebase Auth (se o usuário estiver logado com esse email)
              try {
                const currentUser = auth.currentUser;
                if (currentUser && currentUser.email === usuarioParaDeletar?.email) {
                  // Se é o usuário logado, não pode deletar a si mesmo
                  Alert.alert('Erro', 'Não é possível deletar sua própria conta enquanto está logado');
                  return;
                } else if (usuarioParaDeletar?.uid) {
                  // Se temos o uid, precisamos deletar a conta
                  // Nota: deleteUser só funciona com o usuário atualmente autenticado
                  console.log('Usuário tem uid:', usuarioParaDeletar.uid);
                }
              } catch (erroAuth) {
                console.warn('Erro ao deletar do Auth:', erroAuth);
              }

              // Deletar do AsyncStorage local
              const usuariosFiltrados = usuarios.filter((u) => u.id !== id);
              await AsyncStorage.setItem('usuarios', JSON.stringify(usuariosFiltrados));
              
              setUsuarios(usuariosFiltrados);
              Alert.alert('Sucesso', 'Cadastro deletado com sucesso!');
            } catch (erro) {
              Alert.alert('Erro', 'Não foi possível deletar o cadastro');
              console.error(erro);
            }
          },
        },
      ]
    );
  };

  const limparTodos = async () => {
    Alert.alert(
      'Limpar todos',
      'Tem certeza que deseja deletar TODOS os cadastros?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
        },
        {
          text: 'Deletar Tudo',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('usuarios');
              setUsuarios([]);
              Alert.alert('Sucesso', 'Todos os cadastros foram deletados!');
            } catch (erro) {
              Alert.alert('Erro', 'Não foi possível limpar os dados');
              console.error(erro);
            }
          },
        },
      ]
    );
  };

  const editarUsuario = (usuario: Usuario) => {
    console.log('[LIST] Navegando para edição do usuário:', usuario.nome, usuario.id);
    navigation.navigate('EditUser', { usuario });
  };

  const renderizarUsuario = ({ item }: { item: Usuario }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
      <View style={styles.cardContent}>
        <Text style={[styles.cardNome, { color: colors.text }]}>{item.nome}</Text>
        <Text style={[styles.cardTexto, { color: colors.textLight }]}>
          <Text style={[styles.label, { color: colors.text }]}>Email:</Text> {item.email}
        </Text>
        {item.idade ? (
          <Text style={[styles.cardTexto, { color: colors.textLight }]}>
            <Text style={[styles.label, { color: colors.text }]}>Idade:</Text> {item.idade} anos
          </Text>
        ) : null}
        <Text style={[styles.cardTexto, { color: colors.textLight }]}>
          <Text style={[styles.label, { color: colors.text }]}>Telefone:</Text> {item.telefone}
        </Text>
        <Text style={[styles.cardTexto, { color: colors.textLight }]}>
          <Text style={[styles.label, { color: colors.text }]}>Data:</Text> {item.data}
        </Text>
        {item.cpf ? (
          <Text style={[styles.cardTexto, { color: colors.textLight }]}>
            <Text style={[styles.label, { color: colors.text }]}>CPF:</Text> {item.cpf}
          </Text>
        ) : null}
      </View>
      <View style={styles.botoesCard}>
        <TouchableOpacity
          style={[styles.botaoEditar, { backgroundColor: colors.primary }]}
          onPress={() => editarUsuario(item)}
        >
          <Text style={styles.textoBotaoEditar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoDeletar, { backgroundColor: colors.danger }]}
          onPress={() => deletarUsuario(item.id)}
        >
          <Text style={styles.textoBotaoDeletar}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>Carregando...</Text>
      </View>
    );
  }

  const mostrarFlatList = usuarios.length > 0;
  const mostrarBotaoLimpar = usuarios.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Usuários</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={carregarDados} style={styles.iconButton}>
            <MaterialCommunityIcons 
              name="refresh" 
              size={24} 
              color={colors.success}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <MaterialCommunityIcons 
              name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} 
              size={24} 
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.iconButton}>
            <MaterialCommunityIcons name="logout" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.containerInner, { backgroundColor: colors.background }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>Usuários Cadastrados</Text>
        <Text style={[styles.contador, { color: colors.textLight }]}>{usuarios.length} cadastro(s)</Text>

        {mostrarFlatList ? (
          <FlatList
            data={usuarios}
            renderItem={renderizarUsuario}
            keyExtractor={(item) => item.id}
            style={styles.lista}
            scrollEnabled={true}
          />
        ) : (
          <View style={styles.vazioContainer}>
            <MaterialCommunityIcons name="account-off" size={64} color={colors.textLight} />
            <Text style={[styles.textoVazio, { color: colors.textLight }]}>Nenhum cadastro realizado ainda</Text>
            <Text style={[styles.textoVazioSub, { color: colors.textLight }]}>Clique em "NOVO CADASTRO" para começar</Text>
          </View>
        )}

        <View style={[styles.botoesContainer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.botaoNovo, { backgroundColor: colors.success }]}
            onPress={() => {
              console.log('[LIST] Navegando para Register');
              navigation.navigate('Register');
            }}
          >
            <Text style={styles.botaoTexto}>NOVO CADASTRO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAtualizar, { backgroundColor: colors.primary }]}
            onPress={() => {
              console.log('[LIST] Recarregando usuários...');
              carregarDados();
            }}
          >
            <Text style={styles.botaoTexto}>ATUALIZAR LISTA</Text>
          </TouchableOpacity>

          {mostrarBotaoLimpar ? (
            <TouchableOpacity
              style={[styles.botaoLimpar, { backgroundColor: colors.danger }]}
              onPress={limparTodos}
            >
              <Text style={styles.botaoTexto}>LIMPAR TODOS</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.botaoVoltar, { backgroundColor: colors.textLight }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.botaoTexto}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  containerInner: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contador: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  lista: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
  },
  cardContent: {
    flex: 1,
    marginRight: 0,
    marginBottom: 12,
  },
  cardNome: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardTexto: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 20,
  },
  label: {
    fontWeight: '600',
  },
  botoesCard: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  botaoEditar: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textoBotaoEditar: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  botaoDeletar: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textoBotaoDeletar: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textoVazio: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 12,
  },
  textoVazioSub: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  botoesContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
  },
  botaoWrapper: {
    marginBottom: 12,
  },
  botaoNovo: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoAtualizar: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoLimpar: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoVoltar: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
