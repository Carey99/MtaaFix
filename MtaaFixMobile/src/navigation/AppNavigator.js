import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { getAuthState } from '../store/authStore';

// Screens
import LoginScreen      from '../screens/LoginScreen';
import RegisterScreen   from '../screens/RegisterScreen';
import ClientDashboard  from '../screens/ClientDashboard';
import WorkerDashboard  from '../screens/WorkerDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null); // null = still checking

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { token, role } = await getAuthState();

    if (!token) {
      // No token saved — user has never logged in or has logged out
      setInitialRoute('Login');
      return;
    }

    // Token exists — route by role
    if (role === 'client') {
      setInitialRoute('ClientDashboard');
    } else if (role === 'worker') {
      setInitialRoute('WorkerDashboard');
    } else {
      // Token exists but role is missing — safe fallback
      setInitialRoute('Login');
    }
  };

  // Still reading AsyncStorage — show spinner, render nothing yet
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a',
                     justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#185FA5" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}  // no default header bar
    >
      {/* Auth screens — no token needed */}
      <Stack.Screen name="Login"           component={LoginScreen} />
      <Stack.Screen name="Register"        component={RegisterScreen} />

      {/* Protected screens — reached only after login */}
      <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
      <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
    </Stack.Navigator>
  );
}