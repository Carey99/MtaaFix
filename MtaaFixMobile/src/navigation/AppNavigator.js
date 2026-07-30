import React, { useEffect, useState, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';
import { AuthContext } from '../context/AutthContext';

// Auth
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Client
import ClientDashboard from '../screens/ClientDashboard';
import PostJobScreen from '../screens/PostJobScreen';
import ProfileScreen from '../screens/ProfileScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';

// Worker
import WorkerDashboard from '../screens/WorkerDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isLoggedIn, userRole } = useContext(AuthContext);

    // Show loading while checking auth
    if (isLoggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08111f' }}>
                <ActivityIndicator size="large" color="#185FA5" />
                <Text style={{ color: '#fff', marginTop: 16 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: '#08111f',
                },
            }}
        >
            {!isLoggedIn ? (
                // Auth Stack - User not logged in
                <Stack.Group>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Group>
            ) : userRole === 'client' ? (
                // Client Stack - User is a client
                <Stack.Group>
                    <Stack.Screen
                        name="ClientDashboard"
                        component={ClientDashboard}
                        options={{ animationEnabled: false }}
                    />
                    <Stack.Screen name="PostJob" component={PostJobScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                </Stack.Group>
            ) : userRole === 'worker' ? (
                // Worker Stack - User is a worker
                <Stack.Group>
                    <Stack.Screen
                        name="WorkerDashboard"
                        component={WorkerDashboard}
                        options={{ animationEnabled: false }}
                    />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
                </Stack.Group>
            ) : (
                // Error state - unknown role
                <Stack.Group>
                    <Stack.Screen
                        name="RoleError"
                        component={() => (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#08111f',
                                    padding: 20,
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 18, marginBottom: 16 }}>
                                    Error: Invalid Role
                                </Text>
                                <Text style={{ color: '#999', fontSize: 14, textAlign: 'center' }}>
                                    Role received: "{userRole}"
                                </Text>
                            </View>
                        )}
                    />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}