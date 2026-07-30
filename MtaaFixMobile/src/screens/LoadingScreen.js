import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#08111f',
            }}
        >
            <ActivityIndicator size="large" color="#185FA5" />
        </View>
    );
}