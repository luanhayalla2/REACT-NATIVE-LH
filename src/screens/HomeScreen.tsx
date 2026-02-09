import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Design System (cores padrão - será sobrescrito pelo tema)
const defaultColors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  shadow: '#000000',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export default function HomeScreen({ navigation }: any) {
  const { isDark, toggleTheme, colors: themeColors } = useTheme();
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    console.log('HomeScreen montado');
    return () => {
      console.log('HomeScreen desmontado');
    };
  }, []);

  const handlePressIn = (id: string) => {
    setIsPressed(id);
  };

  const handlePressOut = () => {
    setIsPressed(null);
  };

  // Função de teste para validar Firestore
  const testFirestore = async () => {
    setTestLoading(true);
    try {
      console.log('[TEST] Iniciando teste de Firestore...');
      const usersCollectionRef = collection(db, 'users');
      const snapshot = await getDocs(usersCollectionRef);
      
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const message = `✅ Firestore conectado! Encontrados ${users.length} usuário(s).`;
      console.log('[TEST] ' + message);
      console.log('[TEST] Dados:', users);
      
      Alert.alert(
        'Sucesso',
        `Firebase Firestore está funcionando!\n\nEncontrados ${users.length} usuário(s) na coleção "users".`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro desconhecido ao conectar ao Firestore';
      console.error('[TEST] ❌ Erro ao conectar Firestore:', errorMsg);
      
      Alert.alert(
        'Erro',
        `Falha ao conectar ao Firestore:\n\n${errorMsg}`,
        [{ text: 'OK' }]
      );
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}> 
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <View style={styles.headerButtonsLeft}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <MaterialCommunityIcons name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} size={24} color={themeColors.primary} />
          </TouchableOpacity>
        </View>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Bem-vindo</Text>
        <View style={styles.headerButtonsRight}>
          <TouchableOpacity onPress={() => Alert.alert('Notificação', 'Esta é uma notificação de teste do módulo de notificações!')} style={styles.iconButton}>
            <MaterialCommunityIcons name="bell" size={24} color={themeColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.iconButton}>
            <MaterialCommunityIcons name="logout" size={24} color={themeColors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={[styles.container, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: themeColors.text }]}>Bem-vindo!</Text>
          <Text style={[styles.subtitle, { color: themeColors.textLight }]}>Gerencie seus cadastros com facilidade</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonRegister,
              { backgroundColor: themeColors.surface, borderLeftColor: themeColors.primary },
              isPressed === 'register' && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('Register')}
            onPressIn={() => handlePressIn('register')}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={[styles.buttonIconWrapper, { backgroundColor: themeColors.background }]}> 
              <MaterialCommunityIcons name="file-document-plus" size={32} color={themeColors.primary} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, { color: themeColors.text }]}>Cadastro</Text>
              <Text style={[styles.buttonSubtitle, { color: themeColors.textLight }]}>Novo usuário</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonList,
              { backgroundColor: themeColors.surface, borderLeftColor: themeColors.success },
              isPressed === 'list' && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('List')}
            onPressIn={() => handlePressIn('list')}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={[styles.buttonIconWrapper, { backgroundColor: themeColors.background }]}> 
              <MaterialCommunityIcons name="account-multiple" size={32} color={themeColors.success} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, { color: themeColors.text }]}>Cadastrados</Text>
              <Text style={[styles.buttonSubtitle, { color: themeColors.textLight }]}>Ver lista</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonLogin,
              { backgroundColor: themeColors.surface, borderLeftColor: themeColors.warning },
              isPressed === 'login' && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('Login')}
            onPressIn={() => handlePressIn('login')}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={[styles.buttonIconWrapper, { backgroundColor: themeColors.background }]}> 
              <MaterialCommunityIcons name="lock" size={32} color={themeColors.warning} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, { color: themeColors.text }]}>Login</Text>
              <Text style={[styles.buttonSubtitle, { color: themeColors.textLight }]}>Acessar conta</Text>
            </View>
          </TouchableOpacity>

          {/* Botão de Teste Firebase (Desenvolvimento) */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonTest,
              { backgroundColor: themeColors.surface, borderLeftColor: '#8B5CF6' },
              isPressed === 'test' && styles.buttonPressed,
              testLoading && { opacity: 0.6 },
            ]}
            onPress={testFirestore}
            onPressIn={() => handlePressIn('test')}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
            disabled={testLoading}
          >
            <View style={[styles.buttonIconWrapper, { backgroundColor: themeColors.background }]}> 
              <MaterialCommunityIcons name="cloud-check" size={32} color={themeColors.primaryLight} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, { color: themeColors.text }]}>Testar Firebase</Text>
              <Text style={[styles.buttonSubtitle, { color: themeColors.textLight }]}>{testLoading ? 'Conectando...' : 'Validar Firestore'}</Text>
            </View>
          </TouchableOpacity>

          {/* Botão de Vídeo de Demonstração */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonVideo,
              { backgroundColor: themeColors.surface, borderLeftColor: '#EC4899' },
              isPressed === 'video' && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('VideoPlayer')}
            onPressIn={() => handlePressIn('video')}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={[styles.buttonIconWrapper, { backgroundColor: themeColors.background }]}> 
              <MaterialCommunityIcons name="play-circle" size={32} color="#EC4899" />
            </View>
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, { color: themeColors.text }]}>Ver Demonstração</Text>
              <Text style={[styles.buttonSubtitle, { color: themeColors.textLight }]}>Vídeo do aplicativo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: height * 0.04,
    marginTop: height * 0.02,
  },
  logo: {
    width: width > 400 ? 120 : 100,
    height: width > 400 ? 120 : 100,
    borderRadius: 60,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: width > 400 ? 32 : 28,
    fontWeight: '700',
    marginBottom: height * 0.008,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width > 400 ? 16 : 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: height * 0.013,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.024,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonPressed: {
    shadowOpacity: 0.15,
    elevation: 5,
    transform: [{ scale: 0.98 }],
  },
  buttonRegister: {
    borderLeftWidth: 4,
  },
  buttonList: {
    borderLeftWidth: 4,
  },
  buttonLogin: {
    borderLeftWidth: 4,
  },
  buttonTest: {
    borderLeftWidth: 4,
  },
  buttonVideo: {
    borderLeftWidth: 4,
  },
  buttonIconWrapper: {
    width: width > 400 ? 64 : 56,
    height: width > 400 ? 64 : 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: width > 400 ? 16 : 15,
    fontWeight: '600',
    marginBottom: height * 0.004,
  },
  buttonSubtitle: {
    fontSize: width > 400 ? 13 : 12,
    fontWeight: '400',
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
    marginRight: width * 0.03,
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 0.5,
  },
});
