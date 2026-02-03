import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebaseConfig';
import { collection, updateDoc, doc } from 'firebase/firestore';
import { useTheme } from '../context/ThemeContext';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  idade?: string;
  telefone: string;
  cpf?: string;
  dataCriacao?: string;
  data?: string;
}

export default function EditScreen({ route, navigation }: any) {
  if (!route?.params?.usuario) {
    console.error('[EDIT] ❌ Nenhum usuário fornecido para edição');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro: Nenhum usuário selecionado para edição</Text>
      </View>
    );
  }

  const usuarioOriginal: Usuario = route.params.usuario;
  console.log('[EDIT] 📝 Abrindo tela de edição para:', usuarioOriginal.nome);
  
  const { isDark, toggleTheme, colors: themeColors } = useTheme();

  const [nome, setNome] = useState(usuarioOriginal.nome);
  const [email, setEmail] = useState(usuarioOriginal.email);
  const [idade, setIdade] = useState(usuarioOriginal.idade || '');
  const [telefone, setTelefone] = useState(usuarioOriginal.telefone);
  const [cpf, setCpf] = useState(usuarioOriginal.cpf || '');
  const [loading, setLoading] = useState(false);

  const [nomeError, setNomeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [idadeError, setIdadeError] = useState(false);
  const [telefoneError, setTelefoneError] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const validarEmail = (email: string) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const validarTelefone = (telefone: string) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    return apenasNumeros.length === 11;
  };

  const validarNome = (nome: string) => {
    return nome.trim().length >= 3;
  };

  const validarIdade = (idade: string) => {
    const idadeNum = parseInt(idade);
    return !isNaN(idadeNum) && idadeNum >= 18 && idadeNum <= 120;
  };

  const validarFormulario = () => {
    let temErro = false;

    if (!validarNome(nome)) {
      setNomeError(true);
      temErro = true;
    } else {
      setNomeError(false);
    }

    if (!validarEmail(email)) {
      setEmailError(true);
      temErro = true;
    } else {
      setEmailError(false);
    }

    if (!validarIdade(idade)) {
      setIdadeError(true);
      temErro = true;
    } else {
      setIdadeError(false);
    }

    if (!validarTelefone(telefone)) {
      setTelefoneError(true);
      temErro = true;
    } else {
      setTelefoneError(false);
    }

    return !temErro;
  };

  const formatarTelefone = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, '');

    if (apenasNumeros.length === 0) return '';
    if (apenasNumeros.length <= 2) return `(${apenasNumeros}`;
    if (apenasNumeros.length <= 7) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    }

    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
  };

  const formatarCpf = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, '').slice(0, 11);
    if (apenasNumeros.length === 0) return '';
    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
  };

  const salvarAlteracoes = async () => {
    console.log('[EDIT] Iniciando validação do formulário');
    console.log('[EDIT] Dados a salvar:', { nome, email, idade, telefone, cpf });
    
    if (!validarFormulario()) {
      console.error('[EDIT] ❌ Formulário com erros');
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      const usuarioAtualizado = {
        id: usuarioOriginal.id,
        nome,
        email,
        idade,
        telefone,
        cpf,
        data: usuarioOriginal.data || usuarioOriginal.dataCriacao,
      };

      console.log('[EDIT] ✅ Usuário atualizado (objeto):', usuarioAtualizado);

      // Atualizar AsyncStorage
      const dados = await AsyncStorage.getItem('usuarios');
      let usuarios: any = [];

      if (dados) {
        try {
          usuarios = JSON.parse(dados);
          console.log('[EDIT] Total de usuários em AsyncStorage:', usuarios.length);
        } catch (e) {
          console.error('[EDIT] Erro ao parsear:', e);
          usuarios = [];
        }
      }

      const indice = usuarios.findIndex((u: any) => u.id === usuarioOriginal.id);
      console.log('[EDIT] Índice do usuário encontrado:', indice);
      
      if (indice !== -1) {
        usuarios[indice] = usuarioAtualizado;
        await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('[EDIT] ✅ Usuário atualizado em AsyncStorage');
      } else {
        console.error('[EDIT] ❌ Usuário não encontrado em AsyncStorage');
      }

      // Atualizar Firestore se existir lá
      try {
        const docRef = doc(db, 'usuarios', usuarioOriginal.id);
        await updateDoc(docRef, {
          nome,
          email,
          idade,
          telefone,
          cpf,
        });
        console.log('[EDIT] ✅ Usuário atualizado em Firestore');
      } catch (firebaseError) {
        console.warn('[EDIT] ⚠️ Erro ao atualizar no Firestore:', firebaseError);
        // Continua mesmo se Firestore falhar
      }

      Alert.alert('Sucesso', 'Cadastro atualizado com sucesso!');
      navigation.goBack();
    } catch (erro: any) {
      console.error('[EDIT] ❌ Erro ao salvar:', erro);
      Alert.alert('Erro', 'Erro ao atualizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <View style={styles.headerButtonsLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={themeColors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Editar Cadastro</Text>
        <View style={styles.headerButtonsRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <MaterialCommunityIcons name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} size={24} color={themeColors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor: themeColors.background }]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
        >

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Nome</Text>
            <TextInput
              style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.surface, color: themeColors.text }, nomeError && styles.inputError]}
              placeholder="Digite seu nome completo"
              placeholderTextColor={themeColors.textLight}
              value={nome}
              onChangeText={(texto) => {
                setNome(texto);
                setNomeError(false);
              }}
            />
            {nomeError && <Text style={styles.errorText}>Nome deve ter pelo menos 3 caracteres</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.surface, color: themeColors.text }, emailError && styles.inputError]}
              placeholder="seu@email.com"
              placeholderTextColor={themeColors.textLight}
              keyboardType="email-address"
              value={email}
              onChangeText={(texto) => {
                setEmail(texto);
                setEmailError(false);
              }}
            />
            {emailError && <Text style={styles.errorText}>Email inválido</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Idade</Text>
            <TextInput
              style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.surface, color: themeColors.text }, idadeError && styles.inputError]}
              placeholder="18"
              placeholderTextColor={themeColors.textLight}
              keyboardType="numeric"
              value={idade}
              onChangeText={(texto) => {
                setIdade(texto);
                setIdadeError(false);
              }}
            />
            {idadeError && <Text style={styles.errorText}>Idade deve ser entre 18 e 120 anos</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Telefone</Text>
            <TextInput
              style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.surface, color: themeColors.text }, telefoneError && styles.inputError]}
              placeholder="(11) 98765-4321"
              placeholderTextColor={themeColors.textLight}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={(texto) => {
                setTelefone(formatarTelefone(texto));
                setTelefoneError(false);
              }}
            />
            {telefoneError && <Text style={styles.errorText}>Telefone inválido (11 dígitos)</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>CPF</Text>
            <TextInput
              style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.surface, color: themeColors.text }]}
              placeholder="123.456.789-10"
              placeholderTextColor={themeColors.textLight}
              keyboardType="numeric"
              value={cpf}
              onChangeText={(texto) => setCpf(formatarCpf(texto))}
            />
          </View>

          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={[styles.botaoSalvar, { backgroundColor: themeColors.success }, loading && { opacity: 0.6 }]}
              onPress={salvarAlteracoes}
              disabled={loading}
            >
              <Text style={[styles.botaoTexto, { color: themeColors.surface }]}>{loading ? 'Salvando...' : 'SALVAR ALTERAÇÕES'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoCancelar, { backgroundColor: themeColors.textLight }]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={[styles.botaoTexto, { color: themeColors.surface }]}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.25,
  },
  headerButtonsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.25,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 0.5,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  titulo: {
    fontSize: width > 400 ? 28 : 24,
    fontWeight: '700',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: height * 0.025,
  },
  label: {
    fontSize: width > 400 ? 14 : 13,
    fontWeight: '700',
    marginBottom: height * 0.01,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    fontSize: width > 400 ? 16 : 15,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: height * 0.008,
    fontWeight: '500',
  },
  botoesContainer: {
    marginTop: height * 0.04,
    gap: height * 0.015,
  },
  botaoSalvar: {
    borderRadius: 12,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(16, 185, 129, 0.3)',
  },
  botaoCancelar: {
    borderRadius: 12,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  botaoTexto: {
    fontWeight: '700',
    fontSize: width > 400 ? 14 : 13,
    letterSpacing: 0.5,
  },
});
