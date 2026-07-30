import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AutthContext'

export default function App() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </View>
    </TouchableWithoutFeedback>
  );
}