import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { getName, getPhone, getRole, logout } from '../store/authStore';
import { AuthContext } from '../context/AutthContext';

export default function ProfileScreen({ navigation }) {
    const  { user, userRole, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const name = user?.name || 'User';
    const phone = user?.phone || '';
    const role = userRole?.role || '';

    const onLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);

                            await logout();

                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert(
                                'Logout Failed',
                                'Please try again.'
                            );
                            setLoading(false);
                        }
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>My Profile</Text>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>U</Text>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.role}>
                            {userRole === 'client' ? 'Client' : userRole === 'worker' ? 'Worker' : 'Loading...'}
                        </Text>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Full Name</Text>
                        <Text style={styles.detailValue}>{name}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Phone Number</Text>
                        <Text style={styles.detailValue}>{phone}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Account Type</Text>
                        <Text style={styles.detailValue}>
                            {userRole === 'client' ? 'Job poster' : userRole === 'worker' ? 'Worker' : 'Loading...'}
                        </Text>
                    </View>
                </View>

                {/* Logout Button */}
                <Pressable
                    style={[styles.logoutButton, loading && styles.buttonDisabled]}
                    onPress={onLogout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    )}
                </Pressable>

                <View style={styles.spacing} />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
    },
    profileCard: {
        backgroundColor: '#1a2332',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a3d54',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#185FA5',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: '#999',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#185FA5',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailItem: {
        backgroundColor: '#1a2332',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#2a3d54',
    },
    detailLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#D32F2F',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    spacing: {
        height: 40,
    },
});