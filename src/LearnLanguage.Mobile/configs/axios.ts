import axios from 'axios';
import { baseUrl } from './baseUrl';
import * as SecureStore from 'expo-secure-store';



function createAxiosJwtInstance() {
    const axiosJWT = axios.create({
        baseURL: baseUrl
    });
    axiosJWT.interceptors.request.use(
        async (config) => {
            console.log(`Request made with ${config.method?.toUpperCase()} method to ${baseUrl}`);
            const token = await SecureStore.getItemAsync('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    return axiosJWT;
}

const axiosJWT = createAxiosJwtInstance();

export default axiosJWT;