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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }: any) {
	const { isDark, toggleTheme, colors } = useTheme();
	
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			navigation.goBack();
			return true;
		});

		return () => backHandler.remove();
	}, [navigation]);

	const handleSendResetEmail = async () => {
		if (!email.trim()) {
			Alert.alert('Erro', 'Por favor, digite seu email');
			return;
		}

		// Validação básica de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert('Erro', 'Por favor, digite um email válido');
			return;
		}

		setLoading(true);

		try {
			await sendPasswordResetEmail(auth, email);
			
			console.log('[ForgotPassword] ✅ Email de redefinição enviado para:', email);
			
			setEmailSent(true);
			Alert.alert(
				'Email enviado com sucesso',
				`Um link de redefinição de senha foi enviado para ${email}.\n\nVerifique sua caixa de entrada e spam.`,
				[
					{
						text: 'Voltar ao Login',
						onPress: () => {
							setEmail('');
							setEmailSent(false);
							navigation.goBack();
						}
					}
				]
			);
		} catch (error: any) {
			console.error('[ForgotPassword] ❌ Erro ao enviar email:', error);
			
			let mensagemErro = 'Erro ao enviar email de redefinição';
			
			if (error.code === 'auth/user-not-found') {
				mensagemErro = 'Nenhuma conta encontrada com este email';
			} else if (error.code === 'auth/invalid-email') {
				mensagemErro = 'Email inválido';
			} else if (error.code === 'auth/too-many-requests') {
				mensagemErro = 'Muitas tentativas. Tente novamente mais tarde';
			}
			
			Alert.alert('Erro', mensagemErro);
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
				<Text style={[styles.headerTitle, { color: colors.text }]}>Recuperar Senha</Text>
				<View style={styles.headerButtonsRight}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
						<MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
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
						<MaterialCommunityIcons name="email-outline" size={56} color={colors.primary} />
						<Text style={[styles.title, { color: colors.text }]}>Redefinir Senha</Text>
						<Text style={[styles.subtitle, { color: colors.textLight }]}>
							Digite o email da sua conta para receber um link de redefinição
						</Text>
					</View>

					{!emailSent ? (
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
									editable={!loading}
								/>
							</View>

							<TouchableOpacity
								style={[styles.button, { backgroundColor: colors.primary }, loading && { backgroundColor: colors.primaryLight }]}
								onPress={handleSendResetEmail}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<>
										<MaterialCommunityIcons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
										<Text style={[styles.buttonText, { color: colors.surface }]}>Enviar Link de Redefinição</Text>
									</>
								)}
							</TouchableOpacity>

							<View style={styles.infoBox}>
								<MaterialCommunityIcons name="information" size={20} color={colors.primary} />
								<Text style={[styles.infoText, { color: colors.textLight }]}>
									Você receberá um email com um link seguro para criar uma nova senha
								</Text>
							</View>
						</View>
					) : (
						<View style={[styles.successBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
							<MaterialCommunityIcons name="check-circle" size={56} color={colors.primary} />
							<Text style={[styles.successTitle, { color: colors.text }]}>Email Enviado!</Text>
							<Text style={[styles.successText, { color: colors.textLight }]}>
								Verifique sua caixa de entrada e pasta de spam para o email de redefinição de senha.
							</Text>
							<TouchableOpacity
								style={[styles.button, { backgroundColor: colors.primary, marginTop: 20 }]}
								onPress={() => {
									setEmail('');
									setEmailSent(false);
									navigation.goBack();
								}}
							>
								<Text style={[styles.buttonText, { color: colors.surface }]}>Voltar ao Login</Text>
							</TouchableOpacity>
						</View>
					)}

					<View style={styles.footer}>
						<Text style={[styles.footerText, { color: colors.textLight }]}>Lembrou a senha?</Text>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Text style={[styles.loginLink, { color: colors.primary }]}>Volte ao Login</Text>
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
		justifyContent: 'flex-end',
		alignItems: 'center',
		flex: 0.25,
	},
	iconButton: {
		padding: 8,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	headerContainer: {
		alignItems: 'center',
		marginTop: 40,
		marginBottom: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		marginTop: 16,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		marginHorizontal: 16,
		lineHeight: 24,
	},
	formContainer: {
		marginBottom: 24,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginTop: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
	infoBox: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginTop: 20,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: 'rgba(0, 0, 0, 0.02)',
	},
	infoText: {
		fontSize: 14,
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
	successBox: {
		alignItems: 'center',
		paddingVertical: 32,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 2,
		marginVertical: 24,
	},
	successTitle: {
		fontSize: 24,
		fontWeight: '700',
		marginTop: 16,
		marginBottom: 8,
	},
	successText: {
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 24,
		marginHorizontal: 8,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 16,
		paddingVertical: 20,
	},
	footerText: {
		fontSize: 14,
		marginRight: 4,
	},
	loginLink: {
		fontSize: 14,
		fontWeight: '600',
		textDecorationLine: 'underline',
	},
});
