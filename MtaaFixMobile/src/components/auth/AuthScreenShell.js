import React from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	View,
} from 'react-native';

export default function AuthScreenShell({ children }) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<View style={styles.container}>
					<View style={styles.inner}>{children}</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: '#08111f' },
	flex: { flex: 1 },
	container: { flex: 1, padding: 24, justifyContent: 'center' },
	inner: { width: '100%' },
});