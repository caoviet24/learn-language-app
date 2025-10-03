import axios from 'axios';
import { baseUrl } from './baseUrl';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

function createAxiosJwtInstance() {
    const axiosJWT = axios.create({
        baseURL: baseUrl,
    });
    axiosJWT.interceptors.request.use(async (config) => {
        console.log('➡️ API Request:', config.method?.toUpperCase(), config.url, config.data);
        let token;

        if (Platform.OS === 'web') {
            token = localStorage.getItem('access_token');
        } else {
            token = await SecureStore.getItemAsync('access_token');
        }
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });
    axiosJWT.interceptors.response.use(
        (res) => {
            console.log('✅ API Response:', res.status, res.data);
            return res;
        },
        (err) => {
            console.error('❌ API Error:', err.response?.status, err.response?.data);
            return Promise.reject(err);
        },
    );

    return axiosJWT;
}

const axiosJWT = createAxiosJwtInstance();

export default axiosJWT;
