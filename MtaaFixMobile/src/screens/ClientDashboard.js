import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ClientDashboard() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>Client Dashboard</Text>
				<Text style={styles.subtitle}>You are signed in as a client.</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: '#08111f' },
	container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
	title: { color: '#f8fafc', fontSize: 28, fontWeight: '700', marginBottom: 8 },
	subtitle: { color: '#94a3b8', fontSize: 16, textAlign: 'center' },
});
