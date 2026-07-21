import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableNativeFeedbackComponent } from "react-native";

//---- SAVE ----------------
//Called after login or register succeeds
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


//---- READ ---------------
export const getToken = () => AsyncStorage.getItem('access_token');
export const getRole  = () => AsyncStorage.getItem('user_role');
export const getName  = () => AsyncStorage.getItem('user_name');
export const getId    = () => AsyncStorage.getItem('user_id');
export const getPhone = () => AsyncStorage.getItem('user_phone');

// Get everything at once — used by AppNavigator on app open
export const getAuthState = async () => {
  const pairs = await AsyncStorage.multiGet([
    'access_token', 'user_role', 'user_name', 'user_id', 'user_phone'
  ]);
  // multiGet returns [['key', 'value'], ...] — convert to object
  const result = Object.fromEntries(pairs);
  return {
    token: result['access_token'],
    role:  result['user_role'],
    name:  result['user_name'],
    id:    result['user_id'],
    phone: result['user_phone'],
  };
};

// ─── CLEAR ───────────────────────────────────────────────
// Called on logout
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