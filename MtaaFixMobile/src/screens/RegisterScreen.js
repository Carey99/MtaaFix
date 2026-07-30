import React, { useState, useContext } from 'react';
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import apiClient from '../api/client';
import AuthScreenShell from '../components/auth/AuthScreenShell';
import { saveAuth } from '../store/authStore';
import { AuthContext } from '../context/AutthContext'

const ROLE_OPTIONS = [
	{ label: 'Client', value: 'client' },
	{ label: 'Worker', value: 'worker' },
];

export default function RegisterScreen({ navigation }) {
	const [phone, setPhone] = useState('');
	const [name, setName] = useState('');
	const [role, setRole] = useState('client');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useContext(AuthContext);

	const onRegister = async () => {
		if (!phone || !name || !password || !confirmPassword) {
			Alert.alert('Register', 'Fill in all fields.');
			return;
		}

		setLoading(true);
		try {
			const response = await apiClient.post('/api/auth/register/', {
				phone,
				name,
				role,
				password,
				confirm_password: confirmPassword,
			});

			await login(response.data.tokens, response.data.user);

		} catch (error) {
			const message = error.response?.data ? JSON.stringify(error.response.data) : error.message;
			Alert.alert('Register failed', message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthScreenShell>
				<Text style={styles.title}>Create account</Text>
				<Text style={styles.subtitle}>Choose whether you are joining as a client or worker.</Text>

				<TextInput
					value={phone}
					onChangeText={setPhone}
					placeholder="Phone number"
					placeholderTextColor="#7b8794"
					keyboardType="phone-pad"
					autoCapitalize="none"
					style={styles.input}
				/>
				<TextInput
					value={name}
					onChangeText={setName}
					placeholder="Full name"
					placeholderTextColor="#7b8794"
					autoCapitalize="words"
					style={styles.input}
				/>

				<View style={styles.roleRow}>
					{ROLE_OPTIONS.map((option) => {
						const selected = role === option.value;
						return (
							<Pressable
								key={option.value}
								style={[styles.roleButton, selected && styles.roleButtonSelected]}
								onPress={() => setRole(option.value)}
							>
								<Text style={[styles.roleText, selected && styles.roleTextSelected]}>
									{option.label}
								</Text>
							</Pressable>
						);
					})}
				</View>

				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Password"
					placeholderTextColor="#7b8794"
					secureTextEntry
					autoCapitalize="none"
					style={styles.input}
				/>
				<TextInput
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					placeholder="Confirm password"
					placeholderTextColor="#7b8794"
					secureTextEntry
					autoCapitalize="none"
					style={styles.input}
				/>

				<Pressable style={styles.primaryButton} onPress={onRegister} disabled={loading}>
					{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign up</Text>}
				</Pressable>

				<Pressable onPress={() => navigation.navigate('Login')}>
					<Text style={styles.link}>Already have an account? Sign in</Text>
				</Pressable>
		</AuthScreenShell>
	);
}

const styles = StyleSheet.create({
	title: { color: '#f8fafc', fontSize: 32, fontWeight: '700', marginBottom: 8 },
	subtitle: { color: '#94a3b8', fontSize: 16, marginBottom: 24 },
	input: {
		backgroundColor: '#122033',
		color: '#f8fafc',
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 14,
		marginBottom: 12,
	},
	roleRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
	roleButton: {
		flex: 1,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#2b3b52',
		paddingVertical: 14,
		alignItems: 'center',
		backgroundColor: '#0f1a2b',
	},
	roleButtonSelected: { borderColor: '#7dd3fc', backgroundColor: '#12324e' },
	roleText: { color: '#94a3b8', fontWeight: '700' },
	roleTextSelected: { color: '#e0f2fe' },
	primaryButton: {
		backgroundColor: '#185FA5',
		borderRadius: 14,
		paddingVertical: 15,
		alignItems: 'center',
		marginTop: 4,
	},
	primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
	link: { color: '#7dd3fc', marginTop: 16, textAlign: 'center' },
});
