import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}