import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }: any) {
  const { isDark, toggleTheme, colors } = useTheme();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log('[REGISTER] Tentativa de cadastro:', { nome, idade, telefone, cpf, email });
    
    if (!nome || !idade || !telefone || !cpf || !email || !senha || !confirmSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum < 13 || idadeNum > 120) {
      Alert.alert('Erro', 'Por favor, insira uma idade válida (13-120 anos)');
      return;
    }

    // Basic CPF validation (11 digits)
    const cpfClean = cpf.replace(/\D/g, '');
    console.log('[REGISTER] CPF limpo:', cpfClean, 'Comprimento:', cpfClean.length);
    
    if (cpfClean.length !== 11) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido (11 dígitos)');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Verificar se o email já está cadastrado
      const dadosArmazenados = await AsyncStorage.getItem('usuarios');
      const usuarios = dadosArmazenados ? JSON.parse(dadosArmazenados) : [];

      const usuarioExistente = usuarios.find((u: any) => u.email === email);
      if (usuarioExistente) {
        Alert.alert('Erro', 'Este email já está cadastrado');
        setLoading(false);
        return;
      }

      // Adicionar novo usuário
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        idade: idadeNum.toString(),
        telefone,
        cpf: cpfClean,
        email,
        senha, // Nota: Em produção, a senha deve ser hashada
        data: new Date().toISOString(),
      };

      usuarios.push(novoUsuario);
      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

      console.log('[REGISTER] ✅ Usuário cadastrado:', novoUsuario);
      console.log('[REGISTER] ✅ Total de usuários:', usuarios.length);

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setNome('');
            setIdade('');
            setTelefone('');
            setCpf('');
            setEmail('');
            setSenha('');
            setConfirmSenha('');
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      console.error('[REGISTER] ❌ Erro ao cadastrar:', error);
      console.error('[REGISTER] Detalhes do erro:', error.message);
      Alert.alert('Erro', 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}> 
        <View style={styles.headerButtonsLeft}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <MaterialCommunityIcons name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cadastro</Text>
        <View style={styles.headerButtonsRight}>
          <TouchableOpacity onPress={() => Alert.alert('Notificação', 'Esta é uma notificação de teste do módulo de notificações!')} style={styles.iconButton}>
            <MaterialCommunityIcons name="bell" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.iconButton}>
            <MaterialCommunityIcons name="logout" size={22} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={{ backgroundColor: colors.background }}
        >
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons name="account-plus" size={56} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>Preencha os dados abaixo</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nome Completo</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Seu nome completo"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Idade</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Sua idade"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
                value={idade}
                onChangeText={setIdade}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Telefone</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="(11) 99999-9999"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>CPF</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="000.000.000-00"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
                maxLength={14}
                value={cpf}
                onChangeText={(text) => {
                  // Remove tudo que não é número
                  const cleaned = text.replace(/\D/g, '');
                  if (cleaned.length <= 11) {
                    // Formata: XXX.XXX.XXX-XX
                    if (cleaned.length <= 3) {
                      setCpf(cleaned);
                    } else if (cleaned.length <= 6) {
                      setCpf(cleaned.slice(0, 3) + '.' + cleaned.slice(3));
                    } else if (cleaned.length <= 9) {
                      setCpf(cleaned.slice(0, 3) + '.' + cleaned.slice(3, 6) + '.' + cleaned.slice(6));
                    } else {
                      setCpf(cleaned.slice(0, 3) + '.' + cleaned.slice(3, 6) + '.' + cleaned.slice(6, 9) + '-' + cleaned.slice(9));
                    }
                  }
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Confirmar Senha</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                secureTextEntry
                value={confirmSenha}
                onChangeText={setConfirmSenha}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }, loading && { backgroundColor: colors.primaryLight }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.buttonText, { color: colors.surface }]}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.warning, borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => Alert.alert('Notificação', 'Esta é uma notificação de teste do módulo de notificações!')}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Testar Notificação</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textLight }]}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    flex: 1,
    textAlign: 'center',
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
    marginLeft: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
