// src/screens/ClientDashboard.js

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { getName } from '../store/authStore';

export default function ClientDashboard({ navigation }) {
    const [name, setName] = useState('');

    useEffect(() => {
        loadUserName();
    }, []);

    const loadUserName = async () => {
        const userName = await getName();
        setName(userName || 'User');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* Greeting Section */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>Hello, {name} 👋</Text>
                    <Text style={styles.subtitle}>What do you need fixed today?</Text>
                </View>

                {/* Main Action Buttons */}
                <View style={styles.buttonContainer}>
                    {/* Post a Job Button */}
                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('PostJob')}
                    >
                        <Text style={styles.buttonIcon}>📝</Text>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonTitle}>Post a Job</Text>
                            <Text style={styles.buttonDescription}>
                                Describe what you need fixed
                            </Text>
                        </View>
                    </Pressable>

                    {/* My Jobs Button */}
                    <Pressable
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('MyJobs')}
                    >
                        <Text style={styles.buttonIcon}>📋</Text>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonTitle}>My Jobs</Text>
                            <Text style={styles.buttonDescription}>
                                Track your posted jobs
                            </Text>
                        </View>
                    </Pressable>

                    {/* Profile Button */}
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
                </View>
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