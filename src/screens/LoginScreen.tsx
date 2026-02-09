import React, { useState, useEffect } from 'react';
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
	BackHandler,
	Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
	const { isDark, toggleTheme, colors } = useTheme();
	
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			navigation.popToTop();
			return true;
		});

		return () => backHandler.remove();
	}, [navigation]);

	const handleLogin = async () => {
		if (!email || !senha) {
			Alert.alert('Erro', 'Por favor, preencha todos os campos');
			return;
		}

		setLoading(true);

		try {
			// Verificar credenciais no AsyncStorage
			const dadosArmazenados = await AsyncStorage.getItem('usuarios');
			
			if (!dadosArmazenados) {
				Alert.alert('Erro', 'Nenhum usuário cadastrado no sistema');
				setLoading(false);
				return;
			}

			const usuarios = JSON.parse(dadosArmazenados);
			
			// Buscar usuário pelo email
			const usuarioEncontrado = usuarios.find((u: any) => u.email === email);

			if (!usuarioEncontrado) {
				Alert.alert('Erro', 'Usuário não encontrado');
				setLoading(false);
				return;
			}

			// Aqui você poderia validar a senha se houvesse hash armazenado
			// Por enquanto, apenas verificamos o email
			console.log('[LOGIN] ✅ Login bem-sucedido:', usuarioEncontrado.nome);
			
			Alert.alert('Sucesso', `Bem-vindo, ${usuarioEncontrado.nome}!`);
			setEmail('');
			setSenha('');
			
			// Navegar para a tela Details
			navigation.navigate('Details');
		} catch (error: any) {
			console.error('[LOGIN] ❌ Erro ao fazer login:', error);
			Alert.alert('Erro', 'Erro ao efetuar login. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
			<View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
				<View style={styles.headerButtonsLeft}>
					<TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
						<MaterialCommunityIcons 
							name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} 
							size={24} 
							color={colors.primary}
						/>
					</TouchableOpacity>
				</View>
				<Text style={[styles.headerTitle, { color: colors.text }]}>Login</Text>
			<View style={styles.headerButtonsRight}>
				<TouchableOpacity onPress={() => navigation.popToTop()} style={styles.iconButton}>
					<MaterialCommunityIcons name="logout" size={24} color={colors.danger} />
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
					<MaterialCommunityIcons name="lock" size={56} color={colors.primary} />
					<Text style={[styles.title, { color: colors.text }]}>Login</Text>
					<Text style={[styles.subtitle, { color: colors.textLight }]}>Acesse sua conta</Text>
				</View>

				<View style={styles.formContainer}>
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

					<TouchableOpacity
						style={[styles.button, { backgroundColor: colors.primary }, loading && { backgroundColor: colors.primaryLight }]}
						onPress={handleLogin}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={[styles.buttonText, { color: colors.surface }]}>Entrar</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.forgotPasswordButton}
						onPress={() => navigation.navigate('ForgotPassword')}
					>
						<Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Esqueci minha senha</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.footer}>
					<Text style={[styles.footerText, { color: colors.textLight }]}>Não tem conta?</Text>
					<TouchableOpacity onPress={() => navigation.navigate('Register')}>
						<Text style={[styles.registerLink, { color: colors.primary }]}>Cadastre-se aqui</Text>
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
	},
	scrollView: {
		flex: 1,
	},
	container: {
		flex: 1,
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
		marginBottom: 4,
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
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.5,
	},
	forgotPasswordButton: {
		alignItems: 'center',
		marginTop: 12,
	},
	forgotPasswordText: {
		fontSize: 14,
		fontWeight: '600',
		textDecorationLine: 'underline',
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