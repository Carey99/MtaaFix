import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL = 'http://172.25.245.90:8000'; //Backend API base URL

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

//runs before every request is sent - attaches token automatically
//check for saved tokens add to add(to avoid adding Auth bearer manually)
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//runs before every response - catches 401 globally
//if server denies our token, clear immediately, user will be forced to login again
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_role', 'user_name'])
        }
        return Promise.reject(error);
    }
);

export default apiClient;