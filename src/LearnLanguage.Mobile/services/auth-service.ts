import axiosJWT from '@/configs/axios';
import { baseUrl } from '@/configs/baseUrl';
import axios from 'axios';

async function login({email, password}: { email: string; password: string }) {
    const res = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password
    });
    return res.data;
}


async function register({firstName, lastName, email, password}: { firstName: string; lastName: string; email: string; password: string }) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const res = await axiosJWT.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
    });
    return res.data;
}

async function getMyInfo() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await axiosJWT.get('/auth/me');
    return res.data;
}


const authService = {
    login,
    register,
    getMyInfo,
};

export default authService;