import axiosJWT from '@/configs/axios';

async function login({email, password}: { email: string; password: string }) {
    const res = await axiosJWT.post('/auth/login', {
        email,
        password
    });
    return res.data;
}


async function register({firstName, lastName, email, password}: { firstName: string; lastName: string; email: string; password: string }) {
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate network delay
    const res = await axiosJWT.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
    });
    return res.data;
}

async function getMyInfo() {
    const res = await axiosJWT.get('/auth/me');
    console.log('getMyInfo response:', res.data);
    
    return res.data;
}


const authService = {
    login,
    register,
    getMyInfo,
};

export default authService;