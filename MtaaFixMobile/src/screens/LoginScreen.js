import React, { useState } from 'react';
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

export default function LoginScreen({ navigation }) {
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const onLogin = async () => {
		if (!phone || !password) {
			Alert.alert('Login', 'Enter phone number and password.');
			return;
		}

		setLoading(true);
		try {
			const response = await apiClient.post('/api/auth/login/', {
				phone,
				password,
			});

			await saveAuth(response.data.tokens, response.data.user);
			navigation.reset({
				index: 0,
				routes: [
					{ name: response.data.user.role === 'worker' ? 'WorkerDashboard' : 'ClientDashboard' },
				],
			});
		} catch (error) {
			const message = error.response?.data ? JSON.stringify(error.response.data) : error.message;
			Alert.alert('Login failed', message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthScreenShell>
				<Text style={styles.title}>Welcome back</Text>
				<Text style={styles.subtitle}>Sign in with your phone number and password.</Text>

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
					value={password}
					onChangeText={setPassword}
					placeholder="Password"
					placeholderTextColor="#7b8794"
					secureTextEntry
					autoCapitalize="none"
					style={styles.input}
				/>

				<Pressable style={styles.primaryButton} onPress={onLogin} disabled={loading}>
					{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign in</Text>}
				</Pressable>

				<Pressable onPress={() => navigation.navigate('Register')}>
					<Text style={styles.link}>Create an account</Text>
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
