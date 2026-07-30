// src/screens/ClientDashboard.js

import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import JobCard from '../components/JobCard';

export default function ClientDashboard({ navigation }) {

	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchJobs();
	}, []);

	const fetchJobs = async () => {
		try {
			const response = await apiClient.get('/api/jobs/');
			setJobs(response.data);
		} catch (error) {
			console.log('Erro fetching jobs:', error);
		} finally {
			setLoading(false);
		}
	}
	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container}>
				{/* Greeting Section */}
				<View style={styles.greetingSection}>
					<Text style={styles.title}>Available Jobs</Text>
					<Text style={styles.subtitle}>Find work that matches your skills</Text>
				</View>

				{/* Main Action Buttons */}
				{loading ? (
					<ActivityIndicator size="large" color="#185FA5" />
				) : jobs.length > 0 ? (
					<FlatList
						data={jobs}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<JobCard
								job={item}
								onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
							 />
						)}
						scrollEnabled={false}
					 />
				) : (
					<Text style={{ color: '#999', textAlign: 'center', marginTop: 20 }}>
						No jobs available right now
					</Text>
				)}

				<Pressable
					style={styles.secondaryButton}
					onPress={() => navigation.navigate('Profile')}
				>
					<Text style={styles.buttonIcon}>👤</Text>
					<View style={styles.buttonContent}>
						<Text style={styles.buttonTitle}>My Profile</Text>
						<Text style={styles.buttonDescription}>
							View your details & settings
						</Text>
					</View>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#08111f',
	},
	container: {
		flex: 1,
		padding: 16,
	},
	greetingSection: {
		marginBottom: 30,
		marginTop: 10,
	},
	greeting: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#999',
		lineHeight: 24,
	},
	buttonContainer: {
		gap: 12,
	},
	primaryButton: {
		backgroundColor: '#185FA5',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	secondaryButton: {
		backgroundColor: '#1a2332',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#2a3d54',
	},
	buttonIcon: {
		fontSize: 24,
		marginRight: 12,
	},
	buttonContent: {
		flex: 1,
	},
	buttonTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
		marginBottom: 4,
	},
	buttonDescription: {
		fontSize: 13,
		color: '#999',
	},
});