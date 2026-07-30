import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuth = async (tokens, user) => {
    await AsyncStorage.multiSet([
        ['access_token', tokens.access],
        ['refresh_token', tokens.refresh],
        ['user_role', user.role],
        ['user_name', user.name],
        ['user_id', user.id],
        ['user_phone', user.phone],
    ]);
};

// FIXED: Now returns object with token and role
export const getAuthState = async () => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        const role = await AsyncStorage.getItem('user_role');
        
        console.log('[authStore] getAuthState - token exists:', !!token);
        console.log('[authStore] getAuthState - role:', role);
        
        return {
            token: token || null,
            role: role || null,
        };
    } catch (error) {
        console.error('[authStore] getAuthState error:', error);
        return {
            token: null,
            role: null,
        };
    }
};

export const getName = async () => {
    return await AsyncStorage.getItem('user_name') || 'User';
};

export const getPhone = async () => {
    return await AsyncStorage.getItem('user_phone');
};

export const getRole = async () => {
    return await AsyncStorage.getItem('user_role');
};

export const clearAuth = async () => {
    await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'user_role',
        'user_name',
        'user_id',
        'user_phone',
    ]);
};

export const logout = async () => {
    await clearAuth();
};